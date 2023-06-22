"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
//TODO - Change to factory style class
class Player {
    constructor(socketId, name) {
        this.name = name;
        this.socketId = socketId;
        this.cardHand = [];
        this.inGame = true;
        this.isTurn = false;
    }
    ;
    getName() {
        return this.name;
    }
    addCard(card) {
        this.cardHand.push(card);
    }
    removeCard(card) {
        this.cardHand = this.cardHand.filter(c => c.key !== card.key);
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map