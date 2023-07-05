import {Card} from "./card";

//TODO - Change to factory style class

export class Player{
    name: string;
    readonly socketId: string;
    cardHand: Card[];
    rank: number; 
    isAsshole: boolean;
    isPresident: boolean; 
    inGame: boolean;
    isTurn: boolean; 


    public constructor(socketId: string, name: string ){
        this.name = name; 
        this.socketId = socketId;
        this.cardHand = []; 
        this.inGame = true; 
        this.isTurn = false; 
    };



    getName(): string {
        return this.name;
    }

    /**
     * Adds card to players hand and marks as in game
     * @param card - card to add to players hand
     */
    addCard(card: Card): void{
        this.cardHand.push(card)
        this.inGame = true; 
    }

    /**
     * Removes card from players hand.  Marks as out when no cards remaining
     * @param card - card to remove from players hand
     */
    removeCard(card: Card): void {
        this.cardHand = this.cardHand.filter(c => c.key !== card.key);

        //no more cards to play
        if(this.cardHand.length === 0) this.inGame = false; 

    }
    

}