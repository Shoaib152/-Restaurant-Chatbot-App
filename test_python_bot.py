import os
import requests
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')

genai.configure(api_key=GEMINI_API_KEY)

def get_weather(city: str):
    print(f"[Tool] Fetching weather for {city}...")
    api_key = WEATHER_API_KEY
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return {
                "temperature": f"{data['main']['temp']}°C",
                "condition": data['weather'][0]['description']
            }
        else:
            return {"error": f"Weather API Error: {response.text}"}
    except Exception as e:
        return {"error": str(e)}

tools_list = [get_weather]
model = genai.GenerativeModel(
    model_name='gemini-2.0-flash',
    tools=tools_list
)
chat = model.start_chat(enable_automatic_function_calling=True)

print("Sending message...")
response = chat.send_message("What is the weather in London?")
print(f"Response: {response.text}")
