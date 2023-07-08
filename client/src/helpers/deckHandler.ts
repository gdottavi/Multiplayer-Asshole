import Game from "../scenes/game";
import { Card, suites, testingSuite, values } from "../model/card";
import CardSprite from "../model/cardSprite";
import { Deck } from "../model/deck";
import { Player } from "../model/player";
import { themeColors, setActiveText, setInactiveText } from "./uiHandler";
import Utils from "./utils";

const four = '4', two = '2';
const utils = new Utils();

/**
 * Handles deck operations such as dealing and displaying cards
 */
export default class DeckHandler {


    scene: Game; 

    constructor(scene: Game) {

        this.scene = scene; 


    }


    /**
     * main entry point for dealing.  creates, shuffles and deals
     */
    async dealCards() {
        await this.createDeck();
        await this.shuffleDeck();
        this.createHands()
    }

  
/**
 * Creates the initial deck - TODO: change to real suites, not testing suites.
 */
createDeck(): Promise<void> {
    return new Promise<void>((resolve) => {
      testingSuite.forEach((suite) => {
        values.forEach((value) => {
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
  shuffleDeck(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.scene.deck.shuffleDeck()
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
            this.scene.currentPlayers.players[playerIndex].cardHand.addCard(card)
            if (playerIndex < this.scene.currentPlayers.numberPlayers() - 1) {
                playerIndex++;
            }
            else {
                playerIndex = 0
            }
        }
    }

    /**
     * main tag to update on all clients after dealing is complete
     * @param players - list of serialized players in game
     */
    updateAfterDeal(players: any[]){
        //const deserializedPlayers = players.map(playerData => Player.deserialize(playerData));
        //this.scene.currentPlayers.setPlayers(deserializedPlayers);
        this.displayCards()
        setInactiveText(this.scene.readyText); 
        setInactiveText(this.scene.dealText)
        //this.scene.UIHandler.setPlayerNames(this.scene);
        this.scene.UIHandler.updatePlayerNameColor(this.scene, this.scene.GameTurnHandler.currentTurnPlayer, themeColors.yellow)
    }

    /**
     * Display all cards in player hands currently. Opponent cards display as back.  Own cards display as front. 
     */
    displayCards() {
        let opponentPos = 0;
        this.scene.currentPlayers.players.forEach(player => {

            if (this.scene.socket.id !== player.socketId) { opponentPos++ };

            for (let i = 0; i < player.getNumberCardsInHand(); i++) {
                let currentCard = player.cardHand.cards[i];
                //current player
                if (this.scene.socket.id === player.socketId) {
                    this.renderCard(currentCard, 100 + (i * 45), 650, 0.1, currentCard.frontImageSprite, true)
                }
                else {
                    this.renderCard(currentCard, 100 + (i * 25), 10 + (opponentPos * 80), 0.075, currentCard.backImageSprite, false)
                }
            }
        })
    }

    /**
     * Clears display of hand and displays for current player
     * @param cardHand - card hand to display for current player
     */
    redisplayHand(cardHand: Deck){

        //TODO add some animation here for mixing up cards.  Add sound.
        for(let i=0; i < cardHand.getNumberCards(); i++){
            let currentCard = cardHand.cards[i]; 
            utils.removeSprite(this.scene, currentCard); 
            this.renderCard(currentCard, 100 + (i * 45), 650, 0.1, currentCard.frontImageSprite, true)
        }
    }

    /**
     * Displays card at specified location
     */
    renderCard(card: Card, x: number, y: number, scale: number, image_key: string, interactive: boolean) {
        let cardSprite = new CardSprite(this.scene, card, x, y, image_key).setScale(scale);
        this.scene.children.bringToTop(cardSprite); 
        if (interactive) cardSprite.setInteractive();

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

