import Phaser, { Scene } from "phaser";
import { Socket } from "socket.io-client";
import { Players } from "../model/players";
import LobbySocketHandler from "../lobby_helpers/lobbySocketHandler";
import StartGameHandler from "../lobby_helpers/startGameHandler";
import LobbyUIHandler from "../lobby_helpers/lobbyUIHandler";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import Game, { soundKeys } from "./game";

export default class Lobby extends Phaser.Scene {
    rexUI: any;
    players: Players;
    static socket: Socket | null = null;
    namePos: number;
    LobbySocketHandler: LobbySocketHandler;
    StartGameHandler: StartGameHandler;
    LobbyUIHandler: LobbyUIHandler;
    static currentScene: Game | Lobby;



    constructor() {
        super("Lobby");
        this.players = new Players;
        this.namePos = 0;
        Lobby.currentScene = this;   //keeps track of current scene players are in
    }

    preload() {
      //load sounds
      this.load.audio(soundKeys.crackBeer, require('../assets/sounds/opening-beer-can.mp3').default);  
      this.load.audio(soundKeys.asshole, require('../assets/sounds/Drink 45.mp3').default);  
      
      //load images
      this.load.image('BeerfestAsshole', require('../assets/beerfest/beerfest-asshole-circle.png').default);
    }

    create() {
        this.LobbySocketHandler = new LobbySocketHandler(this);
        this.StartGameHandler = new StartGameHandler(this);
        this.LobbyUIHandler = new LobbyUIHandler(this);

         // Request the player list when the scene is created (or when you switch back to it)
         if (Lobby.socket && Lobby.socket.connected) {
            Lobby.socket.emit('getPlayerList');
        }

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




