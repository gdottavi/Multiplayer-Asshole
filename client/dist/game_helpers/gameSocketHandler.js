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
//TODO - MAKE THIS STATIC - CAUSING ISSUES BY having multiple event listeners for sockets
/**
 * Handles socket events for multiplayer functionality
 */
class SocketHandler {
    static getInstance(scene) {
        if (!SocketHandler.instance) {
            SocketHandler.instance = new SocketHandler(scene);
        }
        return SocketHandler.instance;
    }
    constructor(scene) {
        if (SocketHandler.instance) {
            throw new Error("SocketHandler is a singleton, use getInstance() instead.");
        }
        this.scene = scene;
        this.addSocketListeners();
        SocketHandler.instance = this;
    }
    addSocketListeners() {
        //Deal Cards
        this.scene.socket.on('dealCards', (playerData) => {
            this.scene.DeckHandler.updateAfterDeal(playerData);
        });
        //Pass Turn 
        this.scene.socket.on('passTurn', (currentPlayer, nextPlayer) => {
            this.scene.GameTurnHandler.changeTurn(this.scene, currentPlayer, nextPlayer, false, true);
        });
        //Cards Added To Player (e.g. tried to end on 2 or 4)
        this.scene.socket.on('cardsAdded', (updatedPlayer, cards) => {
            this.scene.DeckHandler.updateAfterCardAdd(updatedPlayer, cards);
        });
        //Reset Game
        this.scene.socket.on('reset', () => {
            console.log('reset');
            this.scene.GameTurnHandler.resetGame();
        });
        //Change Game State
        this.scene.socket.on('changeGameState', (gameState) => {
            this.scene.GameRuleHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                this.scene.dealText.setInteractive();
                this.scene.dealText.setColor(themeColors.cyan);
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
        this.scene.socket.on('playCards', (cardsPlayed, socketId, shouldClear, currentPlayer, nextPlayer) => __awaiter(this, void 0, void 0, function* () {
            yield this.scene.GameRuleHandler.playCards(socketId, cardsPlayed);
            yield this.scene.GameTurnHandler.handleEndTwoFour(cardsPlayed, currentPlayer);
            yield this.scene.GameTurnHandler.handlePlayerOut(this.scene, currentPlayer);
            this.scene.GameTurnHandler.changeTurn(this.scene, currentPlayer, nextPlayer, shouldClear);
            console.log('socket on play cards', this.scene.currentPlayers);
        }));
    }
}
SocketHandler.instance = null;
export default SocketHandler;
//# sourceMappingURL=gameSocketHandler.js.map