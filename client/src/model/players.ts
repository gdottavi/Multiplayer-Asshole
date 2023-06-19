import { Player } from "./player";

export class Players extends Array {

    players: Player[]

    constructor() {
        super();
        this.players = [];
    }

    removePlayer() {

    }

    numberPlayers(): number {
        return this.players.length; 
    }
}