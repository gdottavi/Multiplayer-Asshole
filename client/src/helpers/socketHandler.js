"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
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
        //Deal Cards
        scene.socket.on('dealCards', () => {
            scene.DeckHandler.dealCards();
            scene.dealText.disableInteractive();
        });
        //Advance Turn
        scene.socket.on('changeTurn', () => {
            scene.GameHandler.changeTurn();
        });
        scene.socket.on('firstTurn', () => {
            scene.GameHandler.changeTurn();
        });
        //Change Game State
        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                scene.dealText.setInteractive();
                scene.dealText.setColor('#00ffff');
            }
        });
        //Card Played
        scene.socket.on('cardPlayed', (cardKey, socketId) => {
            /*  if (socketId !== scene.socket.id) {
                 scene.GameHandler.opponentHand.pop();
                 let card = new Card(scene);
                 card.render(((scene.dropZone.x - 350) + (scene.dropZone.data.values.cards * 50)), (scene.dropZone.y), cardKey, cardType.opponent);
                 scene.dropZone.data.values.cards++;
             } */
        });
    }
}
exports.default = SocketHandler;
//# sourceMappingURL=socketHandler.js.map