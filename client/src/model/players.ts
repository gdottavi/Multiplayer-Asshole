import { Player } from "./player";

export class Players extends Array {

    players: Player[]

    constructor() {
        super();
        this.players = [];
    }

    removePlayer() {

    }

    addPlayer(player: Player): void {
        this.players.push(player); 
    }

    numberPlayers(): number {
        return this.players.length; 
    }

    /**
     * 
     * @param socketId - socket ID of player 
     * @returns - player with socket ID
     */
    getPlayerById(socketId: string){
        return this.players.find(p => p.getId() === socketId )
    }

    /**
     * Resets all players in game
     * @param newPlayers - players to add 
     */
    setPlayers(newPlayers: Player[]): void{
        this.players = []
        this.players = newPlayers; 
    }
}