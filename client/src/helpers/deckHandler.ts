import Game from "../scenes/game";
import { Card, suites, values } from "../model/card";
import { Socket } from "socket.io-client";
import CardSprite from "../model/cardSprite";

/**
 * Handles dealing cards to start game
 */
export default class DeckHandler {


    dealCards: (socketId: string) => void;
    dealDeck: () => void;
    renderCard: (scene: Phaser.Scene,card: Card, x: number, y: number, scale: number, image_key: string, draggable?: boolean) => void;
    resetDeck: () => void;

    private createHands: () => void;
    private createDeck: () => void;
    private shuffleDeck: () => void;
    private displayCards: (socketId: string) => void;


    constructor(scene: Game) {

        /**
    * Creates deck, shuffles deck, deals deck and displays initial card hands on board. 
    */
        this.dealCards = (socketId) => {
            this.createDeck();
            this.shuffleDeck();
            this.createHands();
            this.displayCards(socketId);
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
            console.log("before shuffle: ",scene.deck);
            scene.deck.shuffleDeck(); 
            //Phaser.Utils.Array.Shuffle(scene.deck);
            console.log("after shuffle", scene.deck);
        }


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
        }



        /**
         * Display all cards in player hands currently. Opponent cards display as back.  Own cards display as front. 
         */
        this.displayCards = () => {
            let opponentPos = 0;
            scene.players.forEach(player => {

                if (scene.socket.id !== player.socketId) { opponentPos++ };

                for (let i = 0; i < player.cardHand.length; i++) {
                    let currentCard = player.cardHand[i]; 
                    //current player
                    if (scene.socket.id === player.socketId) {
                        this.renderCard(scene,currentCard, 100 + (i * 100), 650, 0.15, currentCard.FrontImageSprite, true)
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
        this.renderCard = (scene,card, x, y, scale, image_key, draggable) => {
            let cardSprite = new CardSprite(scene, card, x, y, image_key).setScale(scale).setInteractive(); 
            if(draggable) scene.input.setDraggable(cardSprite); 
        }

    }


}

