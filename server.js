const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const PeerServer = ExpressPeerServer(server, {
    debug: true
});
const { v4: uuidv4 } = require('uuid');
app.use(express.static('public'));

app.use('/peerjs', PeerServer);

app.set('view engine', 'ejs');

app.get("/", (req, res) => {

    res.redirect(`/${uuidv4()}`);
})

app.get("/:room", (req, res) => {

    res.render('room', { roomId: req.params.room });
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    })
})

server.listen(5000);