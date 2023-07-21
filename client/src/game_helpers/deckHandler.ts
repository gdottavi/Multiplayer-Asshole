import Game from "../scenes/game";
import { Card, suites, testingSuite, values } from "../model/card";
import CardSprite, { cardWidth } from "../model/cardSprite";
import { Deck } from "../model/deck";
import { Player } from "../model/player";
import { currPlayerXPos, currPlayerYPos, opponentStartXPos, themeColors } from "./gameUIHandler";
import { convertColorHexToNum, removeSprite, setActiveText, setInactiveText } from "../utils/utils";

const four = '4', two = '2';
const currPlayerCardOffset = 10;
const opponentCardOffset = 10;
const currPlayerCardYPos = 75;
const currPlayerCardOverlapPercentage = 0.4;


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
            suites.forEach((suite) => {
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
    updateAfterDeal(players: any[]) {
        const deserializedPlayers = players.map(playerData => Player.deserialize(playerData));
        this.scene.currentPlayers.setPlayers(deserializedPlayers);
        console.log(this.scene.currentPlayers)
        this.displayCards()
        setInactiveText(this.scene.dealText)
        setActiveText(this.scene.sortCardsText)
        this.scene.GameUIHandler.updatePlayerNameColor(this.scene, this.scene.GameTurnHandler.currentTurnPlayer, themeColors.yellow)
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
                    this.displayThisPlayerCard(i, currentCard, scale)
                }
                //other players
                else this.displayOpponentCard(i, opponentXPos, opponentYPos, currentCard)
            }
            //increment player position 
            if (this.scene.socket.id !== player.socketId) {
                opponentXPos++
                if (opponentXPos > 4) {
                    opponentYPos++;
                }
            };
        })
    }

    /**
     * Display a single opponent card
     * @param i - card pos
     * @param opponentXPos - x pos 
     * @param opponentYPos - y pos
     * @param currentCard - card to display
     */
    displayOpponentCard(i: number, opponentXPos: number, opponentYPos: number, currentCard: Card) {
        this.renderCard(
            currentCard,
            opponentStartXPos + (i * opponentCardOffset) + (opponentXPos * 250),
            100 + (opponentYPos * 150),
            0.065,
            currentCard.backImageSprite,
            false
        );

    }

    /**
     * Clears display of hand and displays for current player
     * @param cardHand - card hand to display for current player
     */
    redisplayHand(cardHand: Deck) {

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
    displayThisPlayerCard(i: number, currentCard: Card, scale: number) {

        const totalCardWidth = cardWidth * scale;

        // Calculate the overlap between cards based on a fixed percentage (adjust as needed)
        const overlapOffset = totalCardWidth * currPlayerCardOverlapPercentage;
    
        const xPos = currPlayerXPos + i * (totalCardWidth - overlapOffset);
        const yPos = this.scene.GameUIHandler.getCurrPlayerYPos() + currPlayerCardYPos;
    
        this.renderCard(
            currentCard,
            xPos,
            yPos, 
            scale,
            currentCard.frontImageSprite,
            true
        )

    }

    getThisPlayerCardsScale(numberCards: number): number {
        const visibleWidth = this.scene.cameras.main.worldView.width;

        // Calculate the total width of all cards including spacing and overlap
        const totalCardWidthWithSpacingAndOverlap = (cardWidth + currPlayerCardOffset) * numberCards - currPlayerCardOffset;
        const overlapOffset = totalCardWidthWithSpacingAndOverlap * currPlayerCardOverlapPercentage;
        const totalCardsWidthWithSpacing = totalCardWidthWithSpacingAndOverlap - overlapOffset;
    
        // Calculate the scale required to fit all the cards within the visible screen width
        const updatedScale = (visibleWidth - currPlayerXPos) / totalCardsWidthWithSpacing;
    
        return updatedScale;

    }

    /**
     * Displays card at specified location
     */
    renderCard(card: Card, x: number, y: number, scale: number, image_key: string, interactive: boolean) {
        let cardSprite = new CardSprite(this.scene, card, x, y, image_key, scale).setScale(scale);
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

