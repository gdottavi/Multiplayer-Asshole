
//Playing Cards
export default class Card {

    image_key: string; 

    render: (x: number, y: number, image_key: string) => any;

    constructor(scene: Phaser.Scene) {
        this.render = (x,y,image_key) => {
            let card = scene.add.image(x, y, image_key).setScale(0.3, 0.3).setInteractive(); 
            scene.input.setDraggable(card);
            return card;

        }
    }
}