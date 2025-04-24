// content_script.js

(async function () {
  console.log("[LichessBestMove] Script loaded");
  const DEFAULT_DEPTH = 5;

  // Load search depth from storage
  const { depth = DEFAULT_DEPTH } = await new Promise((resolve) =>
    chrome.storage.sync.get({ depth: DEFAULT_DEPTH }, resolve),
  );

  // Wait until the cg-board element is present
  const boardEl = await waitForBoard();

  // Create the overlay container
  const overlay = document.createElement("div");
  Object.assign(overlay.style, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  });
  boardEl.parentElement.style.position = "relative";
  boardEl.parentElement.appendChild(overlay);

  let lastFen = "";

  // Every second, generate FEN and get best move from custom engine
  setInterval(() => {
    const fen = generateFenFromDOM();
    if (fen && fen !== lastFen) {
      lastFen = fen;
      const bestMove = window.getBestMove(fen, depth);
      console.log("[LichessBestMove] Custom engine best move:", bestMove);
      drawArrow(bestMove);
    }
  }, 1000);

  // Utility: wait for cg-board element
  function waitForBoard() {
    return new Promise((resolve) => {
      const b = document.querySelector("cg-board");
      if (b) return resolve(b);
      const observer = new MutationObserver(() => {
        const b2 = document.querySelector("cg-board");
        if (b2) {
          observer.disconnect();
          resolve(b2);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Utility: extract FEN from <piece> positions
  function generateFenFromDOM() {
    const board = document.querySelector("cg-board");
    if (!board) return null;

    const size = 66;
    const grid = Array.from({ length: 8 }, () => Array(8).fill(null));

    board.querySelectorAll("piece").forEach((piece) => {
      const [color, type] = piece.className.split(" ");
      const m = piece.style.transform.match(/translate\((\d+)px,\s*(\d+)px\)/);
      if (!m) return;
      const x = parseInt(m[1], 10),
        y = parseInt(m[2], 10),
        file = Math.round(x / size),
        rank = Math.round(y / size);
      if (file < 0 || file > 7 || rank < 0 || rank > 7) return;

      const map = {
        pawn: "p",
        knight: "n",
        bishop: "b",
        rook: "r",
        queen: "q",
        king: "k",
      };
      const ch = map[type];
      if (!ch) return;
      grid[rank][file] = color === "white" ? ch.toUpperCase() : ch;
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

    return rows.join("/") + " w - - 0 1";
  }

  // Utility: convert square to pixel coordinates
  function coordToPixel(square, S) {
    const f = square.charCodeAt(0) - 97;
    const r = 8 - parseInt(square[1], 10);
    return { x: (f + 0.5) * S, y: (r + 0.5) * S };
  }

  // Utility: draw an arrow for the move
  function drawArrow(move) {
    if (!move) return;
    overlay.innerHTML = "";
    const S = boardEl.clientWidth / 8;
    const from = coordToPixel(move.slice(0, 2), S),
      to = coordToPixel(move.slice(2, 4), S);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    Object.assign(svg.style, { position: "absolute", top: 0, left: 0 });
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    const defs = document.createElementNS(svgNS, "defs");
    const marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "0");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", "M0,0 L0,7 L10,3.5 z");
    path.setAttribute("fill", "red");
    marker.appendChild(path);
    defs.appendChild(marker);
    svg.appendChild(defs);

    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", from.x);
    line.setAttribute("y1", from.y);
    line.setAttribute("x2", to.x);
    line.setAttribute("y2", to.y);
    line.setAttribute("stroke", "red");
    line.setAttribute("stroke-width", S * 0.1);
    line.setAttribute("marker-end", "url(#arrowhead)");
    svg.appendChild(line);

    overlay.appendChild(svg);
  }
})();
