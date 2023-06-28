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

    constructor(scene: Game) {
        this.gameState = gameStateEnum.Initializing;
        this.isMyTurn = false;
        this.currentTurnPlayer = scene.currentPlayers.players[0];
        this.queuedCardsToPlay = new Deck();
        this.lastPlayedHand = new Deck();
        this.shouldClear = false;

        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        }



    }

    /**
     * Advances turn to next player
     * @param scene 
     * @param nextPlayer - player to set as current player
     */
    changeTurn(scene: Game, nextPlayer: Player): void {

        let lastPlayer = this.currentTurnPlayer;
        this.setTurn(scene, nextPlayer)
        scene.UIHandler.updatePlayerNameColor(scene, nextPlayer.socketId, themeColors.yellow);

        //check if cards should be cleared after changing turn
        if (this.checkClear(lastPlayer, nextPlayer)) this.clearCards(scene);

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
        if (cardsPlayed[0]?.value == '2') return nextTurnPlayer;

        //sanity check
        if (scene.currentPlayers.players.length < 2) return nextTurnPlayer

        //find current player in active players
        let currentPlayerPosition = scene.currentPlayers.players.findIndex(p => p.socketId === this.currentTurnPlayer.socketId);

        //set back to first player if at end
        let nextPlayerPosition = 0;
        if (currentPlayerPosition >= (scene.currentPlayers.numberPlayers() - 1) || currentPlayerPosition == -1) {
            nextPlayerPosition = 0;
        }

        //advance to next player
        else nextPlayerPosition++;
        nextTurnPlayer = scene.currentPlayers.players[nextPlayerPosition]

        //if card(s) played matched last card(s) skip player --TODO FIX THIS - NOT WORKING
        if (this.lastPlayedHand.length === cardsPlayed.length) {
            for (let i = 0; i < cardsPlayed.length; i++) {
                if (cardsPlayed[i].value !== this.lastPlayedHand[i].value) {
                    return;
                }
            }
            nextPlayerPosition++;
            nextTurnPlayer = scene.currentPlayers.players[nextPlayerPosition];
        }

        //default
        return nextTurnPlayer;

    }


    /**
     * Sets the current turn player for all clients through socket.io call
     * @param currentTurnPlayer 
     */
    setTurn(scene: Game, currentTurnPlayer: Player): void {

        this.currentTurnPlayer = currentTurnPlayer;

        //determine if current player is this client
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

        //play has returned to original player
        if (prevPlayer.socketId === currentPlayer.socketId) return true;

        //cards played which would clear - 2, 4 of a kind, complete square
        return this.shouldClear;
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

        let lastPlayedHand = this.getLastPlayedHand(scene);

        //first card played
        if (lastPlayedHand == null || lastPlayedHand.length === 0) return true;

        //single 2 played 
        if (cardsPlayed.length === 1 && cardsPlayed[0].value === two) {
            this.shouldClear = true;
            return true;
        }

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

            if (cardsPlayed[0].value === '2' || cardsPlayed[0].value === four) {
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

            if (cardsPlayed[0].value === '2' || cardsPlayed[0].value === four) {
                alert("Cannot play multiple 2s or 4s")
                return false
            }

            if (lastPlayedHand.length < 3) return true;

            if (cardsPlayed[0].rank < lastPlayedHand[0].rank) {
                alert("Must play triples higher than last played triple")
                return false;
            }

        }

        //four of a kind played
        if (cardsPlayed.length === 4) {
            this.shouldClear = true;
            return true;
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
    clearCards(scene: Game): void {

        this.getAllPlayedCards(scene).forEach(card => {
            //this.removeSprite(scene, card);
            scene.InteractiveHandler.moveCard(scene, this.findSprite(scene, card))
        })

        scene.currentPlayedCards.forEach(hand => hand.clearDeck())

        console.log("cleared", scene.currentPlayedCards); 
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