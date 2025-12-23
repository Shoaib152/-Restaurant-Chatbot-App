// State
let currentItem = null;

// Load Menu
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        const items = await response.json();

        const grid = document.getElementById('menu-grid');
        grid.innerHTML = '';

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'menu-item';
            el.innerHTML = `
                <img src="${item.img || 'https://via.placeholder.com/300'}" alt="${item.item}">
                <div class="menu-details">
                    <div class="menu-title">${item.item}</div>
                    <div class="menu-price">$${item.price.toFixed(2)}</div>
                    <button class="btn" onclick='openOrderModal(${JSON.stringify(item)})'>Order Now</button>
                </div>
            `;
            grid.appendChild(el);
        });
    } catch (e) {
        console.error(e);
    }
}

// Modal Functions
function openOrderModal(item) {
    currentItem = item;
    document.getElementById('modal-item-name').innerText = item.item;
    document.getElementById('modal-item-price').innerText = '$' + item.price.toFixed(2);
    document.getElementById('modal-item-img').src = item.img;
    document.getElementById('order-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('order-modal').classList.add('hidden');
    currentItem = null;
}

async function confirmOrder() {
    if (!currentItem) return;

    try {
        const res = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                itemId: currentItem.id,
                price: currentItem.price,
                itemName: currentItem.item,
                userDetails: { lang: 'en', source: 'dashboard_direct' }
            })
        });
        const data = await res.json();

        // Success!
        closeModal();
        showSuccess(data.orderId);
    } catch (e) {
        alert("Order failed. Please complain to the chatbot.");
    }
}

function showSuccess(orderId) {
    document.getElementById('success-order-id').innerText = '#' + orderId;
    document.getElementById('success-popup').classList.remove('hidden');

    // Confetti Animation
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#ff0000'] // Gold, White, Red
    });
}

function closeSuccess() {
    document.getElementById('success-popup').classList.add('hidden');
}

// Chat Functions
const chatInterface = document.getElementById('chat-interface');
const msgs = document.getElementById('chat-messages');
const mySessionId = 'cust-' + Date.now();

function toggleChat() {
    chatInterface.classList.toggle('hidden');
}

function appendMsg(text, type) {
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.innerText = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const txt = input.value.trim();
    if (!txt) return;

    appendMsg(txt, 'user');
    input.value = '';

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: txt, sessionId: mySessionId })
        });
        const data = await res.json();
        appendMsg(data.response, 'bot');
    } catch (e) {
        appendMsg("Connection error.", 'bot');
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    loadMenu();
});
