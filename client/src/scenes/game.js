"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = __importStar(require("../helpers/card"));
const zone_1 = __importDefault(require("../helpers/zone"));
const dealer_1 = __importDefault(require("../helpers/dealer"));
const io = require('socket.io-client');
const phaser_1 = require("phaser");
const interactiveHandler_1 = __importDefault(require("../helpers/interactiveHandler"));
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
        //play zone
        this.zone = new zone_1.default(this);
        this.dropZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.dropZone);
        //server connection
        this.socket = io('http://localhost:3000');
        this.socket.on('connect', () => {
            console.log("Game Connected!");
        });
        this.socket.on('isPlayerA', () => {
            self.isPlayerA = true;
        });
        //Deal Cards
        this.socket.on('dealCards', () => {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        });
        this.dealText = this.add.text(75, 350, ['DEAL Boner']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.dealText.on('pointerdown', () => {
            self.socket.emit('dealCards');
        });
        this.dealText.on('pointerover', () => {
            self.dealText.setColor('#ff69b4');
        });
        this.dealText.on('pointerout', () => {
            self.dealText.setColor('#00ffff');
        });
        //Playing Cards Functionality - dragging and dropping
        this.InteractiveHandler = new interactiveHandler_1.default(this);
        this.socket.on('cardPlayed', (cardKey, isPlayerA) => {
            if (isPlayerA !== self.isPlayerA) {
                self.opponentCards.pop(); //simply removes one item from cards 
                self.dropZone.data.values.cards++;
                let card = new card_1.default(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), cardKey, card_1.cardType.opponent);
            }
        });
    }
    //make updates to game
    update() {
    }
}
exports.default = Game;
//# sourceMappingURL=game.js.map