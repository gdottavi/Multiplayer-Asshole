import { themeColors } from "../game_helpers/gameUIHandler";
import { Player } from "../model/player";
import Lobby from "../scenes/lobby";
import { createToast, getCenterX } from "../utils/utils";
import { validateRanks } from "./lobbyValidators";


export default class StartGameHandler {
    scene: Lobby;


    constructor(scene: Lobby) {
        this.scene = scene;
    }

    /**
 * Send start game event to server for all players to advance to Game scene
 */
    startGame() {
        if (validateRanks(this.scene.players.players)) {
            // Transition to the Game scene and pass the players as a parameter
            const currentPlayers = this.scene.players.players.map(playerData => Player.serialize(playerData));
            this.scene.socket.emit("startGame", currentPlayers);
        }
        else{
            createToast(this.scene, "Unable to Start. Players must have unique ranks.", 10000,getCenterX(this.scene),100); 
        }
    }

    /**
     * Updates player rank
     * @param player - player to update
     * @param newRank - new rank
     */
    updateRank(player: Player, newRank: number) {
        this.scene.socket.emit("updateRank", player, newRank)
    }

    /**
     * Add player to game and let other existing players know about the new player
     * @param socket - socket
     * @param playerName - player name entered
     */
    joinGame(playerName: string): Player {
        // Create a new player object
        let newPlayer = new Player(this.scene.socket.id, playerName)
        this.scene.socket.emit("joinGame", newPlayer);
        return newPlayer
    }


}