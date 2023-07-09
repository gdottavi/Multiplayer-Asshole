import Phaser from "phaser";
import { Socket } from "socket.io-client";
import { Players } from "../model/players";
import LobbySocketHandler from "../lobby_helpers/lobbySocketHandler";
import StartGameHandler from "../lobby_helpers/startGameHandler";
import LobbyUIHandler from "../lobby_helpers/lobbyUIHandler";

//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';


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
        // Preload any assets needed for the Lobby scene
    }

    create() {
        
        this.LobbySocketHandler = new LobbySocketHandler(this); 
        this.StartGameHandler = new StartGameHandler(this); 
        this.LobbyUIHandler = new LobbyUIHandler(this); 
    }


    update() {
        // Update the lobby scene logic (e.g., handle user input, check game state)
    }

    
}
