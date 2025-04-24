# server.py

from flask import Flask, request, jsonify
import sys
from flask_cors import CORS
import chess
import chess.engine

app = Flask(__name__)
CORS(app)  # allow your extension to fetch

# Make sure you have the `stockfish` binary on your PATH,
# or replace "stockfish" below with its full path.
engine = chess.engine.SimpleEngine.popen_uci("stockfish")

# 6 plies ≈ 3 full moves
SEARCH_DEPTH = 6

@app.route("/analyze", methods=["POST"])
def analyze():
    print(request.json)
    data = request.get_json() or {}
    fen = data.get("fen")
    if not fen:
        return jsonify({"error": "Missing FEN"}), 400

    # Validate FEN
    try:
        board = chess.Board(fen)
    except ValueError:
        return jsonify({"error": "Invalid FEN"}), 400

    # Run Stockfish
    info = engine.analyse(
        board,
        chess.engine.Limit(depth=SEARCH_DEPTH)
    )

    # Extract best move
    pv = info.get("pv", [])
    best_move = pv[0].uci() if pv else None

    # Extract evaluation
    score = info.get("score")
    if score.is_mate():
        evaluation = f"M{score.mate()}"
    else:
        cp = score.score()
        evaluation = f"{cp/100:.2f}"

    # Turn PV into a space-separated UCI string
    pv_moves = " ".join(m.uci() for m in pv)

    return jsonify({
        "bestMove": best_move,
        "evaluation": evaluation,
        "pv": pv_moves,
        "depth": SEARCH_DEPTH
    })

@app.route("/health", methods=["GET"])
def health():
    return "OK", 200

if __name__ == "__main__":
    ssl = "--ssl" in sys.argv
    if ssl:
        app.run(host="0.0.0.0", port=5000, ssl_context=("cert.pem", "key.pem"))
    else:
        app.run(host="0.0.0.0", port=5000)

