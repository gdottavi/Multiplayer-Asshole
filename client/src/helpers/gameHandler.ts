/**
 * Setup for game and players state
 */
import Game from "../scenes/game";



export const enum gameState {
    Initializing = "Initializing",
    In_Progress = "In Progress",
    Complete = "Complete",
    Ready = "Ready"
}

export default class GameHandler {

  
    isMyTurn: boolean;
    playerHand: any[];
    opponentHand: any[];
    changeTurn: () => void;
    changeGameState: (gameState: any) => void;
    gameState: gameState;
   

    constructor(scene: Game) {
        this.gameState = gameState.Initializing ;
        this.isMyTurn = false;
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