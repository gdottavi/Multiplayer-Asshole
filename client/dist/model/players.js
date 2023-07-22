export class Players {
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
     * Returns player with given unique socket ID
     * @param socketId - socket ID of player
     * @returns - player with socket ID
     */
    getPlayerById(socketId) {
        return this.players.find(p => p.socketId === socketId);
    }
    /**
     * Finds the player position (index in array)
     * @param playerToFind - player to find
     * @returns - index of player in players array
     */
    getPlayerIndex(playerToFind) {
        //find current player in active players
        return this.players.findIndex(p => p.socketId === playerToFind.socketId);
    }
    /**
     * Builds all players in game.  Sorts by rank set in lobby. Sets asshole and president.
     * Needed after socket.io calls to create Player objects.
     * @param newPlayers - players to add
     */
    setPlayers(newPlayers) {
        this.players = [...newPlayers].sort((a, b) => a.rank - b.rank);
        this.players[0].isPresident = true;
        this.players[this.numberPlayers() - 1].isAsshole = true;
    }
    /**
     * clears all player hands
     */
    clearHands() {
        this.players.forEach(player => player.clearHand());
    }
    /**
     *
     * @returns number of players in game
     */
    countPlayersInGame() {
        const playersInGame = this.players.filter(player => player.inGame === true);
        return playersInGame.length;
    }
}
//# sourceMappingURL=players.js.map