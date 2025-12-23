# Paulo's Pizza - Restaurant Chatbot App

A modern restaurant application featuring an AI Waiter powered by Google Gemini, a visually rich menu, and an admin dashboard for order tracking.

## 🚀 Features

- **AI Waiter (Paulo)**: Interactive chatbot that assists customers with menu inquiries and orders.
- **Dynamic Menu**: Visually appealing dashboard showing Paulo's Pizza gourmet selection.
- **Admin Dashboard**: Real-time order tracking and revenue analytics.
- **Full Stack Solution**: Integrated with SQLite for persistent data storage.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Glassmorphism), Vanilla JavaScript.
- **Backend**: Node.js, Express.
- **AI**: Google Generative AI (Gemini Pro).
- **Database**: SQLite3.

## 📋 Prerequisites

- Node.js installed on your system.
- A Google Gemini API Key.

## ⚙️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shoaib152/-Restaurant-Chatbot-App.git
   cd -Restaurant-Chatbot-App
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Initialize Database**:
   The `restaurant.db` will be automatically populated with the menu items on the first run.

## 🏃 Running the App

Start the server:
```bash
npm start
```
The application will be available at `http://localhost:3000`.

## 📂 Project Structure

- `server.js`: Express server and API endpoints.
- `public/`: Frontend assets (HTML, CSS, JS).
- `public/index.html`: Main customer dashboard.
- `public/admin.html`: Admin dashboard.
- `chatService.js` / `geminiService.js`: Chatbot logic and AI integration.
- `database.js`: SQLite connection and initialization.

## 🛡️ License

This project is licensed under the ISC License.
