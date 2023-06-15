"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GameHandler {
    constructor(scene) {
        this.gameState = "Initializing" /* gameState.Initializing */;
        this.isMyTurn = false;
        console.log("game handler constructor", scene.players);
        this.currentTurnPlayer = scene.players[0];
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        };
    }
    /**
     * Advances turn to next eligible player
     * @param scene
     */
    changeTurn(scene) {
        let nextPlayerPos = 0;
        //find index of current player in active players
        let currentPlayerPosition = scene.players.findIndex(p => {
            p.getId() === this.currentTurnPlayer.getId();
        });
        if (currentPlayerPosition < scene.players.length) {
            nextPlayerPos = currentPlayerPosition++;
        }
        else {
            nextPlayerPos = 0; //set back to beginning
        }
        this.setMyTurn(scene);
    }
    /**
     * sets currently client turn
     * @param scene
     */
    setMyTurn(scene) {
        if (this.currentTurnPlayer == null) {
            this.currentTurnPlayer = scene.players[0];
        }
        if (this.currentTurnPlayer.getId() === scene.socket.id) {
            this.isMyTurn = true;
        }
        else {
            this.isMyTurn = false;
        }
    }
}
exports.default = GameHandler;
//# sourceMappingURL=gameHandler.js.map