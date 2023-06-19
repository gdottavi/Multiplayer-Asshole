"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const player_1 = require("../model/player");
//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';
/**
 * Handles socket events for multiplayer functionality
 */
class SocketHandler {
    constructor(scene) {
        //server connection
        scene.socket = (0, socket_io_client_1.io)(localURL);
        scene.socket.on('connect', () => {
            console.log("Game Connected!");
        });
        //Ready - Create Players
        scene.socket.on('ready', (players) => {
            players.forEach((p) => {
                //if player already exists with socketID delete first - TODO
                //
                let newPlayer = new player_1.Player(p, "Greg" + scene.players.length);
                scene.players.push(newPlayer);
            });
            //set first turn
            scene.GameHandler.setMyTurn(scene);
        });
        //Deal Cards
        scene.socket.on('dealCards', (socketId, players) => {
            scene.DeckHandler.dealCards(socketId);
            scene.dealText.disableInteractive();
        });
        //Advance Turn
        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn(scene);
        });
        //Change Game State
        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                scene.dealText.setInteractive();
                scene.dealText.setColor('#00ffff');
            }
        });
        /**
         * Card Played - show on all clients and remove cards from hand
         */
        scene.socket.on('cardPlayed', (cardPlayed, socketId) => {
            scene.GameHandler.playCard(socketId, scene, cardPlayed);
        });
    }
}
exports.default = SocketHandler;
//# sourceMappingURL=socketHandler.js.map