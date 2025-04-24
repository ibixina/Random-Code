// chessEngine.js

(function () {
  const pst = {
    p: [
      0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 2, 3, 3, 2, 1, 1,
      0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5, 0, 0, 0, 2, 2, 0, 0, 0, 0.5, -0.5, -1,
      0, 0, -1, -0.5, 0.5, 0.5, 1, 1, -2, -2, 1, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    n: [
      -5, -4, -3, -3, -3, -3, -4, -5, -4, -2, 0, 0, 0, 0, -2, -4, -3, 0, 1, 1.5,
      1.5, 1, 0, -3, -3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3, -3, 0, 1.5, 2, 2, 1.5, 0,
      -3, -3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3, -4, -2, 0, 0.5, 0.5, 0, -2, -4, -5,
      -4, -3, -3, -3, -3, -4, -5,
    ],
  };

  const pieceValue = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000,
  };

  function evaluatePosition(game) {
    const board = game.board();
    let evalScore = 0;
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const piece = board[r][f];
        if (!piece) continue;
        const val = pieceValue[piece.type] || 0;
        let score = val;
        if (pst[piece.type]) {
          const idx = piece.color === "w" ? (7 - r) * 8 + f : r * 8 + f;
          score += pst[piece.type][idx];
        }
        evalScore += piece.color === "w" ? score : -score;
      }
    }
    return evalScore;
  }

  function minimax(game, depth, alpha, beta, isMaximizingPlayer) {
    if (depth === 0 || game.game_over()) {
      return evaluatePosition(game);
    }

    const moves = game.moves();

    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of moves) {
        game.move(move);
        const eval = minimax(game, depth - 1, alpha, beta, false);
        game.undo();
        maxEval = Math.max(maxEval, eval);
        alpha = Math.max(alpha, eval);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        game.move(move);
        const eval = minimax(game, depth - 1, alpha, beta, true);
        game.undo();
        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  window.getBestMove = function (fen, depth = 3) {
    const game = new Chess(fen);
    let bestMove = null;
    let bestEval = -Infinity;

    const moves = game.moves();
    for (const move of moves) {
      game.move(move);
      const eval = minimax(game, depth - 1, -Infinity, Infinity, false);
      game.undo();
      if (eval > bestEval) {
        bestEval = eval;
        bestMove = move;
      }
    }

    const moveObj = game.move(bestMove);
    const from = moveObj.from;
    const to = moveObj.to;
    return from + to;
  };
})();
