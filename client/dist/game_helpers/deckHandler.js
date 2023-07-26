var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Card, testingSuite, testingValues } from "../model/card";
import CardSprite, { cardHeight, cardWidth } from "../model/cardSprite";
import { Player } from "../model/player";
import { currPlayerXPos, opponentStartXPos, themeColors } from "./gameUIHandler";
import { removeSprite, setActiveText, setInactiveText } from "../utils/utils";
const four = '4', two = '2';
const currPlayerCardOffset = 10;
const opponentCardOffset = 10;
const currPlayerCardYPosOffset = 25;
const currPlayerCardOverlapPercentage = 0.4;
/**
 * Handles deck operations such as dealing and displaying cards
 */
export default class DeckHandler {
    constructor(scene) {
        this.scene = scene;
    }
    /**
     * main entry point for dealing.  creates, shuffles and deals
     */
    dealCards() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createDeck();
            yield this.shuffleDeck();
            this.createHands();
        });
    }
    /**
     * Creates the initial deck - TODO: change to real suites, not testing suites.
     */
    createDeck() {
        return new Promise((resolve) => {
            testingSuite.forEach((suite) => {
                testingValues.forEach((value) => {
                    let card = new Card(suite, value);
                    this.scene.deck.addCard(card);
                });
            });
            resolve();
        });
    }
    /**
     * Shuffles the deck.
     */
    shuffleDeck() {
        return new Promise((resolve) => {
            this.scene.deck.shuffleDeck();
            resolve();
        });
    }
    /**
     * deals deck to all players in game
     */
    createHands() {
        let playerIndex = 0;
        for (let i = 0; i < this.scene.deck.cards.length; i++) {
            let card = this.scene.deck.cards[i];
            this.scene.currentPlayers.players[playerIndex].addCard(card);
            if (playerIndex < this.scene.currentPlayers.numberPlayers() - 1) {
                playerIndex++;
            }
            else {
                playerIndex = 0;
            }
        }
    }
    /**
     * main tag to update on all clients after dealing is complete
     * @param players - list of serialized players in game
     */
    updateAfterDeal(players) {
        const deserializedPlayers = players.map(playerData => Player.deserialize(playerData));
        this.scene.currentPlayers.setPlayers(deserializedPlayers);
        this.displayCards();
        setInactiveText(this.scene.dealText);
        setActiveText(this.scene.sortCardsText);
        this.scene.GameUIHandler.updatePlayerNameColor(this.scene, this.scene.GameTurnHandler.currentTurnPlayer, themeColors.yellow);
    }
    /**
     * Adds cards to a specified players hand.
     * @param playerToUpdate player to update hand for
     * @param cardsToAdd cards to add to player hand
     */
    updateAfterCardAdd(playerToUpdate, cardsToAdd) {
        let player = this.scene.currentPlayers.getPlayerById(playerToUpdate.socketId);
        cardsToAdd.forEach(card => player.addCard(card));
        this.displayCards();
    }
    /**
     * Display all cards in player hands currently. Opponent cards display as back.  Own cards display as front.
     */
    displayCards() {
        let opponentXPos = 0;
        let opponentYPos = 0;
        this.scene.currentPlayers.players.forEach(player => {
            let numberCards = player.getNumberCardsInHand();
            let scale = this.getThisPlayerCardsScale(numberCards);
            for (let i = 0; i < numberCards; i++) {
                let currentCard = player.cardHand.cards[i];
                //current player
                if (this.scene.socket.id === player.socketId) {
                    this.displayThisPlayerCard(i, currentCard, scale);
                }
                //other players
                else
                    this.displayOpponentCard(i, opponentXPos, opponentYPos, currentCard);
            }
            //increment player position 
            if (this.scene.socket.id !== player.socketId) {
                opponentXPos++;
                if (opponentXPos > 4) {
                    opponentYPos++;
                }
            }
            ;
        });
    }
    /**
     * Display a single opponent card
     * @param i - card pos
     * @param opponentXPos - x pos
     * @param opponentYPos - y pos
     * @param currentCard - card to display
     */
    displayOpponentCard(i, opponentXPos, opponentYPos, currentCard) {
        this.renderCard(currentCard, opponentStartXPos + (i * opponentCardOffset) + (opponentXPos * 250), 100 + (opponentYPos * 150), 0.065, currentCard.backImageSprite, false);
    }
    /**
     * Clears display of hand and displays for current player
     * @param cardHand - card hand to display for current player
     */
    redisplayHand(cardHand) {
        let numberCards = cardHand.getNumberCards();
        let scale = this.getThisPlayerCardsScale(numberCards);
        for (let i = 0; i < numberCards; i++) {
            let currentCard = cardHand.cards[i];
            removeSprite(this.scene, currentCard);
            this.displayThisPlayerCard(i, currentCard, scale);
        }
    }
    /**
     * displays a single card for currnt player
     * @param i - card position in hand
     * @param currentCard - card to display
     * @param scale - scale factor for image
     */
    displayThisPlayerCard(i, currentCard, scale) {
        const totalCardWidth = cardWidth * scale;
        // Calculate the overlap between cards based on a fixed percentage (adjust as needed)
        const overlapOffset = totalCardWidth * currPlayerCardOverlapPercentage;
        const xPos = (currPlayerXPos + 25) + i * (totalCardWidth - overlapOffset);
        //calculate Y position based on scale of cards
        const scaledCardHeight = scale * cardHeight;
        const yPos = this.scene.GameUIHandler.getCurrPlayerYPos() + currPlayerCardYPosOffset + scaledCardHeight / 2;
        this.renderCard(currentCard, xPos, yPos, scale, currentCard.frontImageSprite, true);
    }
    getThisPlayerCardsScale(numberCards) {
        const visibleWidth = this.scene.cameras.main.worldView.width;
        const maxScale = .1;
        // Calculate the total width of all cards including spacing and overlap
        const totalCardWidthWithSpacingAndOverlap = (cardWidth + currPlayerCardOffset) * numberCards - currPlayerCardOffset;
        const overlapOffset = totalCardWidthWithSpacingAndOverlap * currPlayerCardOverlapPercentage;
        const totalCardsWidthWithSpacing = totalCardWidthWithSpacingAndOverlap - overlapOffset;
        // Calculate the scale required to fit all the cards within the visible screen width
        let updatedScale = (visibleWidth - currPlayerXPos) / totalCardsWidthWithSpacing;
        // Clamp the scale to the maximum value
        updatedScale = Math.min(updatedScale, maxScale);
        return updatedScale;
    }
    /**
     * Displays card at specified location
     */
    renderCard(card, x, y, scale, image_key, interactive) {
        let cardSprite = new CardSprite(this.scene, card, x, y, image_key, scale).setScale(scale);
        this.scene.children.bringToTop(cardSprite);
        if (interactive)
            cardSprite.setInteractive();
    }
    /**
    * Returns the last hand played in a deck array
    */
    getLastPlayedHand(currentPlayedCards) {
        if (currentPlayedCards.length === 0)
            return null;
        let lastPlayedHand = currentPlayedCards[currentPlayedCards.length - 1].cards;
        if (lastPlayedHand.length === 0)
            return null;
        //Do not count 4's as last hand played
        if (lastPlayedHand[0].value === four) {
            if (currentPlayedCards.length === 1) {
                return null;
            }
            else {
                lastPlayedHand = currentPlayedCards[currentPlayedCards.length - 2].cards;
            }
        }
        return lastPlayedHand;
    }
}
//# sourceMappingURL=deckHandler.js.map