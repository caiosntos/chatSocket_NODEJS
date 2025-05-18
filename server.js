const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = {};

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) =>{
    console.log('🟢 Novo usuário conectado');

    socket.on('set username', (name) =>{
        users[socket.id] = name;
    });

    socket.on('chat message', (msg) =>{
        const name = users[socket.id] || 'Anônimo';
        io.emit('chat message', { name, message:msg});
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        console.log('🔴 Usuário desconectado');
    });
})

const PORT = 3000;
server.listen(PORT, () =>{
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
})