"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Players = void 0;
const player_1 = require("./player");
class Players {
    constructor() {
        this.players = [];
    }
    removePlayer(socketId) {
        this.players = this.players.filter(player => player.socketId !== socketId);
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
        return this.players.find(p => p.socketId === socketId);
    }
    /**
     * Resets all players in game
     * @param newPlayers - players to add
     */
    setPlayers(newPlayers) {
        this.players = [];
        newPlayers.forEach(p => {
            let newPlayer = new player_1.Player(p.socketId, p.name);
            newPlayer.cardHand = p.cardHand;
            newPlayer.isTurn = p.isTurn;
            newPlayer.inGame = p.inGame;
            this.addPlayer(newPlayer);
        });
    }
}
exports.Players = Players;
//# sourceMappingURL=players.js.map