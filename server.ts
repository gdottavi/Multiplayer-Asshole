import { GameObjects } from "phaser";
import { Server } from "socket.io";
import {createServer} from 'http'; 
import express from 'express'
import { Player } from "./client/src/model/player";
import { Players } from "./client/src/model/players";
import { Card } from "./client/src/model/card";


const server = express(); 
const http = createServer(server);
const PORT = process.env.PORT || 3000; 
let gameState = "Initializing";
let players = []; 

const io = new Server(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})
/* const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});  */


const getPlayers = () => {
    let clients = io.sockets.fetchSockets
}

io.on('connection', function(socket){
    console.log('An idiot connected: ' + socket.id);

    //players[socket.id] = socket.id;
    players.push(socket.id); 

    //add players as they connect
    //players.push(socket.id);
 /*    if(players.length === 1){
        io.emit('isPlayerA');
        io.emit('firstTurn');
    } */
   // io.emit('newPlayer', socket.id); 

    //ready to play
    socket.on('ready', () => {
        console.log("server players: ")
        console.log(players);
        io.emit('ready', players); 
    })

    //cards dealt
    socket.on('dealCards', (socketId) => {
        console.log(players);
        io.emit('dealCards', socketId);
        gameState = "Ready";
        io.emit('changeGameState',"Ready");
    })

    //card played
    socket.on('cardPlayed', (cardPlayed: Card, socketId) => {
        io.emit('cardPlayed', cardPlayed, socketId);
        io.emit('changeTurn');
    })

    //remove players as they disconnect
    socket.on('disconnect', function(){
        console.log('An idiot disconnected: ' + socket.id); 
        players = players.filter(player => player !== socket.id)
    })
})

http.listen(PORT, () => {
    console.log(`Asshole server started on port ${PORT}`); 
})