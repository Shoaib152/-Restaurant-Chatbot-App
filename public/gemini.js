const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
let sessionId = 'session-' + Date.now();

function addMessage(text, isUser) {
    const div = document.createElement('div');
    div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    if (isUser) {
        div.textContent = text;
    } else {
        // Use marked to parse markdown for bot responses
        div.innerHTML = marked.parse(text);
    }

    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = '';
    userInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.innerHTML = 'Sending...';

    // Loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message';
    loadingDiv.innerHTML = '<div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
    messagesDiv.appendChild(loadingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        const response = await fetch('/api/gemini-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, sessionId })
        });

        const data = await response.json();

        messagesDiv.removeChild(loadingDiv);
        addMessage(data.response, false);

    } catch (error) {
        messagesDiv.removeChild(loadingDiv);
        addMessage("**Error**: Could not connect to server.", false);
        console.error(error);
    } finally {
        userInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.innerHTML = 'Send';
        userInput.focus();
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
