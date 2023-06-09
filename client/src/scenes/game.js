import * as Phaser from "phaser";
import Zone from "../helpers/zone";
import Dealer from "../helpers/dealer";
const io = require('socket.io-client');
export default class Game extends Phaser.Scene {
    constructor(t) {
        super({
            key: 'Game',
        });
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
        this.socket.on('connect', function () {
            console.log("Game Connected!");
        });
        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        });
        this.socket.on('dealCards', function () {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        });
        //Deal Cards
        this.dealText = this.add.text(75, 350, ['DEAL Boner']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.dealText.on('pointerdown', function () {
            self.socket.emit('dealCards');
        });
        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        });
        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        });
        //Dragging Cards Functionality
        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            self.children.bringToTop(gameObject);
        });
        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.input.on('drop', function (pointer, gameObject, dropZone) {
            dropZone.data.values.cards++;
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
        });
    }
    //make updates to game
    update() {
    }
}
//# sourceMappingURL=game.js.map