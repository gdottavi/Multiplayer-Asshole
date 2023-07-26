import { Deck } from "./deck";
//TODO - Change to factory style class
export class Player {
    constructor(socketId, name) {
        this.name = name;
        this.socketId = socketId;
        this.cardHand = new Deck;
        this.inGame = true;
        this.isTurn = false;
        this.rank = null;
        this.isAsshole = false;
        this.isPresident = false;
    }
    ;
    getDisplayName() {
        if (this.isAsshole)
            return this.name + " (ASSHOLE)";
        if (this.isPresident)
            return this.name + " (PRESIDENT)";
        if (this.rank === 1)
            return this.name + " (VICE)";
        if (this.rank === 2)
            return this.name + " (3rd)";
        if (this.rank > 2)
            return this.name + " (" + this.rank + "th)";
        else
            return this.name;
    }
    /**
     * Adds card to players hand and marks as in game
     * @param card - card to add to players hand
     */
    addCard(card) {
        this.cardHand.addCard(card);
        this.inGame = true;
    }
    getNumberCardsInHand() {
        return this.cardHand.cards.length;
    }
    /**
     * Removes card from players hand.  Marks as out when no cards remaining
     * @param card - card to remove from players hand
     */
    removeCard(card) {
        this.cardHand.removeCard(card);
        //no more cards to play
        if (this.getNumberCardsInHand() === 0)
            this.inGame = false;
    }
    /**
     * clears player hand
     */
    clearHand() {
        this.cardHand.clearDeck();
    }
    /**
     *
     * @returns a serialized player object for use with socketIO
     */
    static serialize(player) {
        return {
            name: player.name,
            socketId: player.socketId,
            cardHand: Deck.serialize(player.cardHand),
            rank: player.rank,
            isAsshole: player.isAsshole,
            isPresident: player.isPresident,
            inGame: player.inGame,
            isTurn: player.isTurn,
        };
    }
    static deserialize(serializedPlayer) {
        const player = new Player(serializedPlayer.socketId, serializedPlayer.name);
        player.rank = serializedPlayer.rank;
        player.isAsshole = serializedPlayer.isAsshole;
        player.isPresident = serializedPlayer.isPresident;
        player.inGame = serializedPlayer.inGame;
        player.isTurn = serializedPlayer.isTurn;
        const deck = Deck.deserialize(serializedPlayer.cardHand);
        player.cardHand = deck;
        return player;
    }
}
/**
 *
 * @param rank - number rank
 * @param numberPlayers - total number of players in game
 * @returns string representation of player rank in game
 */
export function getDisplayRank(rank, numberPlayers) {
    if (rank === numberPlayers)
        return "Asshole";
    if (rank === 1)
        return "President";
    if (rank === 2)
        return "Vice";
    if (rank > 2)
        return rank + "th";
    else
        return rank.toString();
}
//# sourceMappingURL=player.js.map