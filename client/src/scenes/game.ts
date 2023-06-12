import Card, { cardType } from "../helpers/card";
import Zone from "../helpers/zone"; 
import Dealer from "../helpers/dealer";
const io = require('socket.io-client');
import {GameObjects, Input, Scene} from "phaser";
import InteractiveHandler from "../helpers/interactiveHandler";



export default class Game extends Scene {
    zone: Zone;
    dropZone: GameObjects.Zone;
    outline!: void;
    dealCards!: () => void;
    dealText!: GameObjects.Text;
    socket: any;
    isPlayerA: boolean; 
    opponentCards: Card[];
    dealer: Dealer;
    InteractiveHandler: InteractiveHandler;

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
        this.socket = io();      
        this.socket.on('connect', () => {
            console.log("Game Connected!");
        })
        this.socket.on('isPlayerA', () => {
            self.isPlayerA = true;
        })


        //Deal Cards
        this.socket.on('dealCards', () => {
            self.dealer.dealCards();
            self.dealText.disableInteractive(); 
        })
        
        this.dealText = this.add.text(75, 350, ['DEAL Boner']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.dealText.on('pointerdown', () =>  {
                self.socket.emit('dealCards'); 
            })
        this.dealText.on('pointerover', () => {
            self.dealText.setColor('#ff69b4');
        })
        this.dealText.on('pointerout', () => {
            self.dealText.setColor('#00ffff'); 
        })


        //Playing Cards Functionality - dragging and dropping
        this.InteractiveHandler = new InteractiveHandler(this); 


        this.socket.on('cardPlayed', (cardKey: string, isPlayerA: boolean) => {
            if(isPlayerA !== self.isPlayerA){
                self.opponentCards.pop();  //simply removes one item from cards 
                self.dropZone.data.values.cards++;
                let card = new Card(self);
                card.render(((self.dropZone.x - 350) + (self.dropZone.data.values.cards * 50)), (self.dropZone.y), cardKey, cardType.opponent);
            }
        })

    }

    //make updates to game
    update() {

    }
}