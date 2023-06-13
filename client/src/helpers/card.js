//Playing Cards
export var cardType;
(function (cardType) {
    cardType[cardType["player"] = 0] = "player";
    cardType[cardType["opponent"] = 1] = "opponent";
})(cardType || (cardType = {}));
export var suites;
(function (suites) {
    suites[suites["hearts"] = 0] = "hearts";
    suites[suites["diamonds"] = 1] = "diamonds";
    suites[suites["spades"] = 2] = "spades";
    suites[suites["clubs"] = 3] = "clubs";
})(suites || (suites = {}));
export var values;
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
})(values || (values = {}));
export default class Card {
    constructor(scene) {
        this.render = (x, y, image_key, card_type, suite, value) => {
            let card = scene.add.image(x, y, image_key).setScale(0.3, 0.3).setInteractive().setData({
                "id": this.id,
                "suite": suite,
                "value": value,
                "type": card_type,
                "sprite": image_key
            });
            if (card_type === cardType.player) {
                scene.input.setDraggable(card);
            }
            return card;
        };
    }
}
//# sourceMappingURL=card.js.map