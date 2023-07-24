var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Deck } from "../model/deck";
import { removeSprite, createToast, getAllPlayedCards, areLastXValuesEqual, playRandomSound } from "../utils/utils";
const four = '4', two = '2';
/**
 * Handles all rule logic for game
 */
export default class GameRuleHandler {
    constructor(scene) {
        this.gameState = "Initializing" /* gameStateEnum.Initializing */;
        this.queuedCardsToPlay = new Deck();
        this.lastPlayedHand = new Deck();
        this.currentPlayedCards = scene.currentPlayedCards;
        this.scene = scene;
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        };
    }
    /**
     * Plays a single card for all opponent clients
     * @param socketId
     * @param cardsPlayed
     * @returns - currently played cards deck array. used to update other clients
     */
    playCards(socketId, cardsPlayed) {
        return __awaiter(this, void 0, void 0, function* () {
            let handPlayed = new Deck();
            this.currentPlayedCards.push(handPlayed);
            cardsPlayed.forEach(cardPlayed => {
                //add card to the hand played in the current played cards deck
                handPlayed.addCard(cardPlayed);
                //update for all clients other than current
                if (socketId !== this.scene.socket.id) {
                    //find which player played the card and remove from their hand
                    let player = this.scene.currentPlayers.getPlayerById(socketId);
                    player === null || player === void 0 ? void 0 : player.removeCard(cardPlayed);
                    //find sprite associated with the card played and remove it
                    removeSprite(this.scene, cardPlayed);
                    //show card played in middle for everyone
                    this.scene.DeckHandler.renderCard(cardPlayed, ((this.scene.dropZone.x - 350) + (this.getTotalCountCardsPlayed() * 50)), (this.scene.dropZone.y), 0.1, cardPlayed.frontImageSprite, false);
                }
            });
            return Promise.resolve();
        });
    }
    /**
     * Gets the last played hand to beat
     * @returns - last hand played that is not a 4
     */
    getLastPlayedHand() {
        if (this.currentPlayedCards.length === 0)
            return null;
        let lastPlayedHand = this.currentPlayedCards[this.currentPlayedCards.length - 1].cards;
        if (lastPlayedHand.length === 0)
            return null;
        //Do not count 4's as last hand played
        if (lastPlayedHand[0].value === four) {
            if (this.currentPlayedCards.length === 1) {
                return null;
            }
            else {
                lastPlayedHand = this.currentPlayedCards[this.currentPlayedCards.length - 2].cards;
            }
        }
        return lastPlayedHand;
    }
    /**
     * Returns total number of cards played
     * @returns
     */
    getTotalCountCardsPlayed() {
        return this.currentPlayedCards.reduce((count, hand) => count + hand.cards.length, 0);
    }
    /**
     * Main game rules. Determines if a card played is valid and beats existing cards on table
     * @param cardsPlayed
     */
    canPlay(cardsPlayed) {
        let turnHandler = this.scene.GameTurnHandler;
        //check if completing square before turn since this can be done out of turn
        if (this.checkSquareCompleted(cardsPlayed)) {
            turnHandler.shouldClear = true;
            playRandomSound(this.scene);
            return true;
        }
        //not this players turn
        if (!turnHandler.isMyTurn)
            return false;
        //check clear conditions first in order to properly set shouldClear -----------------------------------
        //four of a kind played
        if (cardsPlayed.length === 4 && cardsPlayed.every(card => card.value === cardsPlayed[0].value)) {
            turnHandler.shouldClear = true;
            return true;
        }
        //single 2 played 
        if (cardsPlayed.length === 1 && cardsPlayed[0].value === two) {
            turnHandler.shouldClear = true;
            return true;
        }
        let lastPlayedHand = this.getLastPlayedHand();
        //more than 4 cards played
        if (cardsPlayed.length > 4) {
            createToast(this.scene, "Cannot play " + cardsPlayed.length + " cards at once.");
            return false;
        }
        //multiple cards played with different values
        if (!cardsPlayed.every(card => card.value === cardsPlayed[0].value)) {
            createToast(this.scene, "Cannot play multiple cards of different values.");
            return false;
        }
        //first card played
        if (lastPlayedHand == null || lastPlayedHand.length === 0)
            return true;
        //
        //check plays based on last hand played --------------------------------------------------
        //
        //single 4 played
        if (cardsPlayed.length === 1 && cardsPlayed[0].value === four)
            return true;
        //single on double or double on triple 
        if (cardsPlayed.length < lastPlayedHand.length) {
            createToast(this.scene, "Last play was " + lastPlayedHand.length + " of a kind.  You only played " + cardsPlayed.length + " cards.");
            return false;
        }
        //single card played
        if (cardsPlayed.length === 1) {
            if (cardsPlayed[0].rank < lastPlayedHand[0].rank) {
                createToast(this.scene, "Must play doubles higher than last played double");
                return false;
            }
        }
        //doubles played
        if (cardsPlayed.length === 2) {
            if (cardsPlayed[0].value === two || cardsPlayed[0].value === four) {
                createToast(this.scene, "Cannot play multiple 2s or 4s");
                return false;
            }
            if (lastPlayedHand.length < 2)
                return true;
            if (cardsPlayed[0].rank < lastPlayedHand[0].rank) {
                createToast(this.scene, "Must play doubles higher than last played double");
                return false;
            }
        }
        //triples played
        if (cardsPlayed.length === 3) {
            if (cardsPlayed[0].value === two || cardsPlayed[0].value === four) {
                createToast(this.scene, "Cannot play multiple 2s or 4s");
                return false;
            }
            if (lastPlayedHand.length < 3)
                return true;
            if (cardsPlayed[0].rank < lastPlayedHand[0].rank) {
                createToast(this.scene, "Must play triples higher than last played triple");
                return false;
            }
        }
        //default
        return true;
    }
    /**
     * Check if square is completed 4 of same card (e.g. 4 Kings) played in a row.
     * Allowed to play out of turn.  4 of a kind single play checked elsewhere.
     * @param cardsPlayed - cards attempted to play
     * @returns
     */
    checkSquareCompleted(cardsPlayed) {
        //sanity checks
        if (cardsPlayed === null || cardsPlayed.length === 0)
            return false;
        //get the cards that have been played by all players this hand in middle.  flatMap takes the hands played and creates single array
        let playedCards = getAllPlayedCards(this.currentPlayedCards);
        //first card played
        if (playedCards == null || playedCards.length === 0)
            return false;
        //2 or 4 played
        if (cardsPlayed[0].value === two || cardsPlayed[0].value === four)
            return false;
        //4 played last hand
        let lastCardPos = playedCards.length - 1;
        if (playedCards[lastCardPos].value === four)
            return false;
        //does not match last card played
        if (playedCards[lastCardPos].value !== cardsPlayed[0].value)
            return false;
        //multiple cards played with different values - illegal move - sanity check
        if (!cardsPlayed.every(card => card.value === cardsPlayed[0].value)) {
            return false;
        }
        //3 cards played on 1 match
        if (cardsPlayed.length === 3)
            return true;
        //2 cards played on 2 matches
        if (cardsPlayed.length === 2) {
            if (!areLastXValuesEqual(playedCards, 2))
                return false;
            return true;
        }
        //1 card played on 3 matches
        if (cardsPlayed.length === 1) {
            if (!areLastXValuesEqual(playedCards, 3))
                return false;
            return true;
        }
        //default
        return false;
    }
}
//# sourceMappingURL=gameRuleHandler.js.map