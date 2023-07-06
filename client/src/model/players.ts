import { Player } from "./player";

export class Players {

    players: Player[]

    constructor() {
        this.players = [];
    }

    removePlayer(socketId: string): void {
        this.players = this.players.filter(player => player.socketId !== socketId);
      }
      

    addPlayer(player: Player): void {
        this.players.push(player); 
    }

    numberPlayers(): number {
        return this.players.length; 
    }

    /**
     * Returns player with given unique socket ID
     * @param socketId - socket ID of player 
     * @returns - player with socket ID
     */
    getPlayerById(socketId: string): Player{
        return this.players.find(p => p.socketId === socketId )
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
     * Builds all players in game.  Needed after socket.io calls to create Player objects. 
     * @param newPlayers - players to add 
     */
    setPlayers(newPlayers: Player[]): void{
        this.players = []
        newPlayers.forEach(p => {
                this.addPlayer(p); 
        })
    }

    /**
     * clears all player hands
     */
    clearHands(): void{
        this.players.forEach(player => player.clearHand()); 
    }

    /**
     * 
     * @returns number of players in game
     */
    countPlayersInGame(): number{
        const playersInGame = this.players.filter(player => player.inGame === true)
        return playersInGame.length
    }
}