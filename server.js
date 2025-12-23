const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const chatService = require('./chatService');
const geminiService = require('./geminiService');
require('dotenv').config();

const app = express();
const PORT = 3000;

if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.startsWith('AIza')) {
    // Note: The key in .env seems invalid based on tests.
    console.warn("WARNING: GEMINI_API_KEY is missing or might be invalid. Gemini features may not work.");
}

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Chat API
app.post('/api/chat', async (req, res) => {
    const { message, sessionId } = req.body;
    try {
        const result = await chatService.processMessage(sessionId || 'default', message);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Internal Server Error" });
    }
});


// Gemini Chat API
app.post('/api/gemini-chat', async (req, res) => {
    const { message, sessionId } = req.body;
    try {
        const result = await geminiService.runChat(sessionId || 'default', message);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "Internal Server Error" });
    }
});

// Direct Order API
app.post('/api/order', (req, res) => {
    const { itemId, price, item, userDetails } = req.body;
    const details = JSON.stringify(userDetails || { lang: 'en', source: 'dashboard' });

    db.run("INSERT INTO orders (itemid, orderstatus, totalamount, userdetail) VALUES (?, ?, ?, ?)",
        [itemId, 'Pending', price, details],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ orderId: this.lastID, status: 'confirmed' });
        }
    );
});

// Menu API (New)
app.get('/api/menu', (req, res) => {
    db.all("SELECT * FROM menu", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Dashboard APIs
app.get('/api/orders', (req, res) => {
    db.all("SELECT orders.*, menu.item, menu.img, menu.category FROM orders LEFT JOIN menu ON orders.itemid = menu.id ORDER BY timestamp DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/revenue', (req, res) => {
    db.get("SELECT SUM(totalamount) as total FROM orders", [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ total: row.total || 0 });
    });
});

app.get('/api/pending', (req, res) => {
    db.get("SELECT count(*) as count FROM orders WHERE orderstatus = 'Pending'", [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ count: row.count || 0 });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
