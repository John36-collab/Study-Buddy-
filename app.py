# Add this import at the top
from config import Config

# Update the HF_HEADERS line
HF_HEADERS = {"Authorization": f"Bearer {Config.HF_API_TOKEN}"}from flask import Flask, request, render_template, jsonify
import pymysql
import requests

app = Flask(__name__)

# Hugging Face API
HF_AP}

# Connect to pymysql
db = pymysql.connect(
    host="localhost",
    user="Ebuka",
    passwd=
    db="studybuddy"
)
cursor = db.cursor()

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/generate', methods=['POST'])
def generate():
    notes = request.form['notes']
    payload = {
        "inputs": f"Generate 5 quiz questions based on the following:\n{notes}"
    }
    
    res = requests.post(HF_API_URL, headers=HF_HEADERS, json=payload)
    try:
        result = res.json()[0]['generated_text']
    except:
        return jsonify({'error': 'API Error or wrong response'})

    flashcards = []
    for line in result.split('\n'):
        if "?" in line:
            q = line.strip()
            a = "AI generated answer"
            flashcards.append({'question': q, 'answer': a})
            cursor.execute("INSERT INTO flashcards (question, answer) VALUES (%s, %s)", (q, a))

    db.commit()
    return jsonify(flashcards)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
