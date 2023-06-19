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
}