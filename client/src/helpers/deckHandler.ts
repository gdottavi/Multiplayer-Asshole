import Game from "../scenes/game";
import { Card, suites, values } from "../model/card";
import { Socket } from "socket.io-client";
import CardSprite from "../model/cardSprite";

/**
 * Handles dealing cards to start game
 */
export default class DeckHandler {


    dealCards: () => void;
    dealDeck: () => void;
    renderCard: (scene: Phaser.Scene,card: Card, x: number, y: number, scale: number, image_key: string, interactive?: boolean) => void;
    resetDeck: () => void;

    createHands: () => void;
    createDeck: () => void;
    shuffleDeck: () => void;
    displayCards: () => void;


    constructor(scene: Game) {

        /**
    * Creates deck, shuffles deck, deals deck and displays initial card hands on board. 
    */
        this.dealCards = () => {
            this.createDeck();
            this.shuffleDeck();
            console.log(scene.deck.cards); 
            this.createHands();
            this.displayCards();
        }

        //create deck
        this.createDeck = () => {
            suites.forEach(suite => {
                values.forEach(value => {
                    let card = new Card(suite,value);
                    scene.deck.addCard(card); 
                })
            })
        }

        //shuffle deck - TODO
        this.shuffleDeck = () => {
            scene.deck.shuffleDeck(); 
        }


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
                        this.renderCard(scene,currentCard, 100 + (i * 45), 650, 0.1, currentCard.FrontImageSprite, true)
                    }
                    else {
                        this.renderCard(scene,currentCard,100 + (i * 25), 10 + (opponentPos * 80), 0.075, currentCard.BackImageSprite, false)
                    }
                }
            })
        }

        /**
         * TODO
         */
        this.resetDeck = () => {
        }

        /**
         * Displays card at specified location
         */
        this.renderCard = (scene,card, x, y, scale, image_key, interactive) => {
            let cardSprite = new CardSprite(scene, card, x, y, image_key).setScale(scale); 
            if(interactive) cardSprite.setInteractive(); 
            if(interactive) scene.input.setDraggable(cardSprite); 
            
        }

    }


}

