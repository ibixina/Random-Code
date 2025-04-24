// This will be injected into the Lichess page
console.log("Chess analyzer loaded");

let currentFen = "";
let stockfish = null;

// Initialize Stockfish
async function initStockfish() {
  // Load Stockfish from CDN
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js";
  document.head.appendChild(script);

  // Wait for Stockfish to load
  await new Promise((resolve) => {
    script.onload = () => {
      stockfish = new Worker(script.src);
      console.log("Stockfish loaded");
      resolve();
    };
  });
}

initStockfish();

function generateFenFromDOM() {
  const board = document.querySelector("cg-board");
  if (!board) return null;
  const size = 66;
  const grid = Array.from({ length: 8 }, () => Array(8).fill(null));
  board.querySelectorAll("piece").forEach((piece) => {
    const [color, type] = piece.className.split(" ");
    const style = piece.style;
    const m = style.transform.match(/translate\((\d+)px,\s*(\d+)px\)/);
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

  // Determine current turn by checking if it's white's move
  let isWhiteTurn = true;
  const turnIndicator = document.querySelector(".status");
  if (turnIndicator?.textContent) {
    isWhiteTurn = !turnIndicator.textContent.includes("Black to play");
  }

  return rows.join("/") + (isWhiteTurn ? " w " : " b ") + "- - 0 1";
}

// Function to analyze position with Stockfish
function analyzePosition(fen) {
  if (!stockfish) return;

  stockfish.postMessage("position fen " + fen);
  stockfish.postMessage("go depth 15");

  stockfish.onmessage = function (event) {
    const message = event.data;
    if (message.startsWith("bestmove")) {
      const moves = message.split(" ");
      const bestMove = moves[1];
      const ponderMove = moves[3];

      // Send analysis to the page
      window.postMessage(
        {
          type: "ANALYSIS_RESULT",
          bestMove,
          ponderMove,
        },
        "*",
      );
    }
  };
}

// Function to extract and validate FEN
function extractFen() {
  const fen = generateFenFromDOM();
  if (fen && fen !== currentFen) {
    try {
      currentFen = fen;
      // Analyze the position
      analyzePosition(fen);
      // Send FEN to the page
      window.postMessage({ type: "FEN_UPDATED", fen }, "*");
    } catch (e) {
      console.error("Invalid FEN:", e);
    }
  }
}

// Listen for position changes
const observer = new MutationObserver(() => {
  extractFen();
});

// Start observing the chess board
const board = document.querySelector("cg-board");
if (board) {
  observer.observe(board, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style"],
  });
}

// Initial FEN extraction
extractFen();

// Listen for messages from the extension
window.addEventListener("message", (event) => {
  if (event.data.type === "GET_FEN") {
    extractFen();
  }
});
