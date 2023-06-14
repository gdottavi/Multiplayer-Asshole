"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(socketId, name) {
        this.name = name;
        this.socketId = socketId;
        this.cardHand = [];
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map