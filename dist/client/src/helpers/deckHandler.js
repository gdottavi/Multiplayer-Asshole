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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../model/card");
const cardSprite_1 = __importDefault(require("../model/cardSprite"));
const uiHandler_1 = require("./uiHandler");
const utils_1 = require("../utils/utils");
const four = '4', two = '2';
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
            card_1.testingSuite.forEach((suite) => {
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
        //const deserializedPlayers = players.map(playerData => Player.deserialize(playerData));
        //this.scene.currentPlayers.setPlayers(deserializedPlayers);
        this.displayCards();
        (0, utils_1.setInactiveText)(this.scene.readyText);
        (0, utils_1.setInactiveText)(this.scene.dealText);
        //this.scene.UIHandler.setPlayerNames(this.scene);
        this.scene.UIHandler.updatePlayerNameColor(this.scene, this.scene.GameTurnHandler.currentTurnPlayer, uiHandler_1.themeColors.yellow);
    }
    /**
     * Display all cards in player hands currently. Opponent cards display as back.  Own cards display as front.
     */
    displayCards() {
        let opponentPos = 0;
        this.scene.currentPlayers.players.forEach(player => {
            if (this.scene.socket.id !== player.socketId) {
                opponentPos++;
            }
            ;
            for (let i = 0; i < player.getNumberCardsInHand(); i++) {
                let currentCard = player.cardHand.cards[i];
                //current player
                if (this.scene.socket.id === player.socketId) {
                    this.renderCard(currentCard, 100 + (i * 45), 650, 0.1, currentCard.frontImageSprite, true);
                }
                else {
                    this.renderCard(currentCard, 100 + (i * 25), 10 + (opponentPos * 80), 0.075, currentCard.backImageSprite, false);
                }
            }
        });
    }
    /**
     * Clears display of hand and displays for current player
     * @param cardHand - card hand to display for current player
     */
    redisplayHand(cardHand) {
        //TODO add some animation here for mixing up cards.  Add sound.
        for (let i = 0; i < cardHand.getNumberCards(); i++) {
            let currentCard = cardHand.cards[i];
            (0, utils_1.removeSprite)(this.scene, currentCard);
            this.renderCard(currentCard, 100 + (i * 45), 650, 0.1, currentCard.frontImageSprite, true);
        }
    }
    /**
     * Displays card at specified location
     */
    renderCard(card, x, y, scale, image_key, interactive) {
        let cardSprite = new cardSprite_1.default(this.scene, card, x, y, image_key).setScale(scale);
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