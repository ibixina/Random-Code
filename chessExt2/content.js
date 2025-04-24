// content.js

(async function () {
  // ─── 1) Inject Stockfish engine into page context ────────────

  const wasmURL = chrome.runtime.getURL("engine/stockfish.wasm");
  const workerURL = chrome.runtime.getURL("engine/stockfish.worker.js");
  window.Module = {
    locateFile: (path) => {
      if (path.endsWith(".wasm")) return wasmURL;
      if (path.endsWith(".worker.js")) return workerURL;
      return path;
    },
  };

  // ─── Inject stockfish.js via <script> so it registers a global factory ─
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("engine/stockfish.js");
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("Failed to load engine/stockfish.js"));
    document.head.appendChild(script);
  });

  // ─── Grab the factory function that stockfish.js must have created ───
  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  const factory =
    typeof Stockfish === "function"
      ? Stockfish
      : typeof StockfishModule === "function"
        ? StockfishModule
        : (() => {
            throw new Error("No Stockfish factory found");
          })();

  // ─── Instantiate and perform UCI handshake inline ──────────────────
  const engine = factory();
  await new Promise((resolve) => {
    engine.onmessage = (e) => {
      if (e.data === "readyok") resolve();
    };
    engine.postMessage("uci");
    engine.postMessage("setoption name Threads value 2");
    engine.postMessage("setoption name Hash value 16");
    engine.postMessage("isready");
  });
  console.log("✅ Stockfish ready inline");

  // ─── Core analysis routine ────────────────────────────────────────
  async function analyzePosition(fen) {
    return new Promise((resolve) => {
      let eval_ = "?",
        pv = "",
        best;
      const timer = setTimeout(() => resolve({ error: "timeout" }), 5000);

      function onMsg(e) {
        const d = e.data;
        if (d.startsWith("info") && /score cp/.test(d)) {
          const m = d.match(/score cp ([-]?\d+)/);
          if (m) eval_ = (parseInt(m[1], 10) / 100).toFixed(2);
        }
        if (d.startsWith("info") && /score mate/.test(d)) {
          const m = d.match(/score mate ([-]?\d+)/);
          if (m) {
            const mv = parseInt(m[1], 10);
            eval_ = mv > 0 ? `M${mv}` : `M${Math.abs(mv)}`;
          }
        }
        if (d.startsWith("info") && d.includes("pv ")) {
          const m = d.match(/pv ([^\s]+)/);
          if (m) pv = m[1];
        }
        if (d.startsWith("bestmove")) {
          clearTimeout(timer);
          best = d.split(" ")[1];
          engine.removeEventListener("message", onMsg);
          resolve({ bestMove: best, evaluation: eval_, bestLine: pv });
        }
      }

      engine.addEventListener("message", onMsg);
      engine.postMessage(`position fen ${fen}`);
      engine.postMessage("go depth 12 movetime 300");
    });
  }
  async function analyzePosition(fen) {
    if (!engineReady) throw new Error("Engine not ready");
    return new Promise((resolve) => {
      let evaluation = "?",
        bestLine = "",
        bestMove;
      const timer = setTimeout(() => resolve({ error: "timeout" }), 5000);

      function handler(e) {
        const d = e.data;
        if (d.startsWith("info") && /score cp/.test(d)) {
          const m = d.match(/score cp ([-]?\d+)/);
          if (m) evaluation = (parseInt(m[1], 10) / 100).toFixed(2);
        }
        if (d.startsWith("info") && /score mate/.test(d)) {
          const m = d.match(/score mate ([-]?\d+)/);
          if (m) {
            const mv = parseInt(m[1], 10);
            evaluation = mv > 0 ? `M${mv}` : `M${Math.abs(mv)}`;
          }
        }
        if (d.startsWith("info") && d.includes("pv ")) {
          const m = d.match(/pv ([^\s]+)/);
          if (m) bestLine = m[1];
        }
        if (d.startsWith("bestmove")) {
          clearTimeout(timer);
          bestMove = d.split(" ")[1];
          engine.removeEventListener("message", handler);
          resolve({ bestMove, evaluation, bestLine });
        }
      }

      engine.addEventListener("message", handler);
      engine.postMessage(`position fen ${fen}`);
      engine.postMessage("go depth 12 movetime 300");
    });
  }

  // ─── 4) Utilities: FEN extraction, arrow drawing, display ────
  function generateFenFromDOM() {
    const board = document.querySelector("cg-board");
    if (!board) return null;
    const size = 66;
    const grid = Array.from({ length: 8 }, () => Array(8).fill(null));
    board.querySelectorAll("piece").forEach((piece) => {
      const [color, type] = piece.className.split(" ");
      const m = piece.style.transform.match(/translate\((\d+)px,\s*(\d+)px\)/);
      if (!m) return;
      const file = Math.round(parseInt(m[1], 10) / size);
      const rank = Math.round(parseInt(m[2], 10) / size);
      const map = {
        pawn: "p",
        knight: "n",
        bishop: "b",
        rook: "r",
        queen: "q",
        king: "k",
      };
      const ch = map[type];
      if (ch) grid[rank][file] = color === "white" ? ch.toUpperCase() : ch;
    });
    const rows = grid.map((row) =>
      row.reduce((acc, sq) => {
        if (sq) return acc + sq;
        const last = acc.slice(-1);
        return /\d/.test(last)
          ? acc.slice(0, -1) + (parseInt(last) + 1)
          : acc + "1";
      }, ""),
    );
    let isWhiteTurn = true;
    const turnIndicator = document.querySelector(".status");
    if (turnIndicator)
      isWhiteTurn = !turnIndicator.textContent.includes("Black to play");
    return rows.join("/") + (isWhiteTurn ? " w " : " b ") + "KQkq - 0 1";
  }

  function isBoardFlipped() {
    return (
      document
        .querySelector(".cg-wrap")
        ?.getAttribute("style")
        ?.includes("rotate(180deg)") || false
    );
  }

  function notationToCoords(move, flipped) {
    const f = "abcdefgh";
    let [ff, fr, tf, tr] = move.split("");
    let fromFile = f.indexOf(ff),
      fromRank = 8 - parseInt(fr, 10);
    let toFile = f.indexOf(tf),
      toRank = 8 - parseInt(tr, 10);
    if (flipped) {
      fromFile = 7 - fromFile;
      fromRank = 7 - fromRank;
      toFile = 7 - toFile;
      toRank = 7 - toRank;
    }
    return {
      from: { file: fromFile, rank: fromRank },
      to: { file: toFile, rank: toRank },
    };
  }

  function createMoveArrow(from, to) {
    document.getElementById("best-move-arrow")?.remove();
    const board = document.querySelector("cg-board");
    if (!board) return;
    const rect = board.getBoundingClientRect(),
      sq = rect.width / 8;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "best-move-arrow";
    Object.assign(svg.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      pointerEvents: "none",
      zIndex: 1000,
    });
    const [fx, fy] = [(from.file + 0.5) * sq, (from.rank + 0.5) * sq];
    const [tx, ty] = [(to.file + 0.5) * sq, (to.rank + 0.5) * sq];
    const angle = Math.atan2(ty - fy, tx - fx),
      L = 10;
    const x1 = tx - L * Math.cos(angle - Math.PI / 6),
      y1 = ty - L * Math.sin(angle - Math.PI / 6);
    const x2 = tx - L * Math.cos(angle + Math.PI / 6),
      y2 = ty - L * Math.sin(angle + Math.PI / 6);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M${fx},${fy} L${tx},${ty} M${tx},${ty} L${x1},${y1} M${tx},${ty} L${x2},${y2}`,
    );
    path.setAttribute("stroke", "rgba(0,155,255,0.8)");
    path.setAttribute("stroke-width", "4");
    svg.appendChild(path);
    board.appendChild(svg);
  }

  function displayEvaluation(evaluation, bestLine) {
    let el = document.getElementById("best-move-eval");
    if (!el) {
      el = document.createElement("div");
      el.id = "best-move-eval";
      Object.assign(el.style, {
        position: "fixed",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 10000,
        fontSize: "14px",
        maxWidth: "200px",
      });
      document.body.appendChild(el);
    }
    el.innerHTML = `
      <div>Evaluation: <strong>${evaluation}</strong></div>
      <div>Best line: <strong>${bestLine}</strong></div>
    `;
  }

  function debounce(fn, wait) {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), wait);
    };
  }

  // ─── 5) Main overlay logic ────────────────────────────────────
  async function main() {
    console.log("Best Move Overlay ready");
    const btn = document.createElement("button");
    btn.textContent = "Show Best Move";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 10000,
      padding: "8px 12px",
      backgroundColor: "#5ba65b",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    });
    document.body.appendChild(btn);

    let enabled = false,
      analyzing = false,
      lastFen = "";
    btn.addEventListener("click", () => {
      enabled = !enabled;
      btn.textContent = enabled ? "Hide Best Move" : "Show Best Move";
      btn.style.backgroundColor = enabled ? "#d85000" : "#5ba65b";
      if (!enabled) {
        document.getElementById("best-move-arrow")?.remove();
        document.getElementById("best-move-eval")?.remove();
      } else analyzeCurrent();
    });

    async function analyzeCurrent() {
      if (!enabled || analyzing) return;
      analyzing = true;
      const fen = generateFenFromDOM();
      if (!fen || fen === lastFen) {
        analyzing = false;
        return;
      }
      lastFen = fen;
      try {
        const { bestMove, evaluation, bestLine } = await analyzePosition(fen);
        if (bestMove && bestMove !== "(none)") {
          const flipped = isBoardFlipped();
          const { from, to } = notationToCoords(bestMove, flipped);
          createMoveArrow(from, to);
          displayEvaluation(evaluation, bestLine);
        }
      } catch (e) {
        console.error("Analysis error:", e);
      }
      analyzing = false;
    }

    new MutationObserver(
      debounce(() => {
        if (enabled) analyzeCurrent();
      }, 500),
    ).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    document.addEventListener("keydown", (e) => {
      if (e.altKey && e.key.toLowerCase() === "b") btn.click();
    });
  }

  // Launch
  if (document.readyState === "complete") main();
  else window.addEventListener("load", main);
})();
