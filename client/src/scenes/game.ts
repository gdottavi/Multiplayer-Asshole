import {GameObjects, Input, Scene} from "phaser";
import InteractiveHandler from "../helpers/interactiveHandler";
import SocketHandler from "../helpers/socketHandler";
import UIHandler from "../helpers/uiHandler";
import GameHandler from "../helpers/gameHandler";
import DeckHandler from "../helpers/deckHandler";
import {Socket} from "socket.io-client" ; 
import { Card } from "../helpers/card";
import { Player } from "../helpers/player";
import { Deck } from "../model/deck";

export default class Game extends Scene {
    socket: Socket;
    isPlayerA: boolean; 
    InteractiveHandler: InteractiveHandler;
    SocketHandler: SocketHandler;
    UIHandler: UIHandler;
    GameHandler: GameHandler;
    DeckHandler: DeckHandler;
    zone: any;
    dropZone: Phaser.GameObjects.Zone;
    dealText: GameObjects.Text;
    outline: any; 
    resetText: GameObjects.Text;
    deck: Deck; 
    players: Player[]; 

    constructor(){
        super({
            key: 'Game',
        })
    }

    //load everything needed for game 
    preload() {

        //load spritesheet of playing cards
        //this.load.spritesheet("cards", require('../assets/Cards.png').default);
        //load card images
        this.load.image('cyanCardFront', require('../assets/CyanCardFront.png').default);
        this.load.image('cyanCardBack', require('../assets/CyanCardBack.png').default);
        this.load.image('magentaCardFront', require('../assets/MagentaCardFront.png').default);
        this.load.image('magentaCardBack', require('../assets/MagentaCardBack.png').default);
       
    }

    //populate needed items for game
    create() {
        this.UIHandler = new UIHandler(this); 
        this.GameHandler = new GameHandler(this); 
        this.InteractiveHandler = new InteractiveHandler(this); 
        this.SocketHandler = new SocketHandler(this); 
        this.DeckHandler = new DeckHandler(this);
        this.deck = new Deck(); 
        this.players = []; 

        this.GameHandler.addPlayers(); 
    }

    //make updates to game
    update() {

    }
}