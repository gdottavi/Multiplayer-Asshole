"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server = require('express')();
const http = require('http').createServer(server);
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
let players = [];
io.on('connection', function (socket) {
    console.log('An idiot connected: ' + socket.id);
    //add players as they connect
    players.push(socket.id);
    if (players.length === 1) {
        io.emit('isPlayerA');
    }
    //cards dealt
    socket.on('dealCards', function () {
        io.emit('dealCards');
    });
    //card played
    socket.on('cardPlayed', (cardKey, isPlayerA) => {
        io.emit('cardPlayed', cardKey, isPlayerA);
    });
    //remove players as they disconnect
    socket.on('disconnect', function () {
        console.log('An idiot disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});
http.listen(PORT, function () {
    console.log(`Asshole server started on port ${PORT}`);
});
//# sourceMappingURL=server.js.map