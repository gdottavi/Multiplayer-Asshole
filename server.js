"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server = require('express')();
var http = require('http').createServer(server);
var io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});
var players = [];
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
    socket.on('cardPlayed', function (gameObject, isPlayerA) {
        console.log("on server: " + gameObject);
        io.emit('cardPlayed', gameObject, isPlayerA);
    });
    socket.on('disconnect', function () {
        console.log('An idiot disconnected: ' + socket.id);
        //remove player 
        players = players.filter(function (player) { return player !== socket.id; });
    });
});
http.listen(3000, function () {
    console.log('Asshole server started');
});
