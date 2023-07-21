import { Card } from "./card";

export const cardWidth = 655;
export const cardHeight = 930; 

export default class CardSprite extends Phaser.Physics.Arcade.Sprite {

    card: Card; 
    selected: boolean;
    interactive: false; 
    startPosition: { x: number; y: number; };
    shadow: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene,card:Card, x:number, y:number, texture: string, frame?: string | number, scale?: number) {
        super(scene, x, y, texture, frame)

        scene.physics.add.existing(this); 
        scene.add.existing(this); 

        this.card = card; 
        this.selected = false; 
        this.interactive = false; 
  
        // Store the initial position for reference
        this.startPosition = { x, y };


    }

    create(){
        this.setVelocity(100,200);
    }

   
   }
