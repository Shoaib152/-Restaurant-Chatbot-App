const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./restaurant.db', (err) => {
    if (err) console.error(err.message);
    else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Drop tables for MVP clean slate (optional, but good for schema change)
        db.run("DROP TABLE IF EXISTS menu");
        db.run("DROP TABLE IF EXISTS orders");

        // Create menu table with img
        db.run(`CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item TEXT NOT NULL,
            price REAL NOT NULL,
            category TEXT,
            details TEXT,
            img TEXT
        )`);

        // Create orders table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            orderid INTEGER PRIMARY KEY AUTOINCREMENT,
            itemid INTEGER,
            orderstatus TEXT,
            totalamount REAL,
            userdetail TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(itemid) REFERENCES menu(id)
        )`);

        // Seed rich data
        const items = [
            ['Margherita Pizza', 12.00, 'Pizza', 'Classic pizza with tomato sauce, mozzarella, and basil.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80'],
            ['Pepperoni Pizza', 14.50, 'Pizza', 'Spicy pepperonis with mozzarella cheese and tomato sauce.', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80'],
            ['BBQ Chicken Burger', 10.99, 'Burger', 'Grilled chicken patty with BBQ sauce and coleslaw.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'],
            ['Caesar Salad', 8.50, 'Salad', 'Romaine lettuce, croutons, parmesan cheese, and Caesar dressing.', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80'],
            ['Spaghetti Carbonara', 13.50, 'Pasta', 'Creamy pasta with pancetta, egg, and pecorino cheese.', 'https://images.unsplash.com/photo-1612874742237-fa523396c755?w=500&q=80'],
            ['Sushi Platter', 22.00, 'Asian', 'Assorted nigiri and maki rolls.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80'],
            ['Chocolate Lava Cake', 7.00, 'Dessert', 'Molten chocolate cake with vanilla ice cream.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=500&q=80'],
            ['Fresh Lemonade', 4.00, 'Drink', 'Freshly squeezed lemons with mint and ice.', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80']
        ];

        const stmt = db.prepare("INSERT INTO menu (item, price, category, details, img) VALUES (?, ?, ?, ?, ?)");
        items.forEach(item => stmt.run(item));
        stmt.finalize();
        console.log("Database seeded with reliable images.");
    });
}
module.exports = db;
