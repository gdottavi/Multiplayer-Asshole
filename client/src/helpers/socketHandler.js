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
        scene.socket.on('isPlayerA', () => {
            scene.isPlayerA = true;
        });
        //Ready - Create Players
        scene.socket.on('ready', (players) => {
            console.log("ready on client: ", players);
            players.forEach(p => {
                //if player already exists with socketID delete first - TODO
                //
                let newPlayer = new Player(p, "Greg" + scene.players.length);
                scene.players.push(newPlayer);
            });
            console.log(scene.players);
        });
        //Deal Cards
        scene.socket.on('dealCards', (socketId, players) => {
            scene.DeckHandler.dealCards(socketId);
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
//# sourceMappingURL=socketHandler.js.map