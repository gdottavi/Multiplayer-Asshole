import { Card } from "./card";
export class Deck extends Array {
    constructor() {
        super();
        this.cards = [];
    }
    /**
     * Remove card from deck
     * @param cardToRemove - card to remove from the deck
     * @returns
     */
    removeCard(card) {
        let cardToRemove = this.getCard(card);
        const index = this.cards.indexOf(cardToRemove);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    }
    /**
     * Add card to the deck
     * @param cardToAdd - card to add to the deck
     */
    addCard(cardToAdd) {
        this.cards.push(cardToAdd);
    }
    /**
     * gets instance of card in this deck
     * @param card card to find
     * @returns instance of card in this deck
     */
    getCard(card) {
        const matchingCard = this.cards.find(c => c.suite === card.suite && c.value === card.value);
        return matchingCard || null;
    }
    /**
     * randomly shuffle deck
     */
    shuffleDeck() {
        Phaser.Utils.Array.Shuffle(this.cards);
    }
    /**
     * sorts deck from lowest value to highest value
     */
    sortDeck() {
        this.cards.sort((cardA, cardB) => cardA.rank - cardB.rank);
    }
    /**
     *
     * @returns number of cards in the deck
     */
    getNumberCards() {
        return this.cards.length;
    }
    /**
     * removes all cards from deck
     */
    clearDeck() {
        this.cards = [];
    }
    static serialize(deck) {
        let serializedCards = null;
        if (deck.cards && Array.isArray(deck.cards)) {
            serializedCards = deck.cards.map((card) => Card.serialize(card));
        }
        return {
            cards: serializedCards,
        };
    }
    static deserialize(serializedDeck) {
        const deck = new Deck();
        if (serializedDeck.cards && Array.isArray(serializedDeck.cards)) {
            deck.cards = serializedDeck.cards.map((serializedCard) => Card.deserialize(serializedCard));
        }
        else {
            deck.cards = []; // Handle the case when serializedDeck.cards is null or not an array
        }
        return deck;
    }
}
//# sourceMappingURL=deck.js.map