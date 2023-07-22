"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zone_1 = __importDefault(require("../helpers/zone"));
const dealer_1 = __importDefault(require("../helpers/dealer"));
const io = require('socket.io-client');
const phaser_1 = require("phaser");
class Game extends phaser_1.Scene {
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
        this.dealer = new dealer_1.default(this);
        console.log(this.opponentCards);
        //play zone
        this.zone = new zone_1.default(this);
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
        //Deal Cards
        this.socket.on('dealCards', function () {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        });
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
        //Playing Cards Functionality - dragging and dropping
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
            console.log("dropped card: " + gameObject.texture.key);
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
        });
        this.socket.on('cardPlayed', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                console.log("card played: :" + gameObject.texture);
                console.log("is player A in card played: " + isPlayerA);
                /* let sprite = gameObject.texture.key;   //get the card associated with this key
                self.opponentCards.pop();  //simply removes one item from cards
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), sprite).disableInteractive(); */
            }
        });
    }
    //make updates to game
    update() {
    }
}
exports.default = Game;
//# sourceMappingURL=game.js.map