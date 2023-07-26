export const testingSuite = ['H']; //TODO - remove, this was only for creating 1/4 as many cards to test end scenarios
export const testingValues = ['2', '4', '5', '6', '7'];
export const suites = ['H', 'C', 'D', 'S'];
export const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export class Card {
    constructor(suite, value) {
        this.value = value;
        this.suite = suite;
        this.key = suite + value;
        this.frontImageSprite = suite + value;
        this.backImageSprite = 'CardBack';
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
    static serialize(card) {
        return {
            value: card.value,
            suite: card.suite,
            frontImageSprite: card.frontImageSprite,
            backImageSprite: card.backImageSprite,
            key: card.key,
            rank: card.rank,
        };
    }
    static deserialize(serializedCard) {
        return new Card(serializedCard.suite, serializedCard.value);
    }
}
//# sourceMappingURL=card.js.map