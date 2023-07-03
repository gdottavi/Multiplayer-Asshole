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
    currentTurnPlayer: Player;  //current player up to play
    lastTurnPlayer: Player;  //last player who played cards
    currentPlayers: Player[];
    shouldClear: boolean;
    lastHandCleared: boolean;
    scene: Game;

    constructor(scene: Game) {
        this.isMyTurn = false;
        this.currentTurnPlayer = scene.currentPlayers.players[0];
        this.lastTurnPlayer = scene.currentPlayers.players[0]; 
        this.currentPlayers = scene.currentPlayers.players;
        this.shouldClear = false;
        this.lastHandCleared = false;  //used to track if last hand played cleared the middle
        this.scene = scene;
    }

    /**
 * Advances turn to next player and stores last player who played cards. 
 * @param scene 
 * @param currentPlayer - current player who just played cards and will become last player
 * @param nextPlayer - player to set as current player
 * @param shouldClear - indicates cards should be cleared from middle.  should be false for a pass
 * @param pass - indicates the last player did not play and passed turn.  Default is false.
 */
    async changeTurn(scene: Game, currentPlayer: Player, nextPlayer: Player, shouldClear?: boolean, pass: boolean= false): Promise<void> {

        //set if cards should be cleared for clients who did not play the cards
        if (currentPlayer.socketId !== scene.socket.id) {
            this.shouldClear = shouldClear
        }

        //current --> last and next --> current
        //set the player who just played to last, unless they passed turn
        if(!pass) this.lastTurnPlayer = currentPlayer
        //set the calculated next player as current
        this.setTurn(nextPlayer);
        scene.UIHandler.updatePlayerNameColor(scene, nextPlayer.socketId, themeColors.yellow);

        //check if cards should be cleared after changing turn
        if (this.checkClear(this.lastTurnPlayer, nextPlayer)) {
            this.lastHandCleared = true;
            await this.clearCards(scene);
            this.shouldClear = false;

        }
        else {
            //cards not cleared and turn advanced
            this.lastHandCleared = false;
        }

        return Promise.resolve(); 

    }


    /**
     * Finds the next player still in the game
     * @param startIndex - player position to start looking at
     * @returns - next player in game
     */
    getNextPlayerInGame(startIndex: number): Player|undefined {

        const endIndex = startIndex - 1;
        let currentIndex = startIndex; 

        while(currentIndex !== endIndex)
        {

            currentIndex++; 

            if(currentIndex >= this.currentPlayers.length){
                currentIndex = 0
            }

            const player = this.currentPlayers[currentIndex];
            if(player.inGame) return player;
            
        }
        return undefined; 

    }

    /**
     * Given cards played returns the next player up to play
     * @param scene 
     * @param cardsPlayed - cards played.  This should not be used with pass
     * @param pass - player passes turn without playing cards.  This should not be used with cardsPlayed
     * @returns - Player that is up next
     */
    async getNextTurnPlayer(scene: Game, cardsPlayed?: Card[], pass?: boolean): Promise<Player> {

        let nextTurnPlayer = this.currentTurnPlayer;

        //find current player in active players
        let currentPlayerPosition = this.currentPlayers.findIndex(p => p.socketId === this.currentTurnPlayer.socketId);

        //if player is out of game keep advancing to next that would be in
        if (this.isPlayerOut(nextTurnPlayer)) {
            nextTurnPlayer = this.getNextPlayerInGame(currentPlayerPosition)
        }

        //if passing just get next player in game
        if(cardsPlayed === null && pass === true){
            return this.getNextPlayerInGame(currentPlayerPosition) 
        }

        //do not advance turn on a 2 played
        if (cardsPlayed[0]?.value == two) return nextTurnPlayer;

        //sanity check
        if (this.currentPlayers.length < 2) return nextTurnPlayer

        //set back to first player if at end otherwise advance to next position
        let nextPlayerPosition = 0;
        if (currentPlayerPosition >= (scene.currentPlayers.numberPlayers() - 1) || currentPlayerPosition == -1) {
            nextPlayerPosition = 0;
        }
        else nextPlayerPosition++;


        //if card(s) played matched last card(s) skip player
        if (cardsPlayed?.length === 1 && (scene.DeckHandler.getLastPlayedHand(scene.currentPlayedCards)?.length === cardsPlayed?.length) && (cardsPlayed[0]?.value === scene.DeckHandler.getLastPlayedHand(scene.currentPlayedCards)[0]?.value)) {
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
    setTurn(nextPlayer: Player): void {

        console.log(nextPlayer); 
        this.currentTurnPlayer = nextPlayer;

        //determine if current player is this client (getting some errors here)
        if (this.currentTurnPlayer.socketId === this.scene.socket.id) {
            this.isMyTurn = true;
            this.scene.UIHandler.setActiveText(this.scene.passText); 
        }
        else {
            this.isMyTurn = false;
            this.scene.UIHandler.setInactiveText(this.scene.passText); 
        }

    }

    /**
      * Determines if cards in middle should be cleared after a play
      * @returns true if cards should be cleared
      */
    checkClear(prevPlayer: Player, currentPlayer: Player): boolean {

        //cards played which would clear - 2, 4 of a kind, complete square
        if (this.shouldClear) return true;

        //first play no one to compare to
        if(prevPlayer === null) return false; 

        //play has returned to original player and not immediately following a clear
        if ((prevPlayer?.socketId === currentPlayer?.socketId) && !this.lastHandCleared) return true;

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

    /**
     * Handles a single player being out of game and end scenario for game (1 player left)
     */
    async handlePlayerOut(currentPlayerSocketID: string): Promise<void> {

        const currentPlayer = this.scene.currentPlayers.getPlayerById(currentPlayerSocketID); 

        //player still in game
        if (!this.isPlayerOut(currentPlayer)) return Promise.resolve(); 

        //player out - don't remove from game but update UI. 
        this.scene.UIHandler.updatePlayerNameColor(this.scene, currentPlayer.socketId, themeColors.inactiveGray)

        //all players out except 1 - Game over
        if(this.scene.currentPlayers.countPlayersInGame() < 2){
            utils.createToast(this.scene, "GAME OVER", 10000);
            this.resetGame(this.scene); 
        }

        return Promise.resolve();
    }

    /**
     * Checks if player is out of game.  If player has zero cards sets as out. 
     * @param currentPlayer 
     * @returns - true if player is out of game
     */
    isPlayerOut(currentPlayer: Player): boolean {

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