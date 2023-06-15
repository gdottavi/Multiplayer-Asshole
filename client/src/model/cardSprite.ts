import { Card } from "./card";


export default class CardSprite extends Phaser.GameObjects.Sprite {

    card: Card
    constructor(scene: Phaser.Scene,card:Card, x:number, y:number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.card = card; 

        scene.add.existing(this); 
    }



   }
