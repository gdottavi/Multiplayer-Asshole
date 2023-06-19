"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deck_1 = require("../model/deck");
const cardSprite_1 = __importDefault(require("../model/cardSprite"));
class GameHandler {
    constructor(scene) {
        this.gameState = "Initializing" /* gameState.Initializing */;
        this.isMyTurn = false;
        this.currentTurnPlayer = scene.currentPlayers.players[0];
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        };
    }
    /**
     * Advances turn to next eligible player
     * @param scene
     */
    changeTurn(scene, cardPlayed) {
        //do not advance turn on a 2 played
        if (cardPlayed.value == '2')
            return;
        let nextPlayerPos = 0;
        //find index of current player in active players
        let currentPlayerPosition = scene.currentPlayers.players.findIndex(p => p.getId() === this.currentTurnPlayer.getId());
        //set back to first player if at end
        if (currentPlayerPosition >= (scene.currentPlayers.numberPlayers() - 1) || currentPlayerPosition == -1) {
            currentPlayerPosition = 0;
        }
        else
            currentPlayerPosition++;
        this.currentTurnPlayer = scene.currentPlayers.players[currentPlayerPosition];
        this.setMyTurn(scene);
    }
    /**
     *
     * @param socketId
     * @param scene
     * @param cardPlayed
     */
    playCard(socketId, scene, cardPlayed) {
        this.lastPlayedHand = new deck_1.Deck();
        if (socketId !== scene.socket.id) {
            //find which player played the card and remove from their hand
            let player = scene.currentPlayers.getPlayerById(socketId);
            player.removeCard(cardPlayed);
            //find sprite associated with the card played and remove it
            this.removeSprite(scene, cardPlayed);
            //show card played in middle for everyone
            console.log(scene.currentPlayedCards.getNumberCards());
            scene.DeckHandler.renderCard(scene, cardPlayed, ((scene.dropZone.x - 350) + (scene.currentPlayedCards.getNumberCards() * 50)), (scene.dropZone.y), 0.15, cardPlayed.FrontImageSprite, false);
        }
        //add cards to all cards played
        scene.currentPlayedCards.addCard(cardPlayed);
        //add card to last hand to beat unless a 4
        if (cardPlayed.value !== '4') {
            this.lastPlayedHand.addCard(cardPlayed);
        }
        //clear cards when a 2 is played
        if (cardPlayed.value === '2') {
            this.clearCards(scene);
        }
    }
    /**
     * sets currently client turn
     * @param scene
     */
    setMyTurn(scene) {
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
    canPlay(cardPlayed) {
        //first card played
        if (this.lastPlayedHand == null || this.lastPlayedHand.getNumberCards() === 0) {
            return true;
        }
        //check if card value is higher than last card played
        if (cardPlayed.rank < this.lastPlayedHand.cards[0].rank) {
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
    clearCards(scene) {
        console.log('clear cards', scene.currentPlayedCards.cards);
        scene.currentPlayedCards.cards.forEach(card => {
            console.log("card to remove", card);
            this.removeSprite(scene, card);
        });
        scene.currentPlayedCards.clearDeck();
    }
    /**
     * Find and remove sprite associated with a given card
     * @param scene
     * @param card
     */
    removeSprite(scene, card) {
        let spriteToDestroy = scene.children.list.find(obj => {
            var _a;
            if (obj instanceof cardSprite_1.default) {
                return ((_a = obj === null || obj === void 0 ? void 0 : obj.card) === null || _a === void 0 ? void 0 : _a.key) === card.key;
            }
        });
        //TODO move sprint off of page instead of just deleting
        spriteToDestroy.destroy(true);
    }
}
exports.default = GameHandler;
//# sourceMappingURL=gameHandler.js.map