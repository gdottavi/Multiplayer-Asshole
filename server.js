"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const server = (0, express_1.default)();
const http = (0, http_1.createServer)(server);
const PORT = process.env.PORT || 3000;
let gameState = "Initializing";
let players = [];
const io = new socket_io_1.Server(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
io.on('connection', function (socket) {
    console.log('An idiot connected: ' + socket.id);
    players.push(socket.id);
    //ready to play
    socket.on('ready', () => {
        io.emit('ready', players);
    });
    //cards dealt
    socket.on('dealCards', (currentPlayers) => {
        io.emit('dealCards', currentPlayers);
        gameState = "Ready";
        io.emit('changeGameState', "Ready");
    });
    //card played
    socket.on('cardPlayed', (cardPlayed, socketId) => {
        io.emit('cardPlayed', cardPlayed, socketId);
        io.emit('changeTurn', cardPlayed);
    });
    //pass turn
    socket.on('passTurn', () => {
        io.emit('passTurn');
    });
    //remove players as they disconnect
    socket.on('disconnect', function () {
        console.log('An idiot disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
        //TODO - remove player from other clients
    });
});
http.listen(PORT, () => {
    console.log(`Asshole server started on port ${PORT}`);
});
//# sourceMappingURL=server.js.map