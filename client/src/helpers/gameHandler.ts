/**
 * Setup for game and players state
 */
import Game from "../scenes/game";
import {Card} from "../model/card";
import { Player } from "../model/player";



export const enum gameState {
    Initializing = "Initializing",
    In_Progress = "In Progress",
    Complete = "Complete",
    Ready = "Ready"
}

export default class GameHandler {

    isMyTurn: boolean;
    playerHand: typeof Card[];
    opponentHand: typeof Card[];
    changeTurn: () => void;
    changeGameState: (gameState: any) => void;
    gameState: gameState;
    numberPlayers: number;
    addPlayers: () => void;


    constructor(scene: Game) {
        this.gameState = gameState.Initializing;
        this.isMyTurn = false;

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
        }
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        }
    }
}