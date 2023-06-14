/**
 * Setup for game and players state
 */
import Game from "../scenes/game";
import {Card} from "./card";
import { Player } from "./player";



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
        this.playerHand = [];
        this.opponentHand = [];


        this.numberPlayers = 4; 

        this.addPlayers = () => {
            for(let i=0; i < this.numberPlayers; i++){
                let player = new Player(i + "1", i + "Greg"); 
                scene.players.push(player); 
            }
        }

        this.changeTurn = () => {
            this.isMyTurn = !this.isMyTurn;
        }
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        }
    }
}