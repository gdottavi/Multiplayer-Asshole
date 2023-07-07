import Phaser from "phaser";
import { Socket, io } from "socket.io-client";
import { Player } from "../model/player";
import { Players } from "../model/players";


export default class Lobby extends Phaser.Scene {
    rexUI: any;
    players: Players;
    socket: Socket; 


    constructor() {
        super("Lobby");
        this.players = new Players; 
    }

    // Add your scene methods and logic here
    // For example, you can implement the preload, create, and update methods
    // See the Phaser documentation for more information: https://photonstorm.github.io/phaser3-docs/

    preload() {
        // Preload any assets needed for the Lobby scene
    }

    create() {

        // Connect to the Socket.IO server
        this.socket = io("http://localhost:3000"); // Replace with your Socket.IO server URL

        this.socket.on('connect', () => {
            console.log("Game Connected!");
        })

 
        // Create lobby UI elements

        // Create the input text box
        const inputBox = this.add.dom(640, 360).createFromHTML(`
    <input type="text" id="nameInput" placeholder="Enter Name" style="font-size: 16px; width: 200px; height: 40px;">
`);

        // Add a ready button
        const joinButton = this.add.text(640, 420, "Join Game", { fontSize: "32px", color: "#ffffff" }).setOrigin(0.5);
        joinButton.setInteractive();

        joinButton.on("pointerdown", () => {
            const playerName = (document.getElementById("nameInput") as HTMLInputElement).value;
            this.joinGame(playerName);
        });

        // Add a start button
        const startButton = this.add.text(640, 220, "Start Game", { fontSize: "32px", color: "#ffffff" }).setOrigin(0.5);
        startButton.setInteractive();

        startButton.on("pointerdown", () => {
            const playerName = (document.getElementById("nameInput") as HTMLInputElement).value;
            this.startGame();
        });

        // Listen for "playerJoined" event from the server
        this.socket.on("playerJoined", ({ playerName, socketId }) => {
            console.log(`Player ${playerName} joined the game with socket ID: ${socketId}`);
        });
    }

    startGame() {
        // Transition to the Game scene and pass the players as a parameter
        const currentPlayers = this.players.players.map(playerData => Player.serialize(playerData));
        this.scene.start("Game", { players: currentPlayers, socket: this.socket });
    }

    /**
     * Add player to game and let other existing players know about the new player
     * @param socket - socket
     * @param playerName - player name entered
     */
    joinGame(playerName: string) {
        // Create a new player object
        let newPlayer = new Player(this.socket.id, playerName)

        // Push the player object into the players array
        this.players.addPlayer(newPlayer);
        // Emit "joinGame" event to the server
        this.socket.emit("joinGame", { playerName });
    }

    update() {
        // Update the lobby scene logic (e.g., handle user input, check game state)
    }
}
