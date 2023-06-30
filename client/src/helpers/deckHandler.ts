import Game from "../scenes/game";
import { Card, suites, values } from "../model/card";
import CardSprite from "../model/cardSprite";
import { Deck } from "../model/deck";

const four = '4', two = '2';

/**
 * Handles dealing cards to start game
 */
export default class DeckHandler {


    dealCards: () => void;
    dealDeck: () => void;
    renderCard: (scene: Phaser.Scene, card: Card, x: number, y: number, scale: number, image_key: string, interactive?: boolean) => void;
    createHands: () => void;
    createDeck: () => void;
    shuffleDeck: () => void;
    displayCards: () => void;


    constructor(scene: Game) {


        // Creates deck, shuffles deck, deals deck and displays initial card hands on board. 
        this.dealCards = () => {
            this.createDeck();
            this.shuffleDeck();
            this.createHands();
        }

        //create deck
        this.createDeck = () => {
            suites.forEach(suite => {
                values.forEach(value => {
                    let card = new Card(suite, value);
                    scene.deck.addCard(card);
                })
            })
        }

        //shuffle deck 
        this.shuffleDeck = () => {
            scene.deck.shuffleDeck();
        }


        //distrubute deck amongst game players
        this.createHands = () => {
            let playerIndex = 0;
            for (let i = 0; i < 52; i++) {
                let card = scene.deck.cards[i];
                scene.currentPlayers.players[playerIndex].cardHand.push(card);
                if (playerIndex < scene.currentPlayers.numberPlayers() - 1) {
                    playerIndex++;
                }
                else {
                    playerIndex = 0;
                }
            }
        }



        /**
         * Display all cards in player hands currently. Opponent cards display as back.  Own cards display as front. 
         */
        this.displayCards = () => {
            let opponentPos = 0;
            scene.currentPlayers.players.forEach(player => {

                if (scene.socket.id !== player.socketId) { opponentPos++ };

                for (let i = 0; i < player.cardHand.length; i++) {
                    let currentCard = player.cardHand[i];
                    //current player
                    if (scene.socket.id === player.socketId) {
                        this.renderCard(scene, currentCard, 100 + (i * 45), 650, 0.1, currentCard.frontImageSprite, true)
                    }
                    else {
                        this.renderCard(scene, currentCard, 100 + (i * 25), 10 + (opponentPos * 80), 0.075, currentCard.backImageSprite, false)
                    }
                }
            })
        }

        /**
         * Displays card at specified location
         */
        this.renderCard = (scene: Game, card, x, y, scale, image_key, interactive) => {
            let cardSprite = new CardSprite(scene, card, x, y, image_key).setScale(scale);

            if (interactive) cardSprite.setInteractive();

        }

    }

     /**
     * Returns the last hand played in a deck array
     */
     getLastPlayedHand(currentPlayedCards: Deck[]): Card[] | null {

        if (currentPlayedCards.length === 0) return null;

        let lastPlayedHand = currentPlayedCards[currentPlayedCards.length - 1].cards;

        if (lastPlayedHand.length === 0) return null;

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

