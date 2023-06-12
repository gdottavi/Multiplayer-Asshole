//Not yet used

import Game from "../scenes/game";



const enum gameState {
    Initializing,
    In_Progress,
    Complete
}

export default class GameHandler {

  
    isMyTurn: boolean;
    playerDeck: any[];
    opponentDeck: any[];
    playerHand: any[];
    opponentHand: any[];
    changeTurn: () => void;
    changeGameState: (gameState: any) => void;
    gameState: gameState;
   

    constructor(scene: Game) {
        this.gameState = gameState.Initializing ;
        this.isMyTurn = false;
        this.playerDeck = [];
        this.opponentDeck = [];
        this.playerHand = [];
        this.opponentHand = [];

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
        }

        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        }
    }
}