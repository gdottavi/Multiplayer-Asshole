import { io } from "socket.io-client";
import { Player } from "../model/player";
import Lobby from "../scenes/lobby";
//import { displayPlayerName } from "./lobbyUIHandler";


//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';

/**
 * Handles socket events for multiplayer functionality
 */
export default class LobbySocketHandler {

    constructor(scene: Lobby) {

        //server connection
        scene.socket = io(localURL);

        scene.socket.on('connect', () => {
            console.log("Game Connected!");
        })

         // Listen for "playerJoined" event from the server
         scene.socket.on("playerJoined", (newPlayer: Player) => {
            scene.players.addPlayer(newPlayer);
            //displayPlayerName(scene, newPlayer.name)
            scene.LobbyUIHandler.addPlayerToGrid(newPlayer); 
        });

        //Listen for "startGame" event from the server
        //Start Game --> Advances from Lobby Scene to Game Scene.  Sends players and socket to game for intialization. 
        scene.socket.on("startGame", (currentPlayers) => {
                scene.scene.start("Game", {players: currentPlayers, socket: scene.socket})
        })


    }
}