var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { themeColors } from "./gameUIHandler";
import { setActiveText } from "../utils/utils";
//server is for production deploy local is for testing
//const localURL = 'http://localhost:3000';
//const serverURL = 'https://asshole-server.onrender.com';
/**
 * Handles socket events for multiplayer functionality
 */
export default class SocketHandler {
    constructor(scene) {
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
            setActiveText(scene.dealText);
        });
        //Change Game State
        scene.socket.on('changeGameState', (gameState) => {
            scene.GameRuleHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                scene.dealText.setInteractive();
                scene.dealText.setColor(themeColors.cyan);
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
//# sourceMappingURL=gameSocketHandler.js.map