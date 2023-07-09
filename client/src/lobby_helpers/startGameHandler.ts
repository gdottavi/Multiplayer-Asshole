import { themeColors } from "../game_helpers/gameUIHandler";
import { Player } from "../model/player";
import Lobby from "../scenes/lobby";


export default class StartGameHandler {
    scene: Lobby;


    constructor(scene: Lobby){
        this.scene = scene; 
    }

        /**
     * Send start game event to server for all players to advance to Game scene
     */
        startGame() {
            // Transition to the Game scene and pass the players as a parameter
            const currentPlayers = this.scene.players.players.map(playerData => Player.serialize(playerData));
            this.scene.socket.emit("startGame", currentPlayers);
        }
    
        /**
         * Add player to game and let other existing players know about the new player
         * @param socket - socket
         * @param playerName - player name entered
         */
        joinGame(playerName: string): void {
            // Create a new player object
            let newPlayer = new Player(this.scene.socket.id, playerName)
      
            // Push the player object into the players array
            //this.players.addPlayer(newPlayer);
            // Emit "joinGame" event to the server
            this.scene.socket.emit("joinGame", newPlayer);
        }


}