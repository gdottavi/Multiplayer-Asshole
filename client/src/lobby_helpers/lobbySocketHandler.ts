import { io } from "socket.io-client";
import { Player } from "../model/player";
import Lobby from "../scenes/lobby";
import { Players } from "../model/players";
import { soundKeys } from "../scenes/game";
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

        // On connection check for already connected players
        scene.socket.on('connect', () => {
            scene.socket.emit('getPlayerList')
        })

        // Display all players already in game
        scene.socket.on('playerList', (players: Players) => {
            players.players.forEach((player: Player) => {
                scene.players.addPlayer(player);
                scene.LobbyUIHandler.addPlayerToGrid(player); 
            })
        })

         // Listen for "playerJoined" event from the server
         scene.socket.on("playerJoined", (newPlayer: Player) => {
            scene.players.addPlayer(newPlayer);
            scene.LobbyUIHandler.addPlayerToGrid(newPlayer); 
        });

        // Update player ranks 
        scene.socket.on('updateRank', (player: Player, rank: number) => {
            let scenePlayer = scene.players.getPlayerById(player.socketId)
            scenePlayer.rank = rank
            scene.LobbyUIHandler.updateRank(scenePlayer); 
            console.log(scene.players.players)
        })

        //Listen for "startGame" event from the server
        //Start Game --> Advances from Lobby Scene to Game Scene.  Sends players and socket to game for intialization. 
        scene.socket.on("startGame", (currentPlayers) => {
                scene.playSound(soundKeys.crackBeer); 
                scene.scene.start("Game", {players: currentPlayers, socket: scene.socket})
        })


    }
}