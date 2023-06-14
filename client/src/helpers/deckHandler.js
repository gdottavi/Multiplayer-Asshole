"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("./card");
/**
 * Handles dealing cards to start game
 */
class DeckHandler {
    constructor(scene) {
        /* this.dealCards = () => {
            let playerSprite: string, opponentSprite: string;

            //only show cards to current player
            if(scene.isPlayerA) {
                playerSprite = 'cyanCardFront';
                //playerSprite = 'cards';
                opponentSprite = 'magentaCardBack';
            }
            else{
                playerSprite = 'magentaCardFront';
                opponentSprite = 'cyanCardBack';
            }
            for (let i=0; i<5; i++){
                let playerCard = new Card(scene);
                scene.GameHandler.playerHand.push(playerCard.render(475+(i*100), 650, playerSprite, cardType.player));

                let opponentCard = new Card(scene);
                scene.GameHandler.opponentHand.push(opponentCard.render(475 + (i *100), 125, opponentSprite, cardType.opponent));
            }
        } */
        //create deck
        this.createDeck = () => {
            for (let suiteCounter = 0; suiteCounter < 4; suiteCounter++) {
                for (let rankCounter = 0; rankCounter < 13; rankCounter++) {
                    let card = new card_1.Card(card_1.suites[suiteCounter], card_1.ranks[rankCounter]);
                    scene.deck.cards.push(card);
                }
            }
        };
        //shuffle deck
        this.shuffleDeck = () => {
        };
        this.dealCards = () => {
            this.createDeck();
            this.shuffleDeck();
            let playerIndex = 0;
            for (let i = 0; i < 51; i++) {
                console.log(scene.deck.cards[i]);
                console.log(scene.players[playerIndex]);
                scene.players[playerIndex].cardHand.push(scene.deck.cards[i]);
                if (playerIndex < scene.GameHandler.numberPlayers - 1) {
                    playerIndex++;
                }
                else {
                    playerIndex = 0;
                }
            }
            console.log("Cards Dealt: ");
            console.log(scene.players);
        };
        this.resetDeck = () => {
            this.createDeck();
            this.shuffleDeck();
        };
    }
}
exports.default = DeckHandler;
//# sourceMappingURL=deckHandler.js.map