from flask import Flask, jsonify, request
from flask_cors import CORS

DATA_FROM_ESP = None

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def test_flask_server():
    
    return jsonify({"status": DATA_FROM_ESP})

@app.route('/esp/', methods=['POST'])
def test_send_data_on_esp():
    global DATA_FROM_ESP
    try:
        DATA_FROM_ESP = request.get_json()

        return jsonify({"status": "ok "})

    except Exception as e:
        print(f'SEND ERROR: {e}')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)