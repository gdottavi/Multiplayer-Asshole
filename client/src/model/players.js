export class Players extends Array {
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
}
//# sourceMappingURL=players.js.map