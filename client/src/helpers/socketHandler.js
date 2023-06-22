import { io } from "socket.io-client";
import { Player } from "../model/player";
//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';
/**
 * Handles socket events for multiplayer functionality
 */
export default class SocketHandler {
    constructor(scene) {
        //server connection
        scene.socket = io(localURL);
        scene.socket.on('connect', () => {
            console.log("Game Connected!");
        });
        //Ready - Create Players
        scene.socket.on('ready', (players) => {
            players.forEach((p) => {
                //if player already exists with socketID delete first - TODO
                //
                let newPlayer = new Player(p, "Greg" + scene.currentPlayers.numberPlayers());
                scene.currentPlayers.addPlayer(newPlayer);
            });
            //set first turn
            scene.GameHandler.setMyTurn(scene);
        });
        //Deal Cards
        scene.socket.on('dealCards', (players) => {
            scene.currentPlayers.setPlayers(players); //set players with data on all clients
            scene.DeckHandler.displayCards();
            scene.dealText.disableInteractive();
            scene.readyText.disableInteractive();
        });
        //Advance Turn
        scene.socket.on('changeTurn', (cardPlayed) => {
            scene.GameHandler.changeTurn(scene, cardPlayed);
        });
        //Pass Turn
        scene.socket.on('passTurn', () => {
            scene.GameHandler.changeTurn(scene, null);
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
//# sourceMappingURL=socketHandler.js.map