import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)
MODEL = "gemini-1.0-pro-latest"

def get_weather(city):
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    try:
        r = requests.get(url).json()
        if "main" not in r:
            return "City not found"
        return f"{city}: {r['main']['temp']}°C, {r['weather'][0]['description']}"
    except Exception as e:
        return f"Error fetching weather: {str(e)}"

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Simple tool detection (same logic as original script)
    if "weather" in user_message.lower():
        # strict extraction for simple logic: last word
        city = user_message.split()[-1] 
        # A bit more robust extraction for "weather in London" vs "London weather" could be good, 
        # but sticking to original logic for now unless it fails usually.
        # Let's try to be slightly smarter: if "in" is present, take next word.
        # But original was `city = q.split()[-1]`. Let's stick to simple but maybe slightly improved if obvious.
        # Actually user logic: `city = q.split()[-1]` is very brittle (e.g. "weather in london?").
        # I'll stick to the user's logic for fidelity but clean it a bit?
        # User said "make it frontend", implying porting functionality.
        # valid city mostly simple string.
        
        bot_response = get_weather(city)
    else:
        try:
            res = client.models.generate_content(
                model=MODEL,
                contents=user_message
            )
            bot_response = res.text
        except Exception as e:
            bot_response = f"I'm sorry, I encountered an error: {str(e)}"

    return jsonify({"response": bot_response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
