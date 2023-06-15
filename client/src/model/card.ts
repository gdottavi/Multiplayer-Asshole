
//Playing Cards
export enum cardType {
    player,
    opponent 
}

export const suites = ['H', 'C', 'D', 'S'];
export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']


export class Card {
    value: string;
    suite: string;
    FrontImageSprite: string;
    BackImageSprite: string;

    constructor(suite: string, rank: string) {
        this.value = rank;
        this.suite = suite; 
        this.FrontImageSprite = suite+rank; 
        this.BackImageSprite = 'CardBack';
    } 
   }

