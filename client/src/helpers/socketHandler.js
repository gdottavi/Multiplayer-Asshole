import { io } from "socket.io-client";
import { Player } from "../model/player";
import CardSprite from "../model/cardSprite";
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
                let newPlayer = new Player(p, "Greg" + scene.players.length);
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
            //only perform on clients that did not play the card
            if (socketId !== scene.socket.id) {
                //find which player played the card and remove from their hand
                let player = scene.players.find(p => p.getId() === socketId);
                player.cardHand.filter(c => c.key !== cardPlayed.key);
                player.removeCard(cardPlayed);
                //find sprite associated with the card played and remove it
                let spriteToDestroy = scene.children.list.find(obj => {
                    var _a;
                    if (obj instanceof CardSprite) {
                        return ((_a = obj === null || obj === void 0 ? void 0 : obj.card) === null || _a === void 0 ? void 0 : _a.key) === cardPlayed.key;
                    }
                });
                spriteToDestroy.destroy(true);
                //show card played in middle for everyone
                scene.DeckHandler.renderCard(scene, cardPlayed, ((scene.dropZone.x - 350) + (scene.dropZone.data.values.cards * 50)), (scene.dropZone.y), 0.15, cardPlayed.FrontImageSprite, false);
                scene.dropZone.data.values.cards++;
            }
        });
    }
}
//# sourceMappingURL=socketHandler.js.map