// ==UserScript==
// @name         Lichess WebSocket Interceptor (unsafeWindow Version)
// @namespace    http://tampermonkey.net/
// @version      2025-04-26
// @description  Intercept Lichess WebSocket traffic with unsafeWindow
// @author       You
// @match        https://lichess.org/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      localhost
// ==/UserScript==

(async function() {
  "use strict";

  const OriginalWebSocket = unsafeWindow.WebSocket;
  let currentTurn, currentFen, analyzing;
  let enabled = false;

  unsafeWindow.WebSocket = new Proxy(OriginalWebSocket, {
    construct(target, args) {
      const ws = new target(...args);

      ws.addEventListener("message", (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.t === "move") {
            console.log("[Chess Move Detected]", parsed.d.uci);
            const ply = parsed.d.ply;
            const turn = ply % 2 === 0 ? "white" : "black";
            const fen =
              parsed.d.fen + (turn === "white" ? " w" : " b") + " - - 0 1";
            console.log("[Chess FEN]", fen);
            currentFen = fen;
            if (enabled) analyzeCurrent();
          }
        } catch (err) { }
      });

      const originalSend = ws.send.bind(ws);
      ws.send = function(data) {
        console.log("[Captured Outgoing]", data);
        return originalSend(data);
      };

      return ws;
    },
  });

  async function analyzePosition(fen) {
    try {
      return await analyzeViaLocal(fen);
    } catch (e) {
      console.error("Local analysis failed", e);
    }
  }

  async function analyzeViaLocal(fen) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: "http://localhost:5000/analyze",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ fen }),
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            resolve(JSON.parse(response.responseText));
          } else {
            reject(new Error("Local analysis failed"));
          }
        },
        onerror: (error) => reject(error),
      });
    });
  }

  function createMoveArrow(from, to) {
    document.getElementById("best-move-arrow")?.remove();
    const board = document.querySelector("cg-board");
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const sq = rect.width / 8;
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
    const angle = Math.atan2(ty - fy, tx - fx);
    const L = 60;
    const x1 = tx - L * Math.cos(angle - Math.PI / 6);
    const y1 = ty - L * Math.sin(angle - Math.PI / 6);
    const x2 = tx - L * Math.cos(angle + Math.PI / 6);
    const y2 = ty - L * Math.sin(angle + Math.PI / 6);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M${fx},${fy} L${tx},${ty} M${tx},${ty} L${x1},${y1} M${tx},${ty} L${x2},${y2}`,
    );
    path.setAttribute("stroke", "rgba(0,155,255,0.8)");
    path.setAttribute("stroke-width", "8");
    svg.appendChild(path);
    board.appendChild(svg);
  }

  function notationToCoords(uci) {
    const fileMap = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };
    const fromFile = fileMap[uci[0]];
    const fromRank = parseInt(uci[1], 10) - 1;
    const toFile = fileMap[uci[2]];
    const toRank = parseInt(uci[3], 10) - 1;

    const flipped = currentTurn === "black"; // assume black is at bottom when we play black

    return {
      from: {
        file: flipped ? 7 - fromFile : fromFile,
        rank: flipped ? fromRank : 7 - fromRank,
      },
      to: {
        file: flipped ? 7 - toFile : toFile,
        rank: flipped ? toRank : 7 - toRank,
      },
    };
  }

  async function analyzeCurrent() {
    if (!enabled || analyzing) return;
    if (!currentFen) return;

    const fenParts = currentFen.split(" ");
    const sideToMove = fenParts[1]; // 'w' or 'b'

    if (
      (currentTurn === "white" && sideToMove !== "w") ||
      (currentTurn === "black" && sideToMove !== "b")
    ) {
      console.log("Not my turn, skipping analysis.");
      removeArrow();
      return;
    }

    analyzing = true;
    try {
      const { bestMove } = (await analyzePosition(currentFen)) || {};
      if (bestMove && bestMove !== "(none)") {
        const { from, to } = notationToCoords(bestMove);
        createMoveArrow(from, to);
      }
    } catch (e) {
      console.error("Analysis error:", e);
    }
    analyzing = false;
  }

  function removeArrow() {
    document.getElementById("best-move-arrow")?.remove();
  }

  document.addEventListener("keydown", (e) => {
    if (e.key == "x") {
      enabled = !enabled;
      if (!enabled) {
        document.getElementById("best-move-arrow")?.remove();
      } else {
        currentTurn = document.querySelector(
          "div.rclock-black[class*='running']",
        );
        currentTurn = currentTurn ? "black" : "white";
        analyzeCurrent();
      }
    }
  });

  async function fetchPageInitData() {
    try {
      const url = location.href; // current page URL
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/html",
        },
        credentials: "same-origin", // important for Lichess cookies/session
      });

      const text = await response.text();

      // Extract the page-init-data script content
      const match = text.match(
        /<script type="application\/json" id="page-init-data">([\s\S]*?)<\/script>/,
      );
      if (!match) {
        throw new Error("page-init-data not found in HTML");
      }

      const json = JSON.parse(match[1]);
      console.log("[Fetched Page-Init-Data]", json);
      return json;
    } catch (err) {
      console.error("Failed to fetch page-init-data:", err);
      return null;
    }
  }

  function getPuzzleIndex() {
    const selector =
      "#main-wrap > main > div > div.puz-side > div.puz-side__top.puz-side__solved > div";
    const element = document.querySelector(selector);
    const text = element?.textContent;
    return text ? text - 1 : null;
  }
})();

