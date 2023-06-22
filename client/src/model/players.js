"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Players = void 0;
class Players extends Array {
    constructor() {
        super();
        this.players = [];
    }
    removePlayer() {
    }
    addPlayer(player) {
        this.players.push(player);
    }
    numberPlayers() {
        return this.players.length;
    }
    /**
     *
     * @param socketId - socket ID of player
     * @returns - player with socket ID
     */
    getPlayerById(socketId) {
        return this.players.find(p => p.getId() === socketId);
    }
    /**
     * Resets all players in game
     * @param newPlayers - players to add
     */
    setPlayers(newPlayers) {
        this.players = [];
        this.players = newPlayers;
    }
}
exports.Players = Players;
//# sourceMappingURL=players.js.map