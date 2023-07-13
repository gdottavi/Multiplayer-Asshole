import Phaser from "phaser";
import { Socket } from "socket.io-client";
import { Players } from "../model/players";
import LobbySocketHandler from "../lobby_helpers/lobbySocketHandler";
import StartGameHandler from "../lobby_helpers/startGameHandler";
import LobbyUIHandler from "../lobby_helpers/lobbyUIHandler";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import { soundKeys } from "./game";

//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;


export default class Lobby extends Phaser.Scene {
    rexUI: any;
    players: Players;
    socket: Socket;
    namePos: number;
    LobbySocketHandler: LobbySocketHandler;
    StartGameHandler: StartGameHandler;
    LobbyUIHandler: LobbyUIHandler;



    constructor() {
        super("Lobby");
        this.players = new Players;
        this.namePos = 0;
    }

    // Add your scene methods and logic here
    // For example, you can implement the preload, create, and update methods
    // See the Phaser documentation for more information: https://photonstorm.github.io/phaser3-docs/

    preload() {
      //load sounds
      this.load.audio(soundKeys.crackBeer, require('../assets/sounds/opening-beer-can.mp3').default);      
    }

    create() {
        // Initialize the rexUI plugin
        //this.rexUI = this.plugins.get('rexUI');
        this.LobbySocketHandler = new LobbySocketHandler(this);
        this.StartGameHandler = new StartGameHandler(this);
        this.LobbyUIHandler = new LobbyUIHandler(this);
    }




    update() {
        // Update the lobby scene logic (e.g., handle user input, check game state)
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




