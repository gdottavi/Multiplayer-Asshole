"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("./player");
class GameHandler {
    constructor(scene) {
        this.gameState = "Initializing" /* gameState.Initializing */;
        this.isMyTurn = false;
        this.playerHand = [];
        this.opponentHand = [];
        this.numberPlayers = 4;
        this.addPlayers = () => {
            for (let i = 0; i < this.numberPlayers; i++) {
                let player = new player_1.Player(i + "1", i + "Greg");
                scene.players.push(player);
            }
        };
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