import Game from "../scenes/game";
import { Player } from "../model/player";
import Utils from "./utils";
import { themeColors } from "./uiHandler";
import { Card } from "../model/card";

const utils = new Utils(); 
const four = '4', two = '2';

/**
 * Handles all turn changes, clearing and end game scenarios
 */
export default class GameTurnHandler {
    isMyTurn: boolean;
    currentTurnPlayer: Player;
    currentPlayers: Player[];
    shouldClear: boolean;
    lastHandCleared: boolean;

    constructor(scene: Game) {
        this.isMyTurn = false;
        this.currentTurnPlayer = scene.currentPlayers.players[0];
        this.currentPlayers = scene.currentPlayers.players;
        this.shouldClear = false;
        this.lastHandCleared = false;  //used to track if last hand played cleared the middle
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
        if (this.currentPlayers.length < 2) return nextTurnPlayer

        //find current player in active players
        let currentPlayerPosition = this.currentPlayers.findIndex(p => p.socketId === this.currentTurnPlayer.socketId);

        //set back to first player if at end otherwise advance to next position
        let nextPlayerPosition = 0;
        if (currentPlayerPosition >= (scene.currentPlayers.numberPlayers() - 1) || currentPlayerPosition == -1) {
            nextPlayerPosition = 0;
        }
        else nextPlayerPosition++;


        //if card(s) played matched last card(s) skip player
        if (cardsPlayed?.length === 1 && (scene.DeckHandler.getLastPlayedHand(scene.currentPlayedCards)?.length === cardsPlayed.length) && (cardsPlayed[0]?.value === scene.DeckHandler.getLastPlayedHand(scene.currentPlayedCards)[0]?.value)) {
            //set back to first player if at end otherwise advance to next position
            if (nextPlayerPosition >= (scene.currentPlayers.numberPlayers() - 1) || nextPlayerPosition == -1) {
                nextPlayerPosition = 0;
            }
            else nextPlayerPosition++;
        }

        nextTurnPlayer = this.currentPlayers[nextPlayerPosition]

        //TODO - check if player is in game, if not advance to next player
        let initialPlayerPosition = nextPlayerPosition; // Store the initial player position

        // Loop through all players and find the next available player
        while (nextPlayerPosition !== initialPlayerPosition) {

            nextTurnPlayer = this.currentPlayers[nextPlayerPosition];

            // Check if the next player is in the game
            if (nextTurnPlayer.inGame) {
                // Found an available player, break out of the loop
                break;
            }

            // Increment the player position
            if (nextPlayerPosition >= scene.currentPlayers.numberPlayers() - 1 || nextPlayerPosition === -1) {
                nextPlayerPosition = 0;
            } else {
                nextPlayerPosition++;
            }
        }


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
      * END STATE FOR GAME
      * play hand
      * check if player is out if yes
      * remove player from players
      * set player rank and display to board for everyone
      * check if other players still left if no --> 
      * send message that game is over and player is asshole 
      * 
      * 
      */
    handlePlayerOut(scene: Game, currentPlayer: Player): void {
        //player still in game
        if (!this.isPlayerOut(scene, currentPlayer)) return;
        //player out - don't remove from game but mark as out and update UI

        //all players out except 1 - Game over
        if (this.currentPlayers.length === 1) {
            //GAME OVER - TODO - display message and change scene
            alert("game over!")
        }
    }

    /**
     * Checks if player is out of game 
     * @param scene 
     * @param currentPlayer 
     * @returns - true if player is out of game
     */
    isPlayerOut(scene: Game, currentPlayer: Player): boolean {

        if (!currentPlayer.inGame) return true

        //check if player has no cards left
        if (currentPlayer.cardHand.length === 0) {
            currentPlayer.inGame = false;
            return true;
        }

        //player still in game
        return false

    }

    /**
 * Clear cards played
 * @param scene 
 */
    async clearCards(scene: Game): Promise<void> {

        //delay by 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));

        const allPlayedCards = utils.getAllPlayedCards(scene.currentPlayedCards)

        allPlayedCards.forEach(card => {
            scene.InteractiveHandler.moveCard(scene, utils.findSprite(scene, card))
        })

        scene.currentPlayedCards.forEach(hand => hand.clearDeck())
    }

    /**
         * Resets game state for new game with same players
         * @param scene 
         */
    resetGame(scene: Game): void {

        //clear players cards
        this.currentPlayers.forEach(player => player.cardHand = [])

        //clear cards played
        this.clearCards(scene);

        //clear deck
        scene.deck.cards = [];

        //reset state
        //this.changeGameState(gameStateEnum.Ready);


    }

}