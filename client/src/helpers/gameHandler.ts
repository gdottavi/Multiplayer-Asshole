/**
 * Setup for game and players state
 */
import Game from "../scenes/game";
import { Card } from "../model/card";
import { Player } from "../model/player";
import { Deck } from "../model/deck";
import CardSprite from "../model/cardSprite";
import { Physics, Scene } from "phaser";
import { themeColors } from "./uiHandler";
import Utils from "./utils";



export const enum gameStateEnum {
    Initializing = "Initializing",
    In_Progress = "In Progress",
    Complete = "Complete",
    Ready = "Ready"
}

const four = '4', two = '2';
const utils = new Utils();

export default class GameHandler {

    isMyTurn: boolean;
    changeGameState: (gameState: any) => void;
    gameState: gameStateEnum;
    currentTurnPlayer: Player;  //ID of current player who is currently up to play
    lastPlayedHand: Deck;
    queuedCardsToPlay: Deck;
    shouldClear: boolean;
    lastHandCleared: boolean;  //used to track if last hand played cleared the middle


    constructor(scene: Game) {
        this.gameState = gameStateEnum.Initializing;
        this.isMyTurn = false;
        this.currentTurnPlayer = scene.currentPlayers.players[0];
        this.queuedCardsToPlay = new Deck();
        this.lastPlayedHand = new Deck();
        this.shouldClear = false;
        this.lastHandCleared = false;

        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        }

    }

    /**
     * Advances turn to next player
     * @param scene 
     * @param nextPlayer - player to set as current player
     * @param shouldClear - indicates cards should be cleared from middle
     */
    async changeTurn(scene: Game, nextPlayer: Player, shouldClear?: boolean): Promise<void> {

        //set if cards should be cleared for clients who did not play the cards
        if (this.currentTurnPlayer.socketId !== scene.socket.id) {
            this.shouldClear = shouldClear;
        }

        //current --> last and next --> current
        let lastPlayer = this.currentTurnPlayer;
        this.setTurn(scene, nextPlayer)
        scene.UIHandler.updatePlayerNameColor(scene, nextPlayer.socketId, themeColors.yellow);

        //check if cards should be cleared after changing turn
        if (this.checkClear(lastPlayer, nextPlayer)) {
            this.lastHandCleared = true;
            await this.clearCards(scene);
            this.shouldClear = false;

        }
        else {
            //cards not cleared and turn advanced
            this.lastHandCleared = false;
        }
    }

    /**
     * Given cards played returns the next player up to play
     * @param scene 
     * @param cardsPlayed 
     * @returns - Player that is up next
     */
    getNextTurnPlayer(scene: Game, cardsPlayed: Card[]): Player {

        let nextTurnPlayer = this.currentTurnPlayer

        //do not advance turn on a 2 played
        if (cardsPlayed[0]?.value == two) return nextTurnPlayer;

        //sanity check
        if (scene.currentPlayers.players.length < 2) return nextTurnPlayer

        //find current player in active players
        let currentPlayerPosition = scene.currentPlayers.players.findIndex(p => p.socketId === this.currentTurnPlayer.socketId);

        //set back to first player if at end otherwise advance to next position
        let nextPlayerPosition = 0;
        if (currentPlayerPosition >= (scene.currentPlayers.numberPlayers() - 1) || currentPlayerPosition == -1) {
            nextPlayerPosition = 0;
        }
        else nextPlayerPosition++;


        //if card(s) played matched last card(s) skip player --TODO FIX THIS - NOT WORKING
        if (cardsPlayed?.length === 1 && (this.getLastPlayedHand(scene)?.length === cardsPlayed.length) && (cardsPlayed[0]?.value === this.getLastPlayedHand(scene)[0]?.value)) {
            //set back to first player if at end otherwise advance to next position
            if (nextPlayerPosition >= (scene.currentPlayers.numberPlayers() - 1) || nextPlayerPosition == -1) {
                nextPlayerPosition = 0;
            }
            else nextPlayerPosition++;
        }

        nextTurnPlayer = scene.currentPlayers.players[nextPlayerPosition]

        return nextTurnPlayer;


    }


    /**
     * Sets the current turn player to calculated next player for all clients through socket.io call
     * @param nextPlayer - next player up to now set as current player
     */
    setTurn(scene: Game, nextPlayer: Player): void {

        this.currentTurnPlayer = nextPlayer;

        //determine if current player is this client (getting some errors here)
        if (this.currentTurnPlayer.socketId === scene.socket.id) {
            this.isMyTurn = true;
        }
        else {
            this.isMyTurn = false;
        }

    }

    /**
     * Determines if cards in middle should be cleared after a play
     * @returns true if cards should be cleared
     */
    checkClear(prevPlayer: Player, currentPlayer: Player): boolean {

        //cards played which would clear - 2, 4 of a kind, complete square
        if (this.shouldClear) return true;

        //play has returned to original player and not immediately following a clear
        if ((prevPlayer.socketId === currentPlayer.socketId) && !this.lastHandCleared) return true;

        //default 
        return false;

    }


    /**
     * Plays a single card for all opponent clients
     * @param socketId 
     * @param scene 
     * @param cardsPlayed 
     */
    playCards(socketId: string, scene: Game, cardsPlayed: Card[]): void {

        let handPlayed = new Deck();
        scene.currentPlayedCards.push(handPlayed);

        cardsPlayed.forEach(cardPlayed => {

            //add card to the hand played in the current played cards deck
            handPlayed.addCard(cardPlayed);

            //update for all clients other than current
            if (socketId !== scene.socket.id) {

                //find which player played the card and remove from their hand
                let player = scene.currentPlayers.getPlayerById(socketId);
                player.removeCard(cardPlayed);

                //find sprite associated with the card played and remove it
                this.removeSprite(scene, cardPlayed);

                //show card played in middle for everyone
                scene.DeckHandler.renderCard(scene, cardPlayed, ((scene.dropZone.x - 350) + (scene.GameHandler.getTotalCountCardsPlayed(scene) * 50)), (scene.dropZone.y), 0.1,
                    cardPlayed.frontImageSprite, false);

            }
        })


    }



    /**
     * Returns the last hand played that is not a 4
     */
    getLastPlayedHand(scene: Game): Card[] | null {

        if (scene.currentPlayedCards.length === 0) return null;

        let lastPlayedHand = scene.currentPlayedCards[scene.currentPlayedCards.length - 1].cards;

        if (lastPlayedHand.length === 0) return null;

        //Do not count 4's as last hand played
        if (lastPlayedHand[0].value === four) {
            if (scene.currentPlayedCards.length === 1) {
                return null;
            }
            else {
                lastPlayedHand = scene.currentPlayedCards[scene.currentPlayedCards.length - 2].cards;
            }
        }

        return lastPlayedHand;
    }

    /**
     * Returns total number of cards played
     * @param scene 
     * @returns 
     */
    getTotalCountCardsPlayed(scene: Game): number {

        return scene.currentPlayedCards.reduce((count: number, hand: Deck) => count + hand.cards.length, 0);
    }

    /**
     * Main game rules. Determines if a card played is valid and beats existing cards on table
     * @param cardsPlayed 
     */
    canPlay(scene: Game, cardsPlayed: Card[]): boolean {

        //check if completing square before turn since this can be done out of turn
        if (this.checkSquareCompleted(scene, cardsPlayed)) {
            this.shouldClear = true;
            return true
        }

        //not this players turn
        if (!this.isMyTurn) return false;

        //check clear conditions first in order to properly set shouldClear
            //four of a kind played
        if (cardsPlayed.length === 4 && cardsPlayed.every(card => card.value === cardsPlayed[0].value)) {
            this.shouldClear = true;
            return true;
        }
            //single 2 played 
        if (cardsPlayed.length === 1 && cardsPlayed[0].value === two) {
            this.shouldClear = true
            return true
        }


        let lastPlayedHand = this.getLastPlayedHand(scene);

        //first card played
        if (lastPlayedHand == null || lastPlayedHand.length === 0) return true;

        //single 4 played
        if (cardsPlayed.length === 1 && cardsPlayed[0].value === four) return true;

        //more than 4 cards played
        if (cardsPlayed.length > 4) {
            alert("Cannot play " + cardsPlayed.length + " cards at once.");
            return false;
        }

        //single on double or double on triple 
        if (cardsPlayed.length < lastPlayedHand.length) {
            alert("Last play was " + lastPlayedHand.length + " of a kind.  You only played " + cardsPlayed.length + " cards.")
            return false
        }

        //multiple cards played with different values
        if (!cardsPlayed.every(card => card.value === cardsPlayed[0].value)) {
            alert("Cannot play multiple cards of different values.")
            return false;
        }

        //single card played
        if (cardsPlayed.length === 1) {
            if (cardsPlayed[0].rank < lastPlayedHand[0].rank) {
                alert("Must play doubles higher than last played double")
                return false;
            }
        }

        //doubles played
        if (cardsPlayed.length === 2) {

            if (cardsPlayed[0].value === two || cardsPlayed[0].value === four) {
                alert("Cannot play multiple 2s or 4s")
                return false
            }

            if (lastPlayedHand.length < 2) return true;

            if (cardsPlayed[0].rank < lastPlayedHand[0].rank) {
                alert("Must play doubles higher than last played double")
                return false;
            }

        }

        //triples played
        if (cardsPlayed.length === 3) {

            if (cardsPlayed[0].value === two || cardsPlayed[0].value === four) {
                alert("Cannot play multiple 2s or 4s")
                return false
            }

            if (lastPlayedHand.length < 3) return true;

            if (cardsPlayed[0].rank < lastPlayedHand[0].rank) {
                alert("Must play triples higher than last played triple")
                return false;
            }

        }



        //default
        return true;

    }

    /**
     * Check if square is completed 4 of same card (e.g. 4 Kings) played in a row.  
     * Allowed to play out of turn.  4 of a kind single play checked elsewhere. 
     * @param scene 
     * @param cardsPlayed - cards attempted to play
     * @returns 
     */
    checkSquareCompleted(scene: Game, cardsPlayed: Card[]): boolean {

        //sanity checks
        if (cardsPlayed === null || cardsPlayed.length === 0) return false;
        if (scene === null) return false;

        //get the cards that have been played by all players this hand in middle.  flatMap takes the hands played and creates single array
        let playedCards = this.getAllPlayedCards(scene);

        //first card played
        if (playedCards == null || playedCards.length === 0) return false;

        //2 or 4 played
        if (cardsPlayed[0].value === two || cardsPlayed[0].value === four) return false;

        //4 played last hand
        let lastCardPos = playedCards.length - 1;
        if (playedCards[lastCardPos].value === four) return false;

        //does not match last card played
        if (playedCards[lastCardPos].value !== cardsPlayed[0].value) return false;

        //multiple cards played with different values - illegal move - sanity check
        if (!cardsPlayed.every(card => card.value === cardsPlayed[0].value)) {
            return false;
        }

        //3 cards played on 1 match
        if (cardsPlayed.length === 3) return true;

        //2 cards played on 2 matches
        if (cardsPlayed.length === 2) {
            if (!utils.areLastXValuesEqual(playedCards, 2)) return false
            return true
        }

        //1 card played on 3 matches
        if (cardsPlayed.length === 1) {
            if (!utils.areLastXValuesEqual(playedCards, 3)) return false;
            return true;
        }

        //default
        return false;
    }


    /**
     * Clear cards played
     * @param scene 
     */
    async clearCards(scene: Game): Promise<void> {

        //delay by 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.getAllPlayedCards(scene).forEach(card => {
            scene.InteractiveHandler.moveCard(scene, this.findSprite(scene, card))
        })

        scene.currentPlayedCards.forEach(hand => hand.clearDeck())
    }

    /**
     * Gets all played hands currently in middle
     * @param scene 
     */
    getAllPlayedCards(scene: Game): Card[] {

        return scene.currentPlayedCards.flatMap((deck: Deck) => deck.cards)

    }


    /**
     * Find and remove sprite associated with a given card
     * @param scene 
     * @param card 
     */
    removeSprite(scene: Game, card: Card): void {
        this.findSprite(scene, card).destroy(true);
    }

    /**
     * Find sprite associated with a given card object in the scene
     * @param scene 
     * @param card 
     * @returns card sprite associated with card
     */
    findSprite(scene: Game, card: Card): CardSprite {

        let sprite = scene.children.list.find(obj => {
            if (obj instanceof CardSprite) {
                return obj?.card?.key === card.key;
            }
        })

        if (sprite instanceof CardSprite) { return sprite }
        else return null;
    }



}