import { Card } from "./card";

export class Deck extends Array {
    
    cards: Card[]
  
    constructor() {
      super(); 
      this.cards = [];
    }

    /**
     * Remove card from deck
     * @param cardToRemove - card to remove from the deck
     * @returns 
     */
    removeCard(cardToRemove: Card): void {
      const index = this.cards.indexOf(cardToRemove);
      if (index !== -1) {
          this.cards.splice(index, 1);
      }
    }

    /**
     * Add card to the deck
     * @param cardToAdd - card to add to the deck
     */
    addCard(cardToAdd: Card): void {
      this.cards.push(cardToAdd); 
    }



    /**
     * randomly shuffle deck
     */
    shuffleDeck(): void{
      Phaser.Utils.Array.Shuffle(this.cards);
    }

    /**
     * sorts deck from lowest value to highest value
     */
    sortDeck(): void{
      this.cards.sort((cardA, cardB) => cardA.rank - cardB.rank);
    }

    /**
     * 
     * @returns number of cards in the deck
     */
    getNumberCards(): number{
      return this.cards.length; 
    }

    /**
     * removes all cards from deck
     */
    clearDeck(): void {
      this.cards = []; 
    }

    static serialize(deck: Deck): any {
      let serializedCards = null;
      if (deck.cards && Array.isArray(deck.cards)) {
        serializedCards = deck.cards.map((card) => Card.serialize(card));
      }
      return {
        cards: serializedCards,
      };
    }
    
  
    static deserialize(serializedDeck: any): Deck {
      const deck = new Deck();
      if (serializedDeck.cards && Array.isArray(serializedDeck.cards)) {
        deck.cards = serializedDeck.cards.map((serializedCard: any) =>
          Card.deserialize(serializedCard)
        );
      } else {
        deck.cards = []; // Handle the case when serializedDeck.cards is null or not an array
      }
      return deck;
    }
    
}