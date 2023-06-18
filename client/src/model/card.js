"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.values = exports.suites = void 0;
exports.suites = ['H', 'C', 'D', 'S'];
exports.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
class Card {
    constructor(suite, value) {
        this.value = value;
        this.suite = suite;
        this.key = suite + value;
        this.FrontImageSprite = suite + value;
        this.BackImageSprite = 'CardBack';
        this.rank = this.setRank(value);
    }
    setRank(value) {
        switch (value) {
            case '3': return 1;
            case '4': return 2;
            case '5': return 3;
            case '6': return 4;
            case '7': return 5;
            case '8': return 6;
            case '9': return 7;
            case '10': return 8;
            case 'J': return 9;
            case 'Q': return 10;
            case 'K': return 11;
            case 'A': return 12;
            case '4': return 13;
            case '2': return 14;
            default: return 0;
        }
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map