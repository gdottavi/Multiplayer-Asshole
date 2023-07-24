"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const player_1 = require("./client/src/model/player");
const players_1 = require("./client/src/model/players");
const server = (0, express_1.default)();
const http = (0, http_1.createServer)(server);
const PORT = process.env.PORT || 3000;
let gameState = "Initializing" /* gameStateEnum.Initializing */;
let players = new players_1.Players();
const io = new socket_io_1.Server(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});
io.on('connection', function (socket) {
    socket.on('getPlayerList', () => {
        io.to(socket.id).emit('playerList', players);
    });
    /**
     * Start Game --> Advances from Lobby Scene to Game Scene.  Sends players and socket to game for intialization.
     */
    socket.on("startGame", (currentPlayers) => {
        io.emit("startGame", currentPlayers);
    });
    // Handle "joinGame" event
    socket.on("joinGame", (newPlayer) => {
        // Keep track of players joined on the server for any new players that join
        players.addPlayer(newPlayer);
        // Broadcast the player's name and associated socketID to all connected clients
        io.emit("playerJoined", newPlayer);
    });
    //ready to play the game
    socket.on('ready', () => {
        io.emit('ready', players);
        gameState = "Ready" /* gameStateEnum.Ready */;
    });
    //update player rank
    socket.on('updateRank', (player, rank) => {
        if (rank === null || player === null)
            return;
        let currentPlayer = players.getPlayerById(player.socketId);
        //if(currentPlayer.rank === rank) return;
        currentPlayer.rank = rank;
        io.emit('updateRank', player, rank);
    });
    // cards dealt
    socket.on('dealCards', (currentPlayersData) => {
        const currentPlayers = currentPlayersData.map(playerData => player_1.Player.serialize(playerData));
        io.emit('dealCards', currentPlayers);
    });
    //card played
    socket.on('playCards', (cardsPlayed, socketId, shouldClear, currentPlayer, nextPlayer) => {
        io.emit('playCards', cardsPlayed, socketId, shouldClear, currentPlayer, nextPlayer);
    });
    //Between card played and advancing turn check if player is out and if game is over
    socket.on('handlePlayerOut', () => {
        io.emit('handlePlayerOut');
    });
    //turn finished - advance to next player
    socket.on('changeTurn', (nextPlayer, shouldClear) => {
        io.emit('changeTurn', nextPlayer, shouldClear);
    });
    //pass turn
    socket.on('passTurn', (currentPlayer, nextPlayer) => {
        io.emit('passTurn', currentPlayer, nextPlayer);
    });
    //Send back to lobby with current players
    socket.on('reset', (currentPlayers) => {
        io.emit('reset', currentPlayers);
    });
    //remove players as they disconnect
    socket.on('disconnect', function () {
        console.log('An idiot disconnected: ' + socket.id);
        players.removePlayer(socket.id);
        io.emit('playerExited', socket.id);
    });
});
http.listen(PORT, () => {
    console.log(`Asshole server started on port ${PORT}`);
});
//# sourceMappingURL=server.js.map