export default class GameHandler {
    constructor(scene) {
        this.gameState = "Initializing" /* gameState.Initializing */;
        this.isMyTurn = false;
        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
        };
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        };
    }
}
//# sourceMappingURL=gameHandler.js.map