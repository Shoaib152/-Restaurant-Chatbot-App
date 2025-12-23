const db = require('./database');

// --- Paulo's Pizza Knowledge Base ---
const languages = {
    english: {
        keywords: ['hello', 'hi', 'pizza', 'menu', 'order', 'please', 'thanks', 'track', 'late', 'refund', 'wrong', 'cheese', 'pepperoni'],
        responses: {
            welcome: "Hi there! Welcome to Paulo’s Pizza! 🍕\nWhat can I get started for you today?",
            menu_intro: "Absolutely! Here are our delicious pizzas and more: 🍕🥗:",
            ask_order: "Great choice! Which one would you like to order?",
            order_confirm: (item, price) => `Sure thing! That's a ${item} for $${price}. Would you like to confirm this order? (yes/no)`,
            confirmed: (id) => `Perfect! Order #${id} is now being prepared by our chefs. 👨‍🍳🔥`,
            track: (status) => `Your order status is: **${status}** 🕒. It should be with you soon!`,
            complaint: "I am so sorry about that! 😢 Let me check that for you right away.",
            refund: "Absolutely, I've processed your refund request. So sorry for the trouble! 💔",
            late: "My apologies! We're working as fast as we can! 🏃💨",
            casual: "I wish I could share a slice with you! 🍕",
            fallback: "Try asking about our 'menu' or 'order' your favorite pizza!"
        }
    },
    urdu: {
        keywords: ['salam', 'kya', 'khana', 'menu', 'order', 'shukriya', 'masla', 'paise', 'wapis', 'pizza'],
        responses: {
            welcome: "Assalam-o-Alaikum! Paulo's Pizza mein khush amdeed! 🍕\nMain aap ki kya madad kar sakta hoon?",
            menu_intro: "Beshak! Ye raha hamara laziz menu:",
            ask_order: "Zabardast! Aap ko kya pasand hai?",
            order_confirm: (item, price) => `${item} ($${price}) behtareen intikhab hai. Order confirm karein? (haan/nahi)`,
            confirmed: (id) => `Shukriya! Order #${id} lag gaya hai. Bas thori dair mein tayyar! 🥘`,
            track: (status) => `Aap ka order: **${status}** hai.`,
            complaint: "Maazrat chahte hain 😔. Main abhi dekhta hoon.",
            refund: "Paise wapis karne ki request bhej di gayi hai. 🙏",
            late: "Kitchen mein rush hai, magar hum jaldi koshish kar rahe hain! ⏲️",
            casual: "Pizza ki khushboo hi kuch aur hai! 😉",
            fallback: "Samajh nahi aya. 'Menu' ya 'Order' bolain."
        }
    },
    hindi: {
        keywords: ['namaste', 'kya', 'khana', 'order', 'dhanyavad', 'menu', 'kitne', 'pizza'],
        responses: {
            welcome: "Namaste! Paulo's Pizza mein aapka swagat hai 🍕. Aaj kya mangwayenge?",
            menu_intro: "Zaroor! Ye raha hamara pizza menu:",
            ask_order: "Zaroor! Kaunsa pizza order karna chahenge?",
            order_confirm: (item, price) => `${item} ($${price}). Kya main order pakka karun? (haan/nahi)`,
            confirmed: (id) => `Mubarak ho! Order #${id} tayyar kiya ja raha hai. 🍛`,
            track: (status) => `Aapka order **${status}** hai.`,
            complaint: "Hamein khed hai 😞. Main abhi check karta hoon.",
            refund: "Refund process kar diya gaya hai. Kshama karein!",
            late: "Maafi chahte hain! Khana raste mein hai.",
            casual: "Kaash main bhi aapke saath pizza kha sakta! 😋",
            fallback: "Kripya 'Menu' ya 'Order' kahein."
        }
    },
    spanish: {
        keywords: ['hola', 'menu', 'orden', 'gracias', 'tarde', 'pizza'],
        responses: {
            welcome: "¡Hola! Bienvenido a Paulo's Pizza 🍕. ¿Qué te gustaría hoy?",
            menu_intro: "Aquí tienes nuestro delicioso menú:",
            ask_order: "¡Excelente! ¿Cuál quieres pedir?",
            order_confirm: (item, price) => `¿Confirmamos ${item} por $${price}? (si/no)`,
            confirmed: (id) => `¡Listo! El pedido #${id} está en el horno. 🎉`,
            track: (status) => `El estado es: **${status}**.`,
            complaint: "¡Lo siento mucho! 😢 Dejame revisar.",
            refund: "Reembolso procesado. ¡Disculpas!",
            late: "¡Perdón por la demora! Estamos en ello. 🏃",
            casual: "¡Sueño con una rebanada de pepperoni! 🍕",
            fallback: "Di 'menú' u 'orden'."
        }
    },
    french: {
        keywords: ['bonjour', 'salut', 'menu', 'commande', 'merci', 'retard', 'pizza'],
        responses: {
            welcome: "Bonjour! Bienvenue chez Paulo's Pizza 🍕.",
            menu_intro: "Voici notre menu :",
            ask_order: "Délicieux ! Que voulez-vous ?",
            order_confirm: (item, price) => `Commander ${item} ($${price}) ? (oui/non)`,
            confirmed: (id) => `C'est fait ! Commande #${id} en cours. 👨‍🍳`,
            track: (status) => `Votre commande est : **${status}**.`,
            complaint: "Je suis désolé 😔.",
            refund: "Remboursement effectué.",
            late: "Désolé pour le retard !",
            casual: "J'adore la pizza aussi ! 🥖",
            fallback: "Dites 'menu' ou 'commander'."
        }
    },
    german: {
        keywords: ['hallo', 'guten', 'menu', 'bestellen', 'danke', 'spat', 'pizza'],
        responses: {
            welcome: "Hallo! Willkommen bei Paulo's Pizza 🍕. Was darf's sein?",
            menu_intro: "Hier ist unsere Karte:",
            ask_order: "Gute Wahl! Was möchtest du bestellen?",
            order_confirm: (item, price) => `${item} ($${price}) bestellen? (ja/nein)`,
            confirmed: (id) => `Bestellung #${id} wird zubereitet! 🍺`,
            track: (status) => `Status: **${status}**.`,
            complaint: "Das tut mir leid 😔.",
            refund: "Rückerstattung verarbeitet.",
            late: "Entschuldigung für die Verspätung!",
            casual: "Ich liebe Pizza! 🌭",
            fallback: "Sagen Sie 'Karte' oder 'Bestellen'."
        }
    },
    russian: {
        keywords: ['privet', 'menu', 'zakaz', 'spasibo', 'gde', 'pizza'],
        responses: {
            welcome: "Привет! Добро пожаловать в Paulo's Pizza 🍕. Что хотите?",
            menu_intro: "Вот наше меню:",
            ask_order: "Отлично! Что закажете?",
            order_confirm: (item, price) => `Заказать ${item} ($${price})? (да/нет)`,
            confirmed: (id) => `Заказ #${id} оформлен и готовится! 🥣`,
            track: (status) => `Ваш заказ: **${status}**.`,
            complaint: "Мне очень жаль 😔.",
            refund: "Возврат оформлен. Извините!",
            late: "Извините за задержку!",
            casual: "Я тоже люблю пиццу! 🥞",
            fallback: "Скажите 'Меню' или 'Заказ'."
        }
    },
    japanese: {
        keywords: ['konnichiwa', 'menu', 'chumon', 'arigato', 'pizza'],
        responses: {
            welcome: "Konnichiwa! Paulo's Pizza e yokoso 🍕. Nani ni shimasu ka?",
            menu_intro: "Menyu desu:",
            ask_order: "Ii desu ne! Nani o chumon shimasu ka?",
            order_confirm: (item, price) => `${item} ($${price}) desu ka? (hai/iie)`,
            confirmed: (id) => `Chumon #${id} o tsukuri hajimete imasu! 🍱`,
            track: (status) => `Joutai: **${status}** desu.`,
            complaint: "Moushiwake arimasen 🙇.",
            refund: "Henkin shorishimashita.",
            late: "Osoku natte sumimasen!",
            casual: "Pizza ga daisuki desu! 🍕",
            fallback: "'Menu' toka 'Chumon' to itte kudasai."
        }
    },
    chinese: {
        keywords: ['ni', 'hao', 'caidan', 'dian', 'cai', 'pisa'],
        responses: {
            welcome: "Ni Hao! Huanying lai dao Paulo's Pizza 🍕.",
            menu_intro: "Caidan zai zhe:",
            ask_order: "Hao de! Xiang dian shenme?",
            order_confirm: (item, price) => `${item} ($${price})? (shi/bu)`,
            confirmed: (id) => `Dingdan #${id} yi zai zhunbei! 🥡`,
            track: (status) => `Zhuangtai: **${status}**.`,
            complaint: "Baoqian 😔.",
            refund: "Tuikuan yi chuli.",
            late: "Dui bu qi, hen man!",
            casual: "Wo ai pisa! 🍕",
            fallback: "Qing shuo 'Caidan'."
        }
    }
};

const defaultLang = languages.english;
const sessions = {};

function getSession(id) {
    if (!sessions[id]) sessions[id] = { step: 'idle', cart: [], language: 'english' };
    return sessions[id];
}

function detectLanguage(text) {
    const lower = text.toLowerCase();
    // Simple script detection
    if (/[\u0600-\u06FF]/.test(text)) return 'urdu';

    // Default to english for now or extend detection
    return 'english';
}

async function processMessage(sessionId, message) {
    const session = getSession(sessionId);
    const msg = message.toLowerCase();

    // Language Detection
    const detected = detectLanguage(message);
    session.language = detected;

    let t = languages[session.language] ? languages[session.language].responses : defaultLang.responses;
    if (!t) t = defaultLang.responses;

    // REFUND/COMPLAINT
    if (msg.includes('refund') || msg.includes('wapis') || msg.includes('return') || msg.includes('money')) {
        return { response: t.refund, language: session.language };
    }

    // MENU
    if (msg.includes('menu') || msg.includes('list') || msg.includes('pizza') || msg.includes('eat') || msg.includes('khana')) {
        return new Promise((resolve) => {
            db.all("SELECT * FROM menu", [], (err, rows) => {
                if (err) return resolve({ response: "I'm having trouble seeing the menu right now. 😔", language: session.language });
                let text = t.menu_intro + "\n";
                rows.forEach(r => text += `- ${r.item} ($${r.price})\n`);
                resolve({ response: text, language: session.language });
            });
        });
    }

    // TRACK & CANCEL
    if (msg.includes('track') || msg.includes('status') || msg.includes('where') || msg.includes('cancel') || msg.includes('khatam')) {
        const idMatch = msg.match(/\d+/);
        if (idMatch) {
            const orderId = idMatch[0];
            if (msg.includes('cancel') || msg.includes('khatam')) {
                return new Promise((resolve) => {
                    db.run("UPDATE orders SET orderstatus = 'Cancelled' WHERE orderid = ?", [orderId], function (err) {
                        if (this.changes === 0) resolve({ response: `I couldn't find an order with ID #${orderId} to cancel.`, language: session.language });
                        else resolve({ response: `Got it. I've cancelled order #${orderId} for you. ✋`, language: session.language });
                    });
                });
            }
            return new Promise((resolve) => {
                db.get("SELECT * FROM orders WHERE orderid = ?", [orderId], (err, row) => {
                    if (!row) resolve({ response: "Hmm, I couldn't find an order with that ID. Could you check it again?", language: session.language });
                    else resolve({ response: t.track(row.orderstatus), language: session.language });
                });
            });
        }
    }

    // ORDER LOGIC
    if (session.step === 'idle') {
        return new Promise((resolve) => {
            db.all("SELECT * FROM menu", [], (err, rows) => {
                const item = rows.find(r => msg.includes(r.item.toLowerCase()));
                if (item) {
                    session.cart = [item];
                    session.step = 'confirm';
                    resolve({ response: t.order_confirm(item.item, item.price), language: session.language });
                } else {
                    if (msg.length < 3) resolve({ response: t.fallback, language: session.language });
                    else resolve({ response: t.welcome, language: session.language });
                }
            });
        });
    }

    if (session.step === 'confirm') {
        if (msg.includes('yes') || msg.includes('ha') || msg.includes('confirm') || msg.includes('sure') || msg.includes('ok')) {
            const item = session.cart[0];
            return new Promise((resolve) => {
                db.run("INSERT INTO orders (itemid, orderstatus, totalamount, userdetail) VALUES (?, ?, ?, ?)",
                    [item.id, 'Pending', item.price, JSON.stringify({ lang: session.language, msg: message, source: 'chat' })],
                    function (err) {
                        session.step = 'idle';
                        session.cart = [];
                        resolve({ response: t.confirmed(this.lastID), language: session.language });
                    });
            });
        } else if (msg.includes('no') || msg.includes('nahi') || msg.includes('cancel')) {
            session.step = 'idle';
            session.cart = [];
            return { response: "No problem! What else can I do for you?", language: session.language };
        }
    }

    return { response: t.fallback, language: session.language };
}

module.exports = { processMessage };
