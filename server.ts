import { Server } from "socket.io";
import { createServer } from 'http';
import express from 'express'
import { Player } from "./client/src/model/player";
import { Card } from "./client/src/model/card";
import { gameStateEnum } from "./client/src/game_helpers/gameRuleHandler";



const server = express();
const http = createServer(server);
const PORT = process.env.PORT || 3000;
let gameState = gameStateEnum.Initializing;
let players = [];

const io = new Server(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

io.on('connection', function (socket) {

    //only allow connections before game state is ready
    if (gameState !== gameStateEnum.Ready) {
        console.log('A idiot connected: ' + socket.id);
        players.push(socket.id);
    }
    else {
        console.log("New connection blocked");
        socket.disconnect(true);
    }

    /**
     * Start Game --> Advances from Lobby Scene to Game Scene.  Sends players and socket to game for intialization. 
     */
    socket.on("startGame", (currentPlayers) => {
        io.emit("startGame", currentPlayers)
    });

    // Handle "joinGame" event
    socket.on("joinGame", (newPlayer) => {
        // Broadcast the player's name and associated socketID to all connected clients
        io.emit("playerJoined", newPlayer);
    });

    //ready to play the game
    socket.on('ready', () => {
        io.emit('ready', players);
        gameState = gameStateEnum.Ready;
    })

    //update player rank
    socket.on('updateRank', (player: Player, rank: number) => {
        io.emit('updateRank', player, rank)
    })

    // cards dealt
    socket.on('dealCards', (currentPlayersData: any[]) => {
        const currentPlayers = currentPlayersData.map(playerData => Player.serialize(playerData));
        io.emit('dealCards', currentPlayersData);
    });

    //card played
    socket.on('playCards', (cardsPlayed: Card[], socketId: string, shouldClear: boolean, currentPlayer: Player, nextPlayer: Player) => {
        io.emit('playCards', cardsPlayed, socketId, shouldClear, currentPlayer, nextPlayer);
    })

    //Between card played and advancing turn check if player is out and if game is over
    socket.on('handlePlayerOut', () => {
        io.emit('handlePlayerOut');
    })

    //turn finished - advance to next player
    socket.on('changeTurn', (nextPlayer: Player, shouldClear: boolean) => {
        io.emit('changeTurn', nextPlayer, shouldClear);
    })

    //pass turn
    socket.on('passTurn', (currentPlayer: Player, nextPlayer: Player) => {
        io.emit('passTurn', currentPlayer, nextPlayer);
    })

    //reset game
    socket.on('reset', () => {

    })

    //remove players as they disconnect
    socket.on('disconnect', function () {
        console.log('An idiot disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id)
        //TODO - remove player from other clients
    })
})

http.listen(PORT, () => {
    console.log(`Asshole server started on port ${PORT}`);
})