// content.js

let lastFen = "";
let myTurn = true;
let lastBestMove = null;
// ————————————————————————————————————————————————
// 1) FEN extraction & board utilities
// ————————————————————————————————————————————————

function generateFenFromDOM() {
  const board = document.querySelector("cg-board");
  const turn = document.querySelector("div.rclock-black[class*='running']")
    ? "black"
    : "white";
  if (!board) return null;

  const size = board.getBoundingClientRect().width / 8;
  const grid = Array.from({ length: 8 }, () => Array(8).fill(null));

  board.querySelectorAll("piece").forEach((piece) => {
    if (
      !piece.className.includes("white") &&
      !piece.className.includes("black")
    ) {
      return;
    }
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

  const rows = grid.slice().map((row) =>
    row.reduce((acc, sq) => {
      if (sq) return acc + sq;
      const last = acc.slice(-1);
      return /\d/.test(last)
        ? acc.slice(0, -1) + (parseInt(last) + 1)
        : acc + "1";
    }, ""),
  );

  let isBlackTurn = turn === "black";
  return `${rows.join("/")}${isBlackTurn ? " b" : " w"} - - 0 1`;
}

function notationToCoords(move) {
  const f = "abcdefgh";
  const [ff, fr, tf, tr] = move.split("");
  const fromFile = f.indexOf(ff);
  const fromRank = 8 - parseInt(fr, 10);
  const toFile = f.indexOf(tf);
  const toRank = 8 - parseInt(tr, 10);

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
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

// ————————————————————————————————————————————————
// 2) Cloud‐Eval analysis via Lichess API
// ————————————————————————————————————————————————
async function analyzeViaLocal(fen) {
  const res = await fetch("https://10.20.67.231:5000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen }),
  });
  if (!res.ok) throw new Error("Local analysis failed");
  return await res.json(); // { bestMove, evaluation }
}

async function fetchLichessEval(fen) {
  const url = `https://lichess.org/api/cloud-eval?multiPv=1&fen=${encodeURIComponent(fen)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Lichess API down");
  const data = await res.json();
  if (!data.pvs?.length) throw new Error("No Lichess eval");
  const pv = data.pvs[0];
  return {
    bestMove: pv.moves,
    evaluation: pv.mate != null ? `M${pv.mate}` : (pv.cp / 100).toFixed(2),
    bestLine: pv.moves,
  };
}

// 2) Fallback: Chess.com public analysis
async function fetchChesscomEval(fen) {
  const url = `https://api.chess.com/pub/analysis?fen=${encodeURIComponent(fen)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Chess.com API down");
  const data = await res.json();
  // 'analysis' is an array of lines; the first is the engine’s top choice
  const top = data.analysis?.[0];
  if (!top) throw new Error("No Chess.com eval");
  return {
    bestMove: top.best,
    evaluation:
      top.eval !== undefined
        ? (top.eval / 100).toFixed(2)
        : top.mate > 0
          ? `M${top.mate}`
          : `M${Math.abs(top.mate)}`,
    bestLine: top.line.join(" "),
  };
}

// 3) Unified function
async function analyzePosition(fen) {
  console.log("analyzePositionc: ", fen);
  try {
    return await analyzeViaLocal(fen);
  } catch (e) {
    //return await fetchLichessEval(fen);
  }
}

// 3) Main overlay logic
// ————————————————————————————————————————————————
async function main() {
  console.log("Best Move Overlay initializing…");

  // Toggle button
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
    } else {
      analyzeCurrent();
    }
  });

  async function analyzeCurrent() {
    console.log(enabled, analyzing);
    if (!enabled || analyzing) return;
    console.log("Analyzing current position…");
    analyzing = true;
    const fen = generateFenFromDOM();
    console.log("FEN:", fen);
    try {
      const { bestMove, evaluation, bestLine } = await analyzePosition(fen);
      if (bestMove && bestMove !== "(none)") {
        const { from, to } = notationToCoords(bestMove);
        lastBestMove = { from, to };
        createMoveArrow(from, to);
        displayEvaluation(evaluation, bestLine);
      }
    } catch (e) {
      console.error("Analysis error:", e);
    }
    analyzing = false;
  }

  // Observe and auto‐analyze on board changes

  setInterval(() => {
    if (!enabled) return;

    const currentFen = generateFenFromDOM();
    if (!currentFen || currentFen === lastFen) return;

    lastFen = currentFen;
    console.log("Making new analysis request…");
    analyzeCurrent();
  }, 1000); // every 1 second

  // Alt+B shortcut

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() !== "x" || !lastBestMove) return;

    const board = document.querySelector("cg-board");
    if (!board) return;

    const rect = board.getBoundingClientRect();
    const squareSize = rect.width / 8;
    const { from, to } = lastBestMove;

    const toViewport = ({ file, rank }) => ({
      x: rect.left + file * squareSize + squareSize / 2,
      y: rect.top + rank * squareSize + squareSize / 2,
    });

    const showDot = ({ x, y }, color = "red") => {
      const dot = document.createElement("div");
      Object.assign(dot.style, {
        position: "fixed",
        left: `${x - 5}px`,
        top: `${y - 5}px`,
        width: "10px",
        height: "10px",
        backgroundColor: color,
        borderRadius: "50%",
        zIndex: 9999,
        pointerEvents: "none",
      });
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 400);
    };

    const fireClickSeq = ({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return;
      const opts = { bubbles: true, cancelable: true, clientX: x, clientY: y };
      ["mousedown", "mouseup", "click"].forEach((type) => {
        el.dispatchEvent(new MouseEvent(type, opts));
      });
      showDot({ x, y });
    };

    const src = toViewport(from);
    const dst = toViewport(to);

    fireClickSeq(src);
    setTimeout(() => fireClickSeq(dst), 100);
  });

  console.log("Best Move Overlay ready");
}

if (document.readyState === "complete") {
  main();
} else {
  window.addEventListener("load", main);
}
