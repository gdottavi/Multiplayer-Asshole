"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("../model/card");
/**
 * Handles dealing cards to start game
 */
class DeckHandler {
    constructor(scene) {
        /**
    * Creates deck, shuffles deck, deals deck and displays initial card hands on board.
    */
        this.dealCards = (socketId) => {
            this.createDeck();
            this.shuffleDeck();
            this.createHands();
            this.displayCards(socketId);
        };
        //create deck
        this.createDeck = () => {
            for (let suiteCounter = 0; suiteCounter < 4; suiteCounter++) {
                for (let rankCounter = 0; rankCounter < 13; rankCounter++) {
                    let card = new card_1.Card(card_1.suites[suiteCounter], card_1.ranks[rankCounter]);
                    scene.deck.cards.push(card);
                }
            }
        };
        //shuffle deck - TODO
        this.shuffleDeck = () => {
        };
        this.createHands = () => {
            let playerIndex = 0;
            for (let i = 0; i < 52; i++) {
                let card = scene.deck.cards[i];
                scene.players[playerIndex].cardHand.push(card);
                if (playerIndex < scene.players.length - 1) {
                    playerIndex++;
                }
                else {
                    playerIndex = 0;
                }
            }
        };
        /**
         * Display all cards in player hands currently. Opponent cards display as back.  Own cards display as front.
         */
        this.displayCards = (socketId) => {
            let opponentPos = 0;
            scene.players.forEach(player => {
                if (scene.socket.id !== player.socketId) {
                    opponentPos++;
                }
                ;
                for (let i = 0; i < player.cardHand.length; i++) {
                    //current player
                    if (scene.socket.id === player.socketId) {
                        this.renderCard(100 + (i * 100), 650, 0.15, player.cardHand[i].FrontImageSprite, true);
                    }
                    else {
                        this.renderCard(100 + (i * 25), 10 + (opponentPos * 80), 0.075, player.cardHand[i].BackImageSprite, false);
                    }
                }
            });
        };
        /**
         * TODO
         */
        this.resetDeck = () => {
        };
        /**
         * Displays card at specified location
         */
        this.renderCard = (x, y, scale, image_key, draggable) => {
            let card = scene.add.image(x, y, image_key).setScale(scale).setInteractive();
            if (draggable)
                scene.input.setDraggable(card);
        };
    }
}
exports.default = DeckHandler;
//# sourceMappingURL=deckHandler.js.map