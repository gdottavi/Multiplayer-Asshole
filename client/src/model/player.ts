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

    addCard(card: Card): void{
        this.cardHand.push(card)
    }

    removeCard(card: Card): void {
        this.cardHand = this.cardHand.filter(c => c.key !== card.key);
    }
    

}