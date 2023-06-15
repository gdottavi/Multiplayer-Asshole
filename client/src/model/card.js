"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.ranks = exports.suites = exports.cardType = void 0;
//Playing Cards
var cardType;
(function (cardType) {
    cardType[cardType["player"] = 0] = "player";
    cardType[cardType["opponent"] = 1] = "opponent";
})(cardType || (exports.cardType = cardType = {}));
exports.suites = ['H', 'C', 'D', 'S'];
exports.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
class Card {
    constructor(suite, rank) {
        this.value = rank;
        this.suite = suite;
        this.key = suite + rank;
        this.FrontImageSprite = suite + rank;
        this.BackImageSprite = 'CardBack';
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map