from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__, static_url_path='/transproxy')
CORS(app)  # 启用CORS

# 全局变量存储允许的key
allowed_keys = set()

# 在应用启动时读取key文件
def load_allowed_keys(filepath):
    global allowed_keys
    with open(filepath, 'r') as file:
        allowed_keys = set(line.strip() for line in file)

# 路由处理翻译请求
@app.route('/', methods=['GET'])
def translate():
    key = request.args.get('key')
    text = request.args.get('text')
    target_language = request.args.get('target', 'zh-CN')

    # 验证key
    if key not in allowed_keys:
        return jsonify({'error': 'Unauthorized access, invalid key'}), 403

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    google_translate_url = 'https://translate.googleapis.com/translate_a/single'
    params = {
        'client': 'gtx',
        'sl': 'auto',
        'tl': target_language,
        'dt': 't',
        'q': text
    }
    response = requests.get(google_translate_url, params=params)
    
    if response.status_code == 200:
        translated_text = response.json()[0][0][0]
        return jsonify({'translated_text': translated_text}), 200
    else:
        return jsonify({'error': 'Translation failed'}), 500

# 读取允许的key文件
load_allowed_keys('keys.txt')

if __name__ == '__main__':
    # 直接运行应用（开发环境）
    app.run(host='127.0.0.1', port=5000)

