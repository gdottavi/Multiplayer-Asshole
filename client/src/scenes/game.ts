import {GameObjects, Input, Scene} from "phaser";
import InteractiveHandler from "../helpers/interactiveHandler";
import SocketHandler from "../helpers/socketHandler";
import UIHandler from "../helpers/uiHandler";
import GameHandler from "../helpers/gameHandler";
import DeckHandler from "../helpers/deckHandler";
import {Socket} from "socket.io-client" ; 
import { Deck } from "../model/deck";
import { Players } from "../model/players";
import { suites, values } from "../model/card";
import CardSprite from "../model/cardSprite";

export const soundKeys = {
    crackBeer: 'beer-can-open',
}

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
    currentPlayerZone: Phaser.GameObjects.Zone; 
    dealText: GameObjects.Text;
    outline: any; 
    resetText: GameObjects.Text;
    deck: Deck; 
    currentPlayers: Players; 
    currentPlayedCards: Deck[]; 
    readyText: GameObjects.Text;
    passText: GameObjects.Text;
    playCardsText: GameObjects.Text;
    selectedCardSprites: any[]; 

    constructor(){
        super({
            key: 'Game',
        })
    }

    //load everything needed for game 
    preload() {

        //load all playing card images
        this.load.image('CardBack', require('../assets/CardBack.png').default); 
        suites.forEach(suite => {
            values.forEach(value => {
                let key = suite+value; 
                this.load.image(key, require('../assets/white/'+key+'.png').default);
            })
        })

        //load sounds
        this.load.audio(soundKeys.crackBeer, require('../assets/sounds/opening-beer-can.mp3').default); 


    }
       
    

    //populate needed items for game - "this" is a scene of type Game
    create() {
        this.deck = new Deck(); 
        this.currentPlayers = new Players(); 
        this.selectedCardSprites = []; 
        this.currentPlayedCards = new Deck(); 

        this.UIHandler = new UIHandler(this); 
        this.GameHandler = new GameHandler(this); 
        this.InteractiveHandler = new InteractiveHandler(this); 
        this.SocketHandler = new SocketHandler(this); 
        this.DeckHandler = new DeckHandler(this);


    }

    //make updates to game
    update() {
        
    }

    /**
     * plays a sound
     * @param key - sound key to play
     */
    playSound(key: string) {
        var sound = this.sound.add(key);
        sound.play();
    }
}