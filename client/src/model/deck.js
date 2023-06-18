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
    removeCard(cardToRemove) {
        return;
    }
    /**
     * Add card to the deck
     * @param cardToAdd - card to add to the deck
     */
    addCard(cardToAdd) {
        this.cards.push(cardToAdd);
    }
    /**
     * randomly shuffle deck
     */
    shuffleDeck() {
        Phaser.Utils.Array.Shuffle(this.cards);
    }
}
//# sourceMappingURL=deck.js.map