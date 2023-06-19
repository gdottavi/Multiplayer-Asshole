/**
 * Setup for game and players state
 */
import Game from "../scenes/game";
import { Card } from "../model/card";
import { Player } from "../model/player";
import { Deck } from "../model/deck";
import CardSprite from "../model/cardSprite";
import { Scene } from "phaser";


export const enum gameState {
    Initializing = "Initializing",
    In_Progress = "In Progress",
    Complete = "Complete",
    Ready = "Ready"
}

export default class GameHandler {

    isMyTurn: boolean;
    changeGameState: (gameState: any) => void;
    gameState: gameState;
    currentTurnPlayer: Player;  //ID of current player who is currently up to play
    lastPlayedHand: Deck; 

    constructor(scene: Game) {
        this.gameState = gameState.Initializing;
        this.isMyTurn = false;
        this.currentTurnPlayer = scene.currentPlayers.players[0];
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        }
    }

    /**
     * Advances turn to next eligible player
     * @param scene 
     */
    changeTurn(scene: Game, cardPlayed: Card): void {

        //do not advance turn on a 2 played
        if(cardPlayed.value == '2') return; 

        let nextPlayerPos = 0;
        //find index of current player in active players
        let currentPlayerPosition = scene.currentPlayers.players.findIndex(p => p.getId() === this.currentTurnPlayer.getId());

        //set back to first player if at end
        if (currentPlayerPosition >= (scene.currentPlayers.numberPlayers() - 1) || currentPlayerPosition == -1) {
            currentPlayerPosition = 0;
        }

        else currentPlayerPosition++;

        this.currentTurnPlayer = scene.currentPlayers.players[currentPlayerPosition]
        this.setMyTurn(scene)

    }

    /**
     * 
     * @param socketId 
     * @param scene 
     * @param cardPlayed 
     */
    playCard(socketId: string, scene: Game, cardPlayed: Card): void {

        this.lastPlayedHand = new Deck(); 

        if (socketId !== scene.socket.id) {

            //find which player played the card and remove from their hand
            let player = scene.currentPlayers.getPlayerById(socketId); 
            player.removeCard(cardPlayed);

            //find sprite associated with the card played and remove it
            this.removeSprite(scene, cardPlayed);

            //show card played in middle for everyone
            console.log(scene.currentPlayedCards.getNumberCards())
            scene.DeckHandler.renderCard(scene, cardPlayed, ((scene.dropZone.x - 350) + (scene.currentPlayedCards.getNumberCards() * 50)), (scene.dropZone.y), 0.15,
                cardPlayed.FrontImageSprite, false);


        }

        //add cards to all cards played
        scene.currentPlayedCards.addCard(cardPlayed)
        //add card to last hand to beat unless a 4
        if(cardPlayed.value !== '4'){
            this.lastPlayedHand.addCard(cardPlayed); 
        }

        //clear cards when a 2 is played
        if(cardPlayed.value === '2'){
            this.clearCards(scene); 
        }

    }



    /**
     * sets currently client turn
     * @param scene 
     */
    setMyTurn(scene: Game): void {

        if (this.currentTurnPlayer == null) {
            this.currentTurnPlayer = scene.currentPlayers.players[0];
        }

        if (this.currentTurnPlayer.getId() === scene.socket.id) {
            this.isMyTurn = true;
        }
        else {
            this.isMyTurn = false;
        }
    }

    /**
     * Determines if a card played is valid and beats existing cards on table
     * @param cardPlayed 
     */
    canPlay(cardPlayed: Card): boolean {

        //first card played
        if (this.lastPlayedHand == null || this.lastPlayedHand.getNumberCards() === 0 ){return true; }

        //check if card value is higher than last card played
        if(cardPlayed.rank < this.lastPlayedHand.cards[0].rank){
            alert("Card value not high enough to beat previous play"); 
            return false; 
        }

        //check if 2 and clear

        //check if 4 or double and set skip

        return true;
    }

    /**
     * Clear cards played
     * @param scene 
     */
    clearCards(scene: Game): void {
        
        console.log('clear cards', scene.currentPlayedCards.cards); 
        scene.currentPlayedCards.cards.forEach(card => {
            console.log("card to remove", card)
            this.removeSprite(scene, card);
            
        })

        scene.currentPlayedCards.clearDeck(); 
    }


    /**
     * Find and remove sprite associated with a given card
     * @param scene 
     * @param card 
     */
    removeSprite(scene: Game, card: Card): void
    {

        let spriteToDestroy = scene.children.list.find(obj => {
            if (obj instanceof CardSprite) {
                return obj?.card?.key === card.key;
            }
        });
        //TODO move sprint off of page instead of just deleting
        spriteToDestroy.destroy(true); 
    }



}