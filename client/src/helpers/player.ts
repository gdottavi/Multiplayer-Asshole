import {Card} from "./card";


export class Player{
    name: string;
    socketId: string;
    cardHand: Card[];

    constructor(socketId: string, name: string ){
        this.name = name; 
        this.socketId = socketId;
        this.cardHand = []; 
    }
}