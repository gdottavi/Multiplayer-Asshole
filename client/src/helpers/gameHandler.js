//Not yet used
export default class GameHandler {
    constructor(scene) {
        this.gameState = 0 /* gameState.Initializing */;
        this.isMyTurn = false;
        this.playerDeck = [];
        this.opponentDeck = [];
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
//# sourceMappingURL=gameHandler.js.map