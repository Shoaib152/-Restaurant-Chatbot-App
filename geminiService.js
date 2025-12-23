const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Mock Tools
const tools = {
    getWeather: {
        functionDeclarations: [{
            name: "getWeather",
            description: "Get the weather for a given location",
            parameters: {
                type: "OBJECT",
                properties: {
                    city: { type: "STRING", description: "The city to get weather for" }
                },
                required: ["city"]
            }
        }],
        implementation: async ({ city }) => {
            console.log(`[Tool] Fetching real weather for ${city}`);
            const apiKey = process.env.WEATHER_API_KEY;
            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Weather API Error: ${response.statusText}`);
                }
                const data = await response.json();
                return {
                    temp: `${data.main.temp}°C`,
                    condition: data.weather[0].description,
                    humidity: `${data.main.humidity}%`,
                    wind: `${data.wind.speed} m/s`
                };
            } catch (error) {
                console.error("Weather tool error:", error);
                return { error: "Failed to fetch weather data. Please check the city name." };
            }
        }
    },
    getStockPrice: {
        functionDeclarations: [{
            name: "getStockPrice",
            description: "Get the current stock price for a given symbol",
            parameters: {
                type: "OBJECT",
                properties: {
                    symbol: { type: "STRING", description: "The stock symbol (e.g., GOOG, AAPL)" }
                },
                required: ["symbol"]
            }
        }],
        implementation: async ({ symbol }) => {
            console.log(`[Tool] Fetching stock for ${symbol}`);
            // Mock data
            const prices = {
                'GOOG': 150.25,
                'AAPL': 180.50,
                'MSFT': 400.00
            };
            return { price: prices[symbol.toUpperCase()] || 100.00, currency: "USD" };
        }
    }
};

// Map tool names to functions
const toolFunctions = {
    getWeather: tools.getWeather.implementation,
    getStockPrice: tools.getStockPrice.implementation
};

// Combine declarations for the model
const allTools = [
    tools.getWeather.functionDeclarations[0],
    tools.getStockPrice.functionDeclarations[0]
];

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: [{ functionDeclarations: allTools }]
});

const chats = {}; // Simple in-memory session store

async function runChat(sessionId, userMessage) {
    if (!chats[sessionId]) {
        chats[sessionId] = model.startChat();
    }
    const chat = chats[sessionId];
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            console.log(`[Gemini] User: ${userMessage} (Attempt ${retryCount + 1})`);
            // Send message
            let result = await chat.sendMessage(userMessage);
            let response = await result.response;
            let functionCalls = response.functionCalls();

            // Handle function calls loop
            while (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0]; // Gemini Pro typically does one at a time currently
                const { name, args } = call;

                if (toolFunctions[name]) {
                    const toolResult = await toolFunctions[name](args);
                    console.log(`[Gemini] Tool Result:`, toolResult);

                    // Send result back to model
                    result = await chat.sendMessage([{
                        functionResponse: {
                            functionResponse: {
                                name: name,
                                response: toolResult
                            }
                        }
                    }]);
                    response = await result.response;
                    functionCalls = response.functionCalls();
                } else {
                    break;
                }
            }

            const text = response.text();
            console.log(`[Gemini] Response: ${text}`);
            return { response: text };

        } catch (error) {
            console.error(`Gemini Error (Attempt ${retryCount + 1}):`, error.message);
            if (error.status === 429) {
                retryCount++;
                if (retryCount < maxRetries) {
                    const waitTime = 2000 * Math.pow(2, retryCount); // 4s, 8s, 16s...
                    console.log(`Rate limit hit. Retrying in ${waitTime / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                return { response: "I'm still receiving too many requests. Please wait a minute and try again." };
            }
            if (error.status === 503) {
                return { response: "The Gemini service is currently overloaded. Please try again later." };
            }
            return { response: "Sorry, I encountered an error. Please check the server logs." };
        }
    }
}

module.exports = { runChat };
