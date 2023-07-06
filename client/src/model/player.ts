import {Card} from "./card";
import { Deck } from "./deck";

//TODO - Change to factory style class

export class Player{
    name: string;
    readonly socketId: string;
    cardHand: Deck;
    rank: number; 
    isAsshole: boolean;
    isPresident: boolean; 
    inGame: boolean;
    isTurn: boolean; 

    public constructor(socketId: string, name: string ){
        this.name = name; 
        this.socketId = socketId;
        this.cardHand = new Deck; 
        this.inGame = true; 
        this.isTurn = false; 
        this.rank = 0; 
        this.isAsshole = false;
        this.isPresident = false; 
    };



    getDisplayName(): string {
        if(this.isAsshole) return this.name + " (ASSHOLE)";
        if(this.isPresident) return this.name + " (PRESIDENT)"
        if(this.rank === 2) return this.name + " (VICE)"
        if(this.rank === 3) return this.name + " (3rd)"
        if(this.rank > 2) return this.name + " (" + this.rank + "th)"
        else return this.name; 
    }

    /**
     * Adds card to players hand and marks as in game
     * @param card - card to add to players hand
     */
    addCard(card: Card): void{
        this.cardHand.addCard(card)
        this.inGame = true; 
    }


    getNumberCardsInHand(): number {
        return this.cardHand.cards.length; 
    }

    /**
     * Removes card from players hand.  Marks as out when no cards remaining
     * @param card - card to remove from players hand
     */
    removeCard(card: Card): void {
        this.cardHand.removeCard(card); 

        //no more cards to play
        if(this.getNumberCardsInHand() === 0) this.inGame = false; 

    }

    /**
     * clears player hand
     */
    clearHand(): void{
        this.cardHand.clearDeck(); 
    }

    /**
     * 
     * @returns a serialized player object for use with socketIO
     */
    static serialize(player: Player): any {
        return {
          name: player.name,
          socketId: player.socketId,
          cardHand: Deck.serialize(player.cardHand),
          rank: player.rank,
          isAsshole: player.isAsshole,
          isPresident: player.isPresident,
          inGame: player.inGame,
          isTurn: player.isTurn,
        };
      }
    
      static deserialize(serializedPlayer: any): Player {
        const player = new Player(serializedPlayer.socketId, serializedPlayer.name);
        player.rank = serializedPlayer.rank;
        player.isAsshole = serializedPlayer.isAsshole;
        player.isPresident = serializedPlayer.isPresident;
        player.inGame = serializedPlayer.inGame;
        player.isTurn = serializedPlayer.isTurn;
    
        const deck = Deck.deserialize(serializedPlayer.cardHand);
        player.cardHand = deck;
    
        return player;
      }
    

}