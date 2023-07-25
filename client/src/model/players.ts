import { Deck } from "./deck";
import { Player } from "./player";

export class Players {

    players: Player[]

    constructor() {
        this.players = [];
    }

    /**
     * removes a player from list of players.  Player specified by socketID.
     * @param socketId - socketID of player to remove
     */
    removePlayer(socketId: string): void {
        this.players = this.players.filter(player => player.socketId !== socketId);
    }


   

    /**
     * resets all players keeping just names and socketIDs
     */
    resetPlayers(){
        this.players.forEach(player => {
            player.rank = null; 
            player.cardHand = new Deck;
            player.isTurn = false;
            player.isAsshole = false;
            player.isPresident = false;
            player.rankDropDown = null;  
        })
    }


    /**
     * Adds player to the list of players.  Does not add duplicates (based on socketID)
     * @param player player to add
     */
    addPlayer(player: Player): void {
        const existingPlayer = this.players.find(p => p.socketId === player.socketId);
        if (!existingPlayer) {
            this.players.push(player);
        } else {
            console.warn(`Player with socketId ${player.socketId} already exists.`);
        }
    }

    /**
     * 
     * @returns total number of players connected to the game
     */
    numberPlayers(): number {
        return this.players.length;
    }

    /**
     * 
     * @returns number of players out of game
     */
    numberPlayersOut(): number {
        const playersOut = this.players.filter(player => !player.inGame);
        return playersOut.length;
    }

    /**
     * 
     * @returns number of players in game
     */
    numberPlayersIn(): number {
        const playersIn = this.players.filter(player => player.inGame);
        return playersIn.length;
    }

    /**
     * Returns player with given unique socket ID
     * @param socketId - socket ID of player 
     * @returns - player with socket ID
     */
    getPlayerById(socketId: string): Player {
        return this.players.find(p => p.socketId === socketId)
    }

    /**
     * Finds the player position (index in array)
     * @param playerToFind - player to find 
     * @returns - index of player in players array
     */
    getPlayerIndex(playerToFind: Player): number {
        //find current player in active players
        return this.players.findIndex(p => p.socketId === playerToFind.socketId);

    }

    /**
     * Builds all players in game.  Sorts by rank set in lobby. Sets asshole and president.
     * Needed after socket.io calls to create Player objects. 
     * @param newPlayers - players to add 
     */
    setPlayers(newPlayers: Player[]): void {
        this.players = [...newPlayers].sort((a, b) => a.rank - b.rank);
        this.players[0].isPresident = true;
        this.players[this.numberPlayers() - 1].isAsshole = true;
    }
    


    /**
     * clears all player hands
     */
    clearHands(): void {
        this.players.forEach(player => player.clearHand());
    }


}