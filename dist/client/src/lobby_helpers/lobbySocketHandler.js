"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const game_1 = require("../scenes/game");
const utils_1 = require("../utils/utils");
//import { displayPlayerName } from "./lobbyUIHandler";
//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';
// Access the Render environment variable directly
const baseURL = process.env.NODE_ENV === 'production' ? serverURL : localURL;
/**
 * Handles socket events for multiplayer functionality
 */
class LobbySocketHandler {
    constructor(scene) {
        //server connection
        scene.socket = (0, socket_io_client_1.io)(baseURL);
        // On connection check for already connected players
        scene.socket.on('connect', () => {
            scene.socket.emit('getPlayerList');
        });
        // Display all players already in game
        scene.socket.on('playerList', (players) => {
            players.players.forEach((player) => {
                scene.players.addPlayer(player);
                scene.LobbyUIHandler.addPlayerToGrid(player);
                console.log('playerList', player);
                scene.LobbyUIHandler.updateRank(player);
            });
        });
        // Listen for "playerJoined" event from the server
        scene.socket.on("playerJoined", (newPlayer) => {
            scene.players.addPlayer(newPlayer);
            scene.LobbyUIHandler.addPlayerToGrid(newPlayer);
        });
        // Listen for playerExited event from the server
        scene.socket.on("playerExited", (removedPlayerSocketId) => {
            let playerNameExited = scene.players.getPlayerById(removedPlayerSocketId).name;
            scene.players.removePlayer(removedPlayerSocketId);
            (0, utils_1.createToast)(scene, `${playerNameExited} left the game. Ranks Reset.`, 5000, (0, utils_1.getCenterX)(scene), 100);
            console.log('player left', scene.players);
            scene.LobbyUIHandler.removePlayersFromGrid();
            scene.players.players.forEach(player => {
                player.rank = null;
                scene.LobbyUIHandler.addPlayerToGrid(player);
                scene.LobbyUIHandler.updateRank(player);
            });
        });
        // Update player ranks 
        scene.socket.on('updateRank', (player, rank) => {
            let scenePlayer = scene.players.getPlayerById(player.socketId);
            scenePlayer.rank = rank;
            scene.LobbyUIHandler.updateRank(scenePlayer);
        });
        //Listen for "startGame" event from the server
        //Start Game --> Advances from Lobby Scene to Game Scene.  Sends players and socket to game for intialization. 
        scene.socket.on("startGame", (currentPlayers) => {
            scene.playSound(game_1.soundKeys.crackBeer);
            scene.scene.start("Game", { players: currentPlayers, socket: scene.socket });
        });
    }
}
exports.default = LobbySocketHandler;
//# sourceMappingURL=lobbySocketHandler.js.map