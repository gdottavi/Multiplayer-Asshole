"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("../model/player");
const gameUIHandler_1 = require("./gameUIHandler");
const utils_1 = require("../utils/utils");
const four = '4', two = '2';
/**
 * Handles all turn changes, clearing and end game scenarios
 */
class GameTurnHandler {
    constructor(scene) {
        this.isMyTurn = false;
        this.currentTurnPlayer = scene.currentPlayers.players[0];
        this.lastTurnPlayer = scene.currentPlayers.players[0];
        this.currentPlayers = scene.currentPlayers;
        this.shouldClear = false;
        this.lastHandCleared = false; //used to track if last hand played cleared the middle
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
    changeTurn(scene, currentPlayer, nextPlayer, shouldClear, pass = false) {
        return __awaiter(this, void 0, void 0, function* () {
            //set if cards should be cleared for clients who did not play the cards
            if (currentPlayer.socketId !== scene.socket.id) {
                this.shouldClear = shouldClear;
            }
            //current --> last and next --> current
            //set the player who just played to last, unless they passed turn
            if (!pass)
                this.lastTurnPlayer = currentPlayer;
            //set the calculated next player as current
            this.setTurn(nextPlayer);
            //update player name colors to indicate turn
            scene.GameUIHandler.updatePlayerNameColor(scene, nextPlayer, gameUIHandler_1.themeColors.yellow);
            if (currentPlayer.inGame && currentPlayer.socketId !== nextPlayer.socketId)
                scene.GameUIHandler.updatePlayerNameColor(scene, currentPlayer, gameUIHandler_1.themeColors.cyan);
            //check if cards should be cleared after changing turn
            if (this.checkClear(this.lastTurnPlayer, nextPlayer)) {
                this.lastHandCleared = true;
                yield this.clearCards(scene);
                this.shouldClear = false;
            }
            else {
                //cards not cleared and turn advanced
                this.lastHandCleared = false;
            }
            return Promise.resolve();
        });
    }
    /**
     * Finds the next player still in the game
     * @param startIndex - player position to start looking at
     * @returns - next player in game
     */
    getNextPlayerInGame(startIndex) {
        const endIndex = startIndex - 1;
        let currentIndex = startIndex;
        while (currentIndex !== endIndex) {
            currentIndex++;
            if (currentIndex >= this.currentPlayers.numberPlayers()) {
                currentIndex = 0;
            }
            const player = this.currentPlayers.players[currentIndex];
            if (player.inGame)
                return player;
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
    getNextTurnPlayer(scene, cardsPlayed, pass) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let nextTurnPlayer = this.currentTurnPlayer;
            //find current player in active players
            let currentPlayerPosition = this.currentPlayers.getPlayerIndex(this.currentTurnPlayer);
            //if player is out of game keep advancing to next that would be in
            if (!nextTurnPlayer.inGame) {
                nextTurnPlayer = this.getNextPlayerInGame(currentPlayerPosition);
            }
            //if passing just get next player in game
            if (cardsPlayed === null && pass === true) {
                return this.getNextPlayerInGame(currentPlayerPosition);
            }
            //do not advance turn on a 2 played
            if (((_a = cardsPlayed[0]) === null || _a === void 0 ? void 0 : _a.value) == two)
                return nextTurnPlayer;
            //sanity check
            if (this.currentPlayers.numberPlayers() < 2)
                return nextTurnPlayer;
            //get the next player in the game
            nextTurnPlayer = this.getNextPlayerInGame(currentPlayerPosition);
            //if card(s) played matched last card(s) skip player
            if (this.checkSkip(cardsPlayed)) {
                let nextPlayerPosition = this.currentPlayers.getPlayerIndex(nextTurnPlayer);
                nextTurnPlayer = this.getNextPlayerInGame(nextPlayerPosition);
            }
            return nextTurnPlayer;
        });
    }
    /**
     * Checks if cards played will skip next player
     * @param cardsPlayed - cards played
     * @returns true if player should be skipped false otherwise
     */
    checkSkip(cardsPlayed) {
        var _a, _b, _c;
        //Skips do not apply to non-single plays
        if (cardsPlayed.length > 1)
            return false;
        //Only skip on singles played on singles
        if (((_a = this.scene.DeckHandler.getLastPlayedHand(this.scene.currentPlayedCards)) === null || _a === void 0 ? void 0 : _a.length) !== (cardsPlayed === null || cardsPlayed === void 0 ? void 0 : cardsPlayed.length))
            return false;
        //values must match
        if (((_b = cardsPlayed[0]) === null || _b === void 0 ? void 0 : _b.value) !== ((_c = this.scene.DeckHandler.getLastPlayedHand(this.scene.currentPlayedCards)[0]) === null || _c === void 0 ? void 0 : _c.value))
            return false;
        //skip
        return true;
    }
    /**
     * Sets the current turn player to calculated next player for all clients through socket.io call
     * @param nextPlayer - next player up to now set as current player
     */
    setTurn(nextPlayer) {
        this.currentTurnPlayer = nextPlayer;
        //determine if current player is this client 
        if (this.currentTurnPlayer.socketId === this.scene.socket.id) {
            this.isMyTurn = true;
            (0, utils_1.setActiveText)(this.scene.passText);
        }
        else {
            this.isMyTurn = false;
            (0, utils_1.setInactiveText)(this.scene.passText);
        }
    }
    /**
      * Determines if cards in middle should be cleared after a play
      * @returns true if cards should be cleared
      */
    checkClear(prevPlayer, currentPlayer) {
        //cards played which would clear - 2, 4 of a kind, complete square
        if (this.shouldClear)
            return true;
        //first play no one to compare to
        if (prevPlayer === null)
            return false;
        //play has returned to original player and not immediately following a clear
        if (((prevPlayer === null || prevPlayer === void 0 ? void 0 : prevPlayer.socketId) === (currentPlayer === null || currentPlayer === void 0 ? void 0 : currentPlayer.socketId)) && !this.lastHandCleared)
            return true;
        //default 
        return false;
    }
    /**
     * Handles a single player being out of game and end scenario for game (1 player left)
     */
    handlePlayerOut(scene, currentPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            let player = this.scene.currentPlayers.getPlayerById(currentPlayer.socketId);
            //player still in game
            if (player.inGame)
                return Promise.resolve();
            //player out - don't remove from game but update UI. 
            this.scene.GameUIHandler.updatePlayerNameColor(this.scene, player, gameUIHandler_1.themeColors.inactiveGray);
            this.setNextGameRank(player);
            (0, utils_1.createToast)(this.scene, `${player.getDisplayName()} is out and will be ${(0, player_1.getDisplayRank)(player.nextGameRank, this.scene.currentPlayers.numberPlayers())}`);
            //all players out except 1 - Game over
            if (this.scene.currentPlayers.numberPlayersIn() < 2) {
                //TODO - show ranks when game is complete
                (0, utils_1.createToast)(this.scene, "GAME OVER.", 10000);
                // Delay resetGame for 3 seconds to show message
                setTimeout(() => {
                    console.log('player out reset', this.scene.currentPlayers);
                    this.scene.socket.emit('reset', this.scene.currentPlayers);
                    this.resetGame();
                }, 3000);
            }
            return Promise.resolve();
        });
    }
    /**
     * handle player attempting to end on a 2 or 4
     * @param cardsPlayed cards played
     * @param player player
     */
    handleEndTwoFour(cardsPlayed, currentPlayer) {
        return __awaiter(this, void 0, void 0, function* () {
            let player = this.scene.currentPlayers.getPlayerById(currentPlayer.socketId);
            //add the cards to the player who played them then emit to others
            if (this.scene.socket.id === player.socketId) {
                //player last play was a 2 or 4 and they are out of cards
                if (this.checkTwoFour(cardsPlayed) && player.inGame === false) {
                    const cardsToAdd = this.getThreeRandomPlayedCards();
                    player.inGame = true;
                    // cardsToAdd.forEach(card => {
                    //     player.addCard(card)
                    // }) 
                    //let other clients know about these new cards added
                    console.log('handle end 2 4', cardsToAdd);
                    this.scene.socket.emit('cardsAdded', player, cardsToAdd);
                }
            }
            return Promise.resolve();
        });
    }
    /**
     *
     * @param cardsPlayed cards played
     * @returns true if a 2 or 4 was played
     */
    checkTwoFour(cardsPlayed) {
        if (cardsPlayed.length === 1 && (cardsPlayed[0].value === two || cardsPlayed[0].value === four))
            return true;
        return false;
    }
    /**
     *
     * @returns 3 random cards from the discard pile
     */
    getThreeRandomPlayedCards() {
        //if less than 3 return empty
        if (this.scene.discardedCards.length < 3) {
            return [];
        }
        //shuffle discard pile
        Phaser.Utils.Array.Shuffle(this.scene.discardedCards);
        //remove 3 cards from discard pile
        const randomCards = this.scene.discardedCards.splice(0, 3);
        return randomCards;
    }
    /**
     * Sets player rank for next game
     * @param player - player to set next game rank for
     */
    setNextGameRank(player) {
        player.nextGameRank = this.scene.currentPlayers.numberPlayersOut() - 1;
    }
    /**
 * Clear cards played
 * @param scene
 */
    clearCards(scene) {
        return __awaiter(this, void 0, void 0, function* () {
            //delay by 1 second
            yield new Promise(resolve => setTimeout(resolve, 1000));
            const allPlayedCards = (0, utils_1.getAllPlayedCards)(scene.currentPlayedCards);
            allPlayedCards.forEach(card => {
                scene.InteractiveHandler.moveCard(scene, (0, utils_1.findSprite)(scene, card));
                scene.discardedCards.push(card);
            });
            scene.currentPlayedCards.forEach(hand => hand.clearDeck());
        });
    }
    /**
         * Resets game state for new game with same players
         * @param scene
         */
    resetGame() {
        //clear players cards and ranks
        this.currentPlayers.clearHands();
        //this.currentPlayers.clearRanks(); 
        //clear cards played
        this.scene.currentPlayedCards.forEach(hand => hand.clearDeck());
        //clear deck
        this.scene.deck.clearDeck();
        //clear discarded cards
        this.scene.discardedCards = [];
        //Go back to the lobby
        console.log("got to Lobby scene");
        this.scene.goToLobbyScene();
    }
}
exports.default = GameTurnHandler;
//# sourceMappingURL=gameTurnHandler.js.map