"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("../model/player");
const utils_1 = require("../utils/utils");
const lobbyValidators_1 = require("./lobbyValidators");
class StartGameHandler {
    constructor(scene) {
        this.scene = scene;
    }
    /**
 * Send start game event to server for all players to advance to Game scene
 */
    startGame() {
        if ((0, lobbyValidators_1.validateRanks)(this.scene.players.players)) {
            // Transition to the Game scene and pass the players as a parameter
            const currentPlayers = this.scene.players.players.map(playerData => player_1.Player.serialize(playerData));
            this.scene.socket.emit("startGame", currentPlayers);
        }
        else {
            (0, utils_1.createToast)(this.scene, "Unable to Start. Players must have unique ranks.", 10000, (0, utils_1.getCenterX)(this.scene), 100);
        }
    }
    /**
     * Updates player rank
     * @param player - player to update
     * @param newRank - new rank
     */
    updateRank(player, newRank) {
        this.scene.socket.emit("updateRank", player, newRank);
    }
    /**
     * Add player to game and let other existing players know about the new player
     * @param socket - socket
     * @param playerName - player name entered
     */
    joinGame(playerName) {
        // Create a new player object
        let newPlayer = new player_1.Player(this.scene.socket.id, playerName);
        this.scene.socket.emit("joinGame", newPlayer);
        return newPlayer;
    }
}
exports.default = StartGameHandler;
//# sourceMappingURL=startGameHandler.js.map