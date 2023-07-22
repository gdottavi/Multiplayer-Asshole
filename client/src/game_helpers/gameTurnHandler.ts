import Game from "../scenes/game";
import { Player } from "../model/player";
import { themeColors} from "./gameUIHandler";
import { Card } from "../model/card";
import { Players } from "../model/players";
import { createToast, getAllPlayedCards, findSprite, setInactiveText, setActiveText } from "../utils/utils";


const four = '4', two = '2';

/**
 * Handles all turn changes, clearing and end game scenarios
 */
export default class GameTurnHandler {
    isMyTurn: boolean;
    currentTurnPlayer: Player;  //current player up to play
    lastTurnPlayer: Player;  //last player who played cards
    currentPlayers: Players;
    shouldClear: boolean;
    lastHandCleared: boolean;
    scene: Game;

    constructor(scene: Game) {
        this.isMyTurn = false;
        this.currentTurnPlayer = scene.currentPlayers.players[0];
        this.lastTurnPlayer = scene.currentPlayers.players[0];
        this.currentPlayers = scene.currentPlayers;
        this.shouldClear = false;
        this.lastHandCleared = false;  //used to track if last hand played cleared the middle
        this.scene = scene;

        //set president to be up first
        this.setTurn(this.currentPlayers.players[0]);
    }

    /**
 * Advances turn to next player and stores last player who played cards. 
 * @param scene 
 * @param currentPlayer - current player who just played cards and will become last player
 * @param nextPlayer - player to set as current player
 * @param shouldClear - indicates cards should be cleared from middle.  should be false for a pass
 * @param pass - indicates the last player did not play and passed turn.  Default is false.
 */
    async changeTurn(scene: Game, currentPlayer: Player, nextPlayer: Player, shouldClear?: boolean, pass: boolean = false): Promise<void> {

        //set if cards should be cleared for clients who did not play the cards
        if (currentPlayer.socketId !== scene.socket.id) {
            this.shouldClear = shouldClear;
        }

        //current --> last and next --> current
        //set the player who just played to last, unless they passed turn
        if (!pass) this.lastTurnPlayer = currentPlayer
        //set the calculated next player as current
        this.setTurn(nextPlayer);
        //update player name colors to indicate turn
        await scene.GameUIHandler.updatePlayerNameColor(scene, nextPlayer, themeColors.yellow);
        if (currentPlayer.inGame && currentPlayer.socketId !== nextPlayer.socketId) await scene.GameUIHandler.updatePlayerNameColor(scene, currentPlayer, themeColors.cyan);

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
    getNextPlayerInGame(startIndex: number): Player | undefined {

        const endIndex = startIndex - 1;
        let currentIndex = startIndex;

        while (currentIndex !== endIndex) {

            currentIndex++;

            if (currentIndex >= this.currentPlayers.numberPlayers()) {
                currentIndex = 0
            }

            const player = this.currentPlayers.players[currentIndex];
            if (player.inGame) return player;

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
        let currentPlayerPosition = this.currentPlayers.getPlayerIndex(this.currentTurnPlayer)

        //if player is out of game keep advancing to next that would be in
        if (!nextTurnPlayer.inGame) {
            nextTurnPlayer = this.getNextPlayerInGame(currentPlayerPosition)
        }

        //if passing just get next player in game
        if (cardsPlayed === null && pass === true) {
            return this.getNextPlayerInGame(currentPlayerPosition)
        }

        //do not advance turn on a 2 played
        if (cardsPlayed[0]?.value == two) return nextTurnPlayer;

        //sanity check
        if (this.currentPlayers.numberPlayers() < 2) return nextTurnPlayer

        //get the next player in the game
        nextTurnPlayer = this.getNextPlayerInGame(currentPlayerPosition)


        //if card(s) played matched last card(s) skip player
        if (this.checkSkip(cardsPlayed)) {
            let nextPlayerPosition = this.currentPlayers.getPlayerIndex(nextTurnPlayer); 
            nextTurnPlayer = this.getNextPlayerInGame(nextPlayerPosition)
        }

         return nextTurnPlayer;
    }

    /**
     * Checks if cards played will skip next player
     * @param cardsPlayed - cards played
     * @returns true if player should be skipped false otherwise
     */
    checkSkip(cardsPlayed: Card[]): boolean{

        //Skips do not apply to non-single plays
        if (cardsPlayed.length > 1) return false;

        //Only skip on singles played on singles
        if (this.scene.DeckHandler.getLastPlayedHand(this.scene.currentPlayedCards)?.length !== cardsPlayed?.length) return false

        //values must match
        if (cardsPlayed[0]?.value !== this.scene.DeckHandler.getLastPlayedHand(this.scene.currentPlayedCards)[0]?.value) return false

        //skip
        return true

    }


    /**
     * Sets the current turn player to calculated next player for all clients through socket.io call
     * @param nextPlayer - next player up to now set as current player
     */
    setTurn(nextPlayer: Player): void {

        this.currentTurnPlayer = nextPlayer;

        //determine if current player is this client 
        if (this.currentTurnPlayer.socketId === this.scene.socket.id) {
            this.isMyTurn = true;
            setActiveText(this.scene.passText);
        }
        else {
            this.isMyTurn = false;
            setInactiveText(this.scene.passText);
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
        if (prevPlayer === null) return false;

        //play has returned to original player and not immediately following a clear
        if ((prevPlayer?.socketId === currentPlayer?.socketId) && !this.lastHandCleared) return true;

        //default 
        return false;

    }


    /**
     * Handles a single player being out of game and end scenario for game (1 player left)
     */
    async handlePlayerOut(scene: Game, currentPlayer: Player): Promise<void> {

        //player still in game
        if (currentPlayer.inGame) return Promise.resolve();

        //player out - don't remove from game but update UI. 
        await this.scene.GameUIHandler.updatePlayerNameColor(this.scene, currentPlayer, themeColors.inactiveGray);

        //all players out except 1 - Game over
        if (this.scene.currentPlayers.countPlayersInGame() < 2) {
            createToast(this.scene, "GAME OVER", 10000);
            this.resetGame();
        }

        return Promise.resolve();
    }


    /**
 * Clear cards played
 * @param scene 
 */
    async clearCards(scene: Game): Promise<void> {

        //delay by 1 second
        await new Promise(resolve => setTimeout(resolve, 1000));

        const allPlayedCards = getAllPlayedCards(scene.currentPlayedCards)

        allPlayedCards.forEach(card => {
            scene.InteractiveHandler.moveCard(scene, findSprite(scene, card))
        })

        scene.currentPlayedCards.forEach(hand => hand.clearDeck())
    }

    /**
         * Resets game state for new game with same players
         * @param scene 
         */
    resetGame(): void {

        //clear players cards
        this.currentPlayers.clearHands(); 

        //clear cards played
        this.clearCards(this.scene);

        //clear deck
        this.scene.deck.clearDeck();

        //reset state
        //this.changeGameState(gameStateEnum.Ready);
    }

}