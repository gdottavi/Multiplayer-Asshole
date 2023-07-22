"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const card_1 = require("../model/card");
const cardSprite_1 = __importStar(require("../model/cardSprite"));
const player_1 = require("../model/player");
const gameUIHandler_1 = require("./gameUIHandler");
const utils_1 = require("../utils/utils");
const four = '4', two = '2';
const currPlayerCardOffset = 10;
const opponentCardOffset = 10;
const currPlayerCardYPosOffset = 25;
const currPlayerCardOverlapPercentage = 0.4;
/**
 * Handles deck operations such as dealing and displaying cards
 */
class DeckHandler {
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
            card_1.suites.forEach((suite) => {
                card_1.values.forEach((value) => {
                    let card = new card_1.Card(suite, value);
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
            this.scene.currentPlayers.players[playerIndex].cardHand.addCard(card);
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
        const deserializedPlayers = players.map(playerData => player_1.Player.deserialize(playerData));
        this.scene.currentPlayers.setPlayers(deserializedPlayers);
        console.log(this.scene.currentPlayers);
        this.displayCards();
        (0, utils_1.setInactiveText)(this.scene.dealText);
        (0, utils_1.setActiveText)(this.scene.sortCardsText);
        this.scene.GameUIHandler.updatePlayerNameColor(this.scene, this.scene.GameTurnHandler.currentTurnPlayer, gameUIHandler_1.themeColors.yellow);
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
        this.renderCard(currentCard, gameUIHandler_1.opponentStartXPos + (i * opponentCardOffset) + (opponentXPos * 250), 100 + (opponentYPos * 150), 0.065, currentCard.backImageSprite, false);
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
            (0, utils_1.removeSprite)(this.scene, currentCard);
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
        const totalCardWidth = cardSprite_1.cardWidth * scale;
        // Calculate the overlap between cards based on a fixed percentage (adjust as needed)
        const overlapOffset = totalCardWidth * currPlayerCardOverlapPercentage;
        const xPos = (gameUIHandler_1.currPlayerXPos + 25) + i * (totalCardWidth - overlapOffset);
        //calculate Y position based on scale of cards
        const scaledCardHeight = scale * cardSprite_1.cardHeight;
        const yPos = this.scene.GameUIHandler.getCurrPlayerYPos() + currPlayerCardYPosOffset + scaledCardHeight / 2;
        this.renderCard(currentCard, xPos, yPos, scale, currentCard.frontImageSprite, true);
    }
    getThisPlayerCardsScale(numberCards) {
        const visibleWidth = this.scene.cameras.main.worldView.width;
        // Calculate the total width of all cards including spacing and overlap
        const totalCardWidthWithSpacingAndOverlap = (cardSprite_1.cardWidth + currPlayerCardOffset) * numberCards - currPlayerCardOffset;
        const overlapOffset = totalCardWidthWithSpacingAndOverlap * currPlayerCardOverlapPercentage;
        const totalCardsWidthWithSpacing = totalCardWidthWithSpacingAndOverlap - overlapOffset;
        // Calculate the scale required to fit all the cards within the visible screen width
        const updatedScale = (visibleWidth - gameUIHandler_1.currPlayerXPos) / totalCardsWidthWithSpacing;
        return updatedScale;
    }
    /**
     * Displays card at specified location
     */
    renderCard(card, x, y, scale, image_key, interactive) {
        let cardSprite = new cardSprite_1.default(this.scene, card, x, y, image_key, scale).setScale(scale);
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
exports.default = DeckHandler;
//# sourceMappingURL=deckHandler.js.map