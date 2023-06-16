export class Player {
    constructor(socketId, name) {
        this.name = name;
        this.socketId = socketId;
        this.cardHand = [];
        this.inGame = true;
        this.isTurn = false;
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.socketId;
    }
    addCard(card) {
        this.cardHand.push(card);
    }
    removeCard(card) {
        this.cardHand.filter(c => c.key !== card.key);
    }
}
//# sourceMappingURL=player.js.map