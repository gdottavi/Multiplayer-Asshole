
import * as Phaser from "phaser";
import Card from "../helpers/card";
import Zone from "../helpers/zone"; 
import Dealer from "../helpers/dealer";
const io = require('socket.io-client');


export default class Game extends Phaser.Scene {
    zone!: Zone;
    dropZone: Zone;
    outline!: void;
    dealCards!: () => void;
    dealText!: Phaser.GameObjects.Text;
    socket: any;
    isPlayerA: boolean; 
    opponentCards: Card[];
    dealer: Dealer;

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

        //setup players and dealer
        this.isPlayerA = false; 
        this.opponentCards = [];
        this.dealer = new Dealer(this); 

        //play zone
        this.zone = new Zone(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);         

        //server connection
        this.socket = io('http://localhost:3000');      
        this.socket.on('connect', function(){
            console.log("Game Connected!");
        })
        this.socket.on('isPlayerA', function(){
            self.isPlayerA = true;
        })

        this.socket.on('dealCards', function() {
            self.dealer.dealCards();
            self.dealText.disableInteractive(); 
        })


        //Deal Cards
        this.dealText = this.add.text(75, 350, ['DEAL Boner']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.dealText.on('pointerdown', function () {
                self.socket.emit('dealCards'); 
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