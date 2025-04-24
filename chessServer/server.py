from flask import Flask, request, jsonify, make_response
import chess, json
import chess.engine
import sys

app = Flask(__name__)
engine = chess.engine.SimpleEngine.popen_uci("stockfish")
SEARCH_DEPTH = 3

@app.before_request
def log_request():
    print(f"[{request.method}] {request.path}")

@app.route("/health", methods=["GET"])
def health():
    return "OK", 200

@app.route("/analyze", methods=["POST", "OPTIONS"])
def analyze():
    # Preflight
    if request.method == "OPTIONS":
        response = make_response("", 200)
        response.headers["Access-Control-Allow-Origin"] = "https://lichess.org"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        return response

    # POST
    data = request.get_json() or {}
    fen = data.get("fen")
    print("Analyzing FEN", fen)
    if not fen:
        return jsonify({"error": "Missing FEN"}), 400

    try:
        board = chess.Board(fen)
    except ValueError:
        return jsonify({"error": "Invalid FEN"}), 400

    info = engine.analyse(board, chess.engine.Limit(depth=SEARCH_DEPTH))
    pv = info.get("pv", [])
    best_move = pv[0].uci() if pv else None

    
    score = info.get("score")
    if score.is_mate():
        evaluation = f"M{score.mate()}"
    else:
        evaluation = f"{score.relative.score() / 100:.2f}"


    pv_moves = " ".join(m.uci() for m in pv)
    response = jsonify({
        "bestMove": best_move,
        "evaluation": evaluation,
        "pv": pv_moves,
        "depth": SEARCH_DEPTH
    })
    print(json.dumps(response.json, indent=2))
    response.headers["Access-Control-Allow-Origin"] = "https://lichess.org"
    return response

if __name__ == "__main__":
    ssl = "--ssl" in sys.argv
    if ssl:
        app.run(host="0.0.0.0", port=5000, ssl_context=("cert.pem", "key.pem"))
    else:
        app.run(host="0.0.0.0", port=5000)


