# ✨ Gemini Weather Chatbot

A full-stack web application that combines the power of **Google Gemini AI** and **OpenWeatherMap** to provide real-time weather information and intelligent chat responses.

## 🚀 Features
- 🌤️ **Real-time Weather**: Get current weather conditions for any city.
- 🤖 **AI Powered**: Integrated with Google Gemini for natural conversations.
- 🎨 **Modern UI**: Sleek, responsive dark-mode chat interface built with React.
- ⚡ **Fast Backend**: Python Flask API for efficient request handling.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Vanilla CSS
- **Backend**: Python, Flask, Flask-CORS
- **APIs**: Google GenAI, OpenWeatherMap

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js & npm
- Python 3.8+

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend` directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_key
   WEATHER_API_KEY=your_openweather_key
   ```
4. Start the server:
   ```bash
   python app.py
   ```

### 3. Frontend Setup
1. Navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📸 Screenshots
*(Add your screenshots here after uploading!)*

## 📄 License
MIT
