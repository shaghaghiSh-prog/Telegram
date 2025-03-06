// Sample chat data
const chats = [
    { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1", lastMessage: "Hey, how are you?", online: true },
    { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=5", lastMessage: "See you tomorrow!", online: false },
    { id: 3, name: "Bob Johnson", avatar: "https://i.pravatar.cc/150?img=8", lastMessage: "Thanks for your help!", online: true },
    { id: 4, name: "Alice Brown", avatar: "https://i.pravatar.cc/150?img=10", lastMessage: "Can we meet today?", online: false },
    { id: 5, name: "Charlie Wilson", avatar: "https://i.pravatar.cc/150?img=15", lastMessage: "Great idea!", online: true }
];

let currentChat = null;

// DOM elements
const chatList = document.getElementById('chatList');
const messageArea = document.getElementById('messageArea');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const currentChatName = document.getElementById('currentChatName');
const currentChatAvatar = document.getElementById('currentChatAvatar');
const searchInput = document.getElementById('searchInput');
const onlineStatus = document.getElementById('onlineStatus');

// Populate chat list
function populateChatList(filter = '') {
    chatList.innerHTML = '';
    chats.forEach(chat => {
        if (chat.name.toLowerCase().includes(filter.toLowerCase())) {
            const li = document.createElement('li');
            li.className = 'chat-item';
            li.innerHTML = `
                <img src="${chat.avatar}" alt="${chat.name}">
                <div class="chat-info">
                    <h3>${chat.name}</h3>
                    <p>${chat.lastMessage}</p>
                </div>
            `;
            li.addEventListener('click', () => selectChat(chat));
            chatList.appendChild(li);
        }
    });
}

// Select a chat
function selectChat(chat) {
    currentChat = chat;
    currentChatName.textContent = chat.name;
    currentChatAvatar.src = chat.avatar;
    currentChatAvatar.alt = chat.name;
    onlineStatus.textContent = chat.online ? 'online' : 'offline';
    onlineStatus.className = `online-status ${chat.online ? 'online' : ''}`;
    document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    loadMessages();
}

// Load messages from local storage
function loadMessages() {
    messageArea.innerHTML = '';
    const messages = JSON.parse(localStorage.getItem(`chat_${currentChat.id}`)) || [];
    messages.forEach(message => displayMessage(message));
}

// Display a message
function displayMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `message-container ${message.sent ? 'sent' : 'received'}`;
    
    const avatarSrc = message.sent ? 'https://i.pravatar.cc/150?img=20' : currentChat.avatar;
    const avatarAlt = message.sent ? 'You' : currentChat.name;
    
    messageContainer.innerHTML = `
        ${message.sent ? '' : `<img src="${avatarSrc}" alt="${avatarAlt}" class="message-avatar">`}
        <div class="message-content">
            <div class="message ${message.sent ? 'sent' : 'received'}">
                ${message.text}
            </div>
            <div class="message-time">${formatTime(message.timestamp)}</div>
        </div>
        ${message.sent ? `<img src="${avatarSrc}" alt="${avatarAlt}" class="message-avatar">` : ''}
    `;
    
    messageArea.appendChild(messageContainer);
    messageArea.scrollTop = messageArea.scrollHeight;

    // Add animation class
    setTimeout(() => messageContainer.classList.add('appear'), 10);
}

// Format timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Send a message
function sendMessage() {
    const text = messageInput.value.trim();
    if (text && currentChat) {
        const message = { text, sent: true, timestamp: new Date().getTime() };
        displayMessage(message);
        saveMessage(message);
        messageInput.value = '';

        // Simulate received message
        setTimeout(() => {
            const receivedMessage = { text: "Thanks for your message!", sent: false, timestamp: new Date().getTime() };
            displayMessage(receivedMessage);
            saveMessage(receivedMessage);
        }, 1000);
    }
}

// Save message to local storage
function saveMessage(message) {
    const messages = JSON.parse(localStorage.getItem(`chat_${currentChat.id}`)) || [];
    messages.push(message);
    localStorage.setItem(`chat_${currentChat.id}`, JSON.stringify(messages));
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

searchInput.addEventListener('input', (e) => {
    populateChatList(e.target.value);
});

// Initialize the app
populateChatList();

// Add some interactivity
document.querySelectorAll('.action-button, .attachment-button, .emoji-button').forEach(button => {
    button.addEventListener('click', () => {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => button.style.transform = 'scale(1)', 100);
    });
});

// Simulate new message
setInterval(() => {
    const randomChatIndex = Math.floor(Math.random() * chats.length);
    const chatItem = document.querySelectorAll('.chat-item')[randomChatIndex];
    chatItem.classList.add('new-message');
    setTimeout(() => chatItem.classList.remove('new-message'), 3000);
}, 10000);

