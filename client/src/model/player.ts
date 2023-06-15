import {Card} from "./card";


export class Player{
    name: string;
    readonly socketId: string;
    cardHand: Card[];
    rank: number; 
    isAsshole: boolean;
    isPresident: boolean; 
    inGame: boolean;
    isTurn: boolean; 

    constructor(socketId: string, name: string ){
        this.name = name; 
        this.socketId = socketId;
        this.cardHand = []; 
        this.inGame = true; 
        this.isTurn = false; 
    }

    getName(): string {
        return this.name;
    }

    getId(): string {
        return this.socketId;
    }

    addCard(card: Card): void{
        this.cardHand.push(card)
    }

    removeCard(card: Card): void{
        this.cardHand.filter(c => c !== card)
    }

}