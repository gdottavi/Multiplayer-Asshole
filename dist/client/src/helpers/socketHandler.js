"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("../model/player");
const uiHandler_1 = require("./uiHandler");
const utils_1 = require("../utils/utils");
//server is for production deploy local is for testing
//const localURL = 'http://localhost:3000';
//const serverURL = 'https://asshole-server.onrender.com';
/**
 * Handles socket events for multiplayer functionality
 */
class SocketHandler {
    constructor(scene) {
        // //server connection
        // scene.socket = io(localURL);
        // scene.socket.on('connect', () => {
        //     console.log("Game Connected!");
        // })
        //Ready - Create Players from array of socket Ids (players)
        scene.socket.on('ready', (players) => {
            players.forEach((socketID) => {
                //if player already exists with socketID delete first - TODO
                let newPlayer = new player_1.Player(socketID, "Player " + scene.currentPlayers.numberPlayers());
                scene.currentPlayers.addPlayer(newPlayer);
            });
            //set first turn
            scene.GameTurnHandler.setTurn(scene.currentPlayers.players[0]);
            //update state of menu options
            (0, utils_1.setActiveText)(scene.dealText);
            (0, utils_1.setInactiveText)(scene.readyText);
            (0, utils_1.setActiveText)(scene.sortCardsText);
        });
        //Deal Cards
        scene.socket.on('dealCards', (playerData) => {
            scene.DeckHandler.updateAfterDeal(playerData);
        });
        //Pass Turn 
        scene.socket.on('passTurn', (currentPlayer, nextPlayer) => {
            scene.GameTurnHandler.changeTurn(scene, currentPlayer, nextPlayer, false, true);
        });
        //Reset Game
        scene.socket.on('reset', () => {
            scene.GameTurnHandler.resetGame();
            (0, utils_1.setActiveText)(scene.dealText);
        });
        //Change Game State
        scene.socket.on('changeGameState', (gameState) => {
            scene.GameRuleHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                scene.dealText.setInteractive();
                scene.dealText.setColor(uiHandler_1.themeColors.cyan);
            }
        });
        /**
         * Card Played Handling for all Clients
         *   - show cards played on all clients
         *   - remove cards form opponent hands
         *   - check if should clear played cards
         *   - handle players winning/exiting game
         *   - handle updating turn
         */
        scene.socket.on('playCards', (cardsPlayed, socketId, shouldClear, currentPlayer, nextPlayer) => __awaiter(this, void 0, void 0, function* () {
            yield scene.GameRuleHandler.playCards(socketId, cardsPlayed);
            yield scene.GameTurnHandler.handlePlayerOut(scene, currentPlayer);
            scene.GameTurnHandler.changeTurn(scene, currentPlayer, nextPlayer, shouldClear);
        }));
    }
}
exports.default = SocketHandler;
//# sourceMappingURL=socketHandler.js.map