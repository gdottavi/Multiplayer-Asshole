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
        scene.socket.on('isPlayerA', () => {
            scene.isPlayerA = true;
        });
        //Ready - Create Players
        scene.socket.on('ready', (players) => {
            console.log("ready on client: ", players);
            players.forEach(p => {
                //if player already exists with socketID delete first - TODO
                //
                let newPlayer = new player_1.Player(p, "Greg" + scene.players.length);
                scene.players.push(newPlayer);
            });
            console.log(scene.players);
            //set first turn
            scene.GameHandler.setMyTurn(scene);
            console.log(scene.GameHandler.currentTurnPlayer);
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
        scene.socket.on('firstTurn', () => {
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
            console.log("card played received :", cardPlayed);
            //only perform on clients that did not play the card
            if (socketId !== scene.socket.id) {
                //scene.GameHandler.opponentHand.pop();
                //find which player played the card and remove from their hand - TODO
                scene.DeckHandler.renderCard(scene, cardPlayed, ((scene.dropZone.x - 350) + (scene.dropZone.data.values.cards * 50)), (scene.dropZone.y), 0.15, cardPlayed.FrontImageSprite, false);
                scene.dropZone.data.values.cards++;
            }
        });
    }
}
exports.default = SocketHandler;
//# sourceMappingURL=socketHandler.js.map