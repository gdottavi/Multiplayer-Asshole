import Game from "../scenes/game";
import { Card, cardType, suites, ranks } from "../model/card";
import { Socket } from "socket.io-client";

/**
 * Handles dealing cards to start game
 */
export default class DeckHandler {


    dealCards: (socketId: string) => void;
    dealDeck: () => void;
    renderCard: (x: number, y: number, scale: number, image_key: string, draggable?: boolean) => void;
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
            for (let suiteCounter = 0; suiteCounter < 4; suiteCounter++) {
                for (let rankCounter = 0; rankCounter < 13; rankCounter++) {
                    let card = new Card(suites[suiteCounter], ranks[rankCounter])
                    scene.deck.cards.push(card);
                }
            }
        }

        //shuffle deck - TODO
        this.shuffleDeck = () => {

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
        this.displayCards = (socketId) => {
            let opponentPos = 0;
            scene.players.forEach(player => {

                if (scene.socket.id !== player.socketId) { opponentPos++ };

                for (let i = 0; i < player.cardHand.length; i++) {
                    //current player
                    if (scene.socket.id === player.socketId) {
                        this.renderCard(100 + (i * 100), 650, 0.15, player.cardHand[i].FrontImageSprite, true)
                    }
                    else {
                        this.renderCard(100 + (i * 25), 10 + (opponentPos * 80), 0.075, player.cardHand[i].BackImageSprite, false)
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
        this.renderCard = (x, y, scale, image_key, draggable) => {

            let card = scene.add.image(x, y, image_key).setScale(scale).setInteractive()
            if (draggable) scene.input.setDraggable(card);
        }

    }


}

