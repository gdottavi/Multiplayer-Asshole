import { Card } from "./card";


export default class CardSprite extends Phaser.Physics.Arcade.Sprite {

    card: Card; 
    selected: boolean;
    interactive: false; 
    startPosition: { x: number; y: number; };

    constructor(scene: Phaser.Scene,card:Card, x:number, y:number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        scene.physics.add.existing(this); 
        scene.add.existing(this); 

        this.card = card; 
        this.selected = false; 
        this.interactive = false; 

        
    }

    create(){
        this.setVelocity(100,200);
    }

   
   }
