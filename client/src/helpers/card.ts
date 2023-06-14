
//Playing Cards
export enum cardType {
    player,
    opponent 
}

export enum suitesEnum {
    hearts,
    diamonds,
    spades,
    clubs
}

export enum values {
    two = 16,
    three = 3,
    four = 15,
    five = 5,
    six = 6,
    seven = 7, 
    eight = 8,
    nine = 9,
    ten = 10,
    jack = 11,
    queen = 12,
    king = 13,
    ace = 14,
}

export const suites = ['H', 'C', 'D', 'S'];
export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']


/* export default class Card {

    image_key: string; 
    id: string;
    card_type: cardType;
    suite: suitesEnum; 
    value: values;

    render: (x: number, y: number, image_key: string, card_type: cardType, suite?: suites, value?: values) => any;

    constructor(scene: Phaser.Scene) {

        this.render = (x,y,image_key, card_type, suite, value) => {
            let card = scene.add.image(x, y, image_key, 5).setScale(0.3, 0.3).setInteractive().setData({
                "id": this.id,
                "suite": suite,
                "value": value,
                "type": card_type,
                "sprite": image_key
            }); 

            if(card_type === cardType.player){
                scene.input.setDraggable(card);
            }

            return card;

        }


        
    }
} */

export class Card {
    render(arg0: number, arg1: number, playerSprite: string, player: cardType): typeof Card {
        throw new Error("Method not implemented.");
    }
    value: string;
    suite: string;
    FrontImageSprite: string;
    BackImageSprite: string;

    constructor(rank: string, suite: string) {
        this.value = rank;
        this.suite = suite; 
    
        this.FrontImageSprite = suite+rank; 
        this.BackImageSprite = 'CardBack';
    }
  

   }

