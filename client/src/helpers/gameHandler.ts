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
    changeGameState: (gameState: any) => void;
    gameState: gameState;
    numberPlayers: number;
    addPlayers: () => void;
    currentTurnPlayer: Player;  //ID of current player who is currently up to play


    constructor(scene: Game) {
        this.gameState = gameState.Initializing;
        this.isMyTurn = false;
        console.log("game handler constructor", scene.players)
        this.currentTurnPlayer = scene.players[0]; 
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        }
    }

    /**
     * Advances turn to next eligible player
     * @param scene 
     */
    changeTurn(scene: Game): void{

        let nextPlayerPos = 0; 
        //find index of current player in active players
        let currentPlayerPosition = scene.players.findIndex(p => p.getId() === this.currentTurnPlayer.getId());

        //set back to first player if at end
        if(currentPlayerPosition >= (scene.players.length - 1)|| currentPlayerPosition == -1){
            currentPlayerPosition = 0; 
        }
        else currentPlayerPosition++; 

        this.currentTurnPlayer = scene.players[currentPlayerPosition]
        this.setMyTurn(scene)

    }


    /**
     * sets currently client turn
     * @param scene 
     */
    setMyTurn(scene: Game): void{

        if(this.currentTurnPlayer == null){
            this.currentTurnPlayer = scene.players[0]; 
        }

        if(this.currentTurnPlayer.getId() === scene.socket.id){
            this.isMyTurn = true;
        }
        else{
            this.isMyTurn = false; 
        }
    }

}