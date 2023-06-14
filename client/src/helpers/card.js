"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = exports.ranks = exports.suites = exports.values = exports.suitesEnum = exports.cardType = void 0;
//Playing Cards
var cardType;
(function (cardType) {
    cardType[cardType["player"] = 0] = "player";
    cardType[cardType["opponent"] = 1] = "opponent";
})(cardType || (exports.cardType = cardType = {}));
var suitesEnum;
(function (suitesEnum) {
    suitesEnum[suitesEnum["hearts"] = 0] = "hearts";
    suitesEnum[suitesEnum["diamonds"] = 1] = "diamonds";
    suitesEnum[suitesEnum["spades"] = 2] = "spades";
    suitesEnum[suitesEnum["clubs"] = 3] = "clubs";
})(suitesEnum || (exports.suitesEnum = suitesEnum = {}));
var values;
(function (values) {
    values[values["two"] = 16] = "two";
    values[values["three"] = 3] = "three";
    values[values["four"] = 15] = "four";
    values[values["five"] = 5] = "five";
    values[values["six"] = 6] = "six";
    values[values["seven"] = 7] = "seven";
    values[values["eight"] = 8] = "eight";
    values[values["nine"] = 9] = "nine";
    values[values["ten"] = 10] = "ten";
    values[values["jack"] = 11] = "jack";
    values[values["queen"] = 12] = "queen";
    values[values["king"] = 13] = "king";
    values[values["ace"] = 14] = "ace";
})(values || (exports.values = values = {}));
exports.suites = ['H', 'C', 'D', 'S'];
exports.ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
/* export default class Card {

    image_key: string;
    id: string;
    card_type: cardType;
    suite: suitesEnum;
    value: values;

    render: (x: number, y: number, image_key: string, card_type: cardType, suite?: suites, value?: values) => any;

    constructor(scene: Phaser.Scene) {

        this.render = (x,y,image_key, card_type, suite, value) => {
            let card = scene.add.image(x, y, image_key, 5).setScale(0.3, 0.3).setInteractive().setData({
                "id": this.id,
                "suite": suite,
                "value": value,
                "type": card_type,
                "sprite": image_key
            });

            if(card_type === cardType.player){
                scene.input.setDraggable(card);
            }

            return card;

        }


        
    }
} */
class Card {
    render(arg0, arg1, playerSprite, player) {
        throw new Error("Method not implemented.");
    }
    constructor(rank, suite) {
        this.value = rank;
        this.suite = suite;
        this.FrontImageSprite = suite + rank;
        this.BackImageSprite = 'CardBack';
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map