
//Playing Cards
export enum cardType {
    player,
    opponent 
}

export default class Card {

    image_key: string; 
    id: string;
    card_type: cardType;

    render: (x: number, y: number, image_key: string, card_type: cardType) => any;

    constructor(scene: Phaser.Scene) {
        this.render = (x,y,image_key, card_type) => {
            let card = scene.add.image(x, y, image_key).setScale(0.3, 0.3).setInteractive().setData({
                "id": this.id,
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