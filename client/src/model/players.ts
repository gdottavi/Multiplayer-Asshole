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
     * 
     * @param socketId - socket ID of player 
     * @returns - player with socket ID
     */
    getPlayerById(socketId: string): Player{
        return this.players.find(p => p.socketId === socketId )
    }

    /**
     * Resets all players in game
     * @param newPlayers - players to add 
     */
    setPlayers(newPlayers: Player[]): void{
        this.players = []
        newPlayers.forEach(p => {
            let newPlayer = new Player(p.socketId, p.name)
            newPlayer.cardHand = p.cardHand
            newPlayer.isTurn = p.isTurn
            newPlayer.inGame = p.inGame

            this.addPlayer(newPlayer); 
        })
    }
}