const socket = io();
let userName = '';
let userColor = '';
const userColors = {};

function generateColor(name) {
    if (userColors[name]) return userColors[name];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color = `hsl(${hash % 360}, 60%, 70%)`;
    userColors[name] = color;
    return color;
}

function enterChat() {
    const nameInput = document.getElementById('username');
    const name = nameInput.value.trim();

    if (name) {
        userName = name;
        userColor = generateColor(userName);
        socket.emit('set username', userName);
        document.getElementById('login').style.display = 'none';
        document.getElementById('chat').style.display = 'flex';
    }
}

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', ({ name, message }) => {
    const item = document.createElement('li');

    const nameTag = document.createElement('span');
    nameTag.textContent = name;
    nameTag.className = 'message-name';
    nameTag.style.backgroundColor = generateColor(name);

    item.appendChild(nameTag);
    item.append(message);
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});
