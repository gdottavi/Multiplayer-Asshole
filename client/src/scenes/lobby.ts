import Phaser, { GameObjects } from "phaser";
import { Socket, io } from "socket.io-client";
import { Player } from "../model/player";
import { Players } from "../model/players";
import UIHandler, { themeColors, setActiveText, setInactiveText } from "../helpers/uiHandler";

//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';


export default class Lobby extends Phaser.Scene {
    rexUI: any;
    players: Players;
    socket: Socket; 
    namePos: number; 


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

        

        // Connect to the Socket.IO server
        this.socket = io(localURL); // Replace with your Socket.IO server URL

        this.socket.on('connect', () => {
            console.log("Game Connected!");
        })

 
        // Create lobby UI elements
        this.add.text(100, 100, "Players In Game", { fontSize: "32px", color: "#ffffff" })

        // Create the input text box
        const inputBox = this.add.dom(640, 360).createFromHTML(`
    <input type="text" id="nameInput" placeholder="Enter Name" style="font-size: 16px; width: 200px; height: 40px;">
`);

        // Add a ready button
        const joinButton = this.add.text(640, 420, "Join Game", { fontSize: "32px", color: themeColors.cyan }).setOrigin(0.5).setInteractive().setFontFamily('Trebuchet MS')
        setActiveText(joinButton);
        joinButton.on('pointerover', () => {
            joinButton.setColor(themeColors.magenta);
        });

        joinButton.on('pointerout', () => {
            joinButton.setColor(themeColors.cyan);
        });

        joinButton.on("pointerdown", () => {
            const playerName = (document.getElementById("nameInput") as HTMLInputElement).value;
            this.joinGame(playerName);
            setInactiveText(joinButton)
            setActiveText(startButton)
            startButton.on('pointerover', () => {
                startButton.setColor(themeColors.magenta);
            });
    
            startButton.on('pointerout', () => {
                startButton.setColor(themeColors.cyan);
            });


        });

        // Add a start button
        const startButton = this.add.text(640, 640, "Start Game", { fontSize: "32px", color: themeColors.inactiveGray }).setOrigin(0.5).setInteractive().setFontFamily('Trebuchet MS')
        //startButton.setInteractive();
        setInactiveText(startButton); 

        startButton.on("pointerdown", () => {
            //const playerName = (document.getElementById("nameInput") as HTMLInputElement).value;
            this.startGame();
        });

        // Listen for "playerJoined" event from the server
        this.socket.on("playerJoined", (newPlayer: Player) => {
            this.players.addPlayer(newPlayer);
            this.displayPlayerName(newPlayer.name)
        });

        //Listen for "startGame" event from the server
        //Start Game --> Advances from Lobby Scene to Game Scene.  Sends players and socket to game for intialization. 
        this.socket.on("startGame", (currentPlayers) => {
                this.scene.start("Game", {players: currentPlayers, socket: this.socket})
        })
    }

    /**
     * Send start game event to server for all players to advance to Game scene
     */
    startGame() {
        // Transition to the Game scene and pass the players as a parameter
        const currentPlayers = this.players.players.map(playerData => Player.serialize(playerData));
        this.socket.emit("startGame", currentPlayers);
    }

    /**
     * Add player to game and let other existing players know about the new player
     * @param socket - socket
     * @param playerName - player name entered
     */
    joinGame(playerName: string): void {
        // Create a new player object
        let newPlayer = new Player(this.socket.id, playerName)
  
        // Push the player object into the players array
        //this.players.addPlayer(newPlayer);
        // Emit "joinGame" event to the server
        this.socket.emit("joinGame", newPlayer);
    }

    /**
     * Displays a single player name on the screen
     * @param playerName - player name to display
     */
    displayPlayerName(playerName: string): void{
        let yPos = 150 + this.namePos*30;
        let xPos = 200;

        this.add.text(xPos, yPos, playerName, { fontSize: "24px", color: themeColors.cyan })
        this.namePos++; 
    }

    update() {
        // Update the lobby scene logic (e.g., handle user input, check game state)
    }

    
}
