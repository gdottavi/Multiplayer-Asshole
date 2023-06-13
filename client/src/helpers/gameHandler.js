"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameHandler {
    constructor(scene) {
        this.gameState = "Initializing" /* gameState.Initializing */;
        this.isMyTurn = false;
        this.playerHand = [];
        this.opponentHand = [];
        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
        };
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        };
    }
}
exports.default = GameHandler;
//# sourceMappingURL=gameHandler.js.map