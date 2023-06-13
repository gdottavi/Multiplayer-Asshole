
//Playing Cards
export enum cardType {
    player,
    opponent 
}

export enum suites {
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


export default class Card {

    image_key: string; 
    id: string;
    card_type: cardType;
    suite: suites; 
    value: values;

    render: (x: number, y: number, image_key: string, card_type: cardType, suite?: suites, value?: values) => any;

    constructor(scene: Phaser.Scene) {
        this.render = (x,y,image_key, card_type, suite, value) => {
            let card = scene.add.image(x, y, image_key).setScale(0.3, 0.3).setInteractive().setData({
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
}