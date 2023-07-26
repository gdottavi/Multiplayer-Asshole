import { Server } from "socket.io";
import { createServer } from 'http';
import express from 'express'
import { Player } from "./client/src/model/player";
import { Card } from "./client/src/model/card";
import { gameStateEnum } from "./client/src/game_helpers/gameRuleHandler";
import { Players } from "./client/src/model/players";


const server = express();
const http = createServer(server);
const PORT = process.env.PORT || 3000;
let gameState = gameStateEnum.Initializing;
let players = new Players()

const io = new Server(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})

io.on('connection', function (socket) {

    console.log('An idiot connected: ' + socket.id);

    //retrieves current player list and sends back to the client requesting it
    socket.on('getPlayerList', () => {
        console.log('getPlayerList', players)
        io.to(socket.id).emit('playerList', players)
    })

    /**
     * Start Game --> Advances from Lobby Scene to Game Scene.  Sends players and socket to game for intialization. 
     */
    socket.on("startGame", (currentPlayers) => {
        console.log("start Game", currentPlayers); 
        io.emit("startGame", currentPlayers)
        
    });

    // Handle "joinGame" event
    socket.on("joinGame", (newPlayer) => {
        // Keep track of players joined on the server for any new players that join
        players.addPlayer(newPlayer)
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

        if (rank === null || player === null) return

        let currentPlayer = players.getPlayerById(player.socketId);
        //if(currentPlayer.rank === rank) return;

        currentPlayer.rank = rank
        io.emit('updateRank', player, rank)
    })

    // cards dealt
    socket.on('dealCards', (currentPlayersData: any[]) => {
        const currentPlayers = currentPlayersData.map(playerData => Player.serialize(playerData));
        io.emit('dealCards', currentPlayers);
    });

    // cards added to a players hand during game
    socket.on('cardsAdded', (player: Player, cardsToAdd: Card[]) => {
        io.emit('cardsAdded', player, cardsToAdd); 
    })

    //card played
    socket.on('playCards', (cardsPlayed: Card[], socketId: string, shouldClear: boolean, currentPlayer: Player, nextPlayer: Player) => {
        console.log('playCards')
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

    //Send back to lobby with current players
    socket.on('reset', (currentPlayers: Players) => {
       console.log('reset', currentPlayers)
        //update ranks of players if game completed
        updateRanks(currentPlayers);
        //io.emit('reset', currentPlayers)
    })

    //remove players as they disconnect
    socket.on('disconnect', function () {
        console.log('An idiot disconnected: ' + socket.id);
        players.resetPlayers()  //if a player drops ranks will be out of sync so need to clear
        players.removePlayer(socket.id)
        io.emit('playerExited', socket.id)
    })
})

http.listen(PORT, () => {
    console.log(`Asshole server started on port ${PORT}`);
})

/**
 *Updates player ranks on the server
 * @param currentPlayers - player list to update ranks for
 */
function updateRanks(currentPlayers: Players) {
    if (currentPlayers) {
        currentPlayers.players.forEach(p => {
            let player = players.getPlayerById(p.socketId);
            player.rank = p.nextGameRank ?? players.numberPlayers()-1;
        });
    }
}
