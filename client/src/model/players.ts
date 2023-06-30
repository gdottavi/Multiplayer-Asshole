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
     * Builds all players in game.  Needed after socket.io calls to create Player objects. 
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

    /**
     * 
     * @returns number of players in game
     */
    countPlayersInGame(): number{
        const playersInGame = this.players.filter(player => player.inGame === true)
        return playersInGame.length
    }
}