import { Server } from "socket.io";
import { createServer } from 'http';
import express from 'express'
import { Player } from "./client/src/model/player";
import { Card } from "./client/src/model/card";
import { gameStateEnum } from "./client/src/helpers/gameRuleHandler";



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


    //ready to play the game
    socket.on('ready', () => {
        io.emit('ready', players);
        gameState = gameStateEnum.Ready;
    })

    //cards dealt
    socket.on('dealCards', (currentPlayers: Player[]) => {
        io.emit('dealCards', currentPlayers);
        //gameState = "Ready";
        //io.emit('changeGameState',"Ready");
    })

    //card played
    socket.on('playCards', (cardsPlayed: Card[], socketId) => {
        io.emit('playCards', cardsPlayed, socketId);
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
    socket.on('passTurn', (nextPlayer: Player) => {
        io.emit('passTurn', nextPlayer);
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