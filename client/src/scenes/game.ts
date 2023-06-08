
import * as Phaser from "phaser";
import Card from "../helpers/card";
import Zone from "../helpers/zone"; 

export default class Game extends Phaser.Scene {
    zone!: Zone;
    dropZone: any;
    outline!: void;
    dealCards!: () => void;
    dealText!: Phaser.GameObjects.Text;
    

    constructor(t: any){
        super({
            key: 'Game',
        })
    }

    //load everything needed for game 
    preload() {

        //load card images

        this.load.image('cyanCardFront', require('../assets/CyanCardFront.png').default);
        this.load.image('cyanCardBack', require('../assets/CyanCardBack.png').default);
        this.load.image('magentaCardFront', require('../assets/MagentaCardFront.png').default);
        this.load.image('magentaCardBack', require('../assets/MagentaCardBack.png').default);
       
    }

    //populate needed items for game
    create() {
        let self = this;
      

        //play zone
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone); 

        //Deal hand of cards to a player
        this.dealCards = () => {
            for (let i=0; i<5; i++){
                let playerCard = new Card(this);
                playerCard.render(475+(i*100), 650, 'cyanCardFront');
            }
        }

        //Deal Cards
        this.dealText = this.add.text(75, 350, ['DEAL Boner']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.dealText.on('pointerdown', function () {
                self.dealCards();
            })
        this.dealText.on('pointerover', function(){
            self.dealText.setColor('#ff69b4');
        })
        this.dealText.on('pointerout', function(){
            self.dealText.setColor('#00ffff'); 
        })


        //Dragging Cards Functionality
        this.input.on('dragstart', function(pointer: Phaser.Input.Pointer, gameObject: any){
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject); 
        })

        this.input.on('dragend', function(pointer: Phaser.Input.Pointer, gameObject: { setTint: () => void; x: any; input: { dragStartX: any; dragStartY: any; }; y: any; }, dropped: any){
            gameObject.setTint();
            if(!dropped){
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drag', function(pointer: Phaser.Input.Pointer, gameObject: { x: any; y: any; }, dragX: any, dragY: any) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        this.input.on('drop', function(pointer: Phaser.Input.Pointer, gameObject: any, dropZone: Phaser.GameObjects.Zone){
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards *50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
            
        })

    }

    //make updates to game
    update() {

    }
}