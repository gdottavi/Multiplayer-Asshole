"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardType = void 0;
//Playing Cards
var cardType;
(function (cardType) {
    cardType[cardType["player"] = 0] = "player";
    cardType[cardType["opponent"] = 1] = "opponent";
})(cardType || (exports.cardType = cardType = {}));
class Card {
    constructor(scene) {
        this.render = (x, y, image_key, card_type) => {
            let card = scene.add.image(x, y, image_key).setScale(0.3, 0.3).setInteractive().setData({
                "id": this.id,
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
exports.default = Card;
//# sourceMappingURL=card.js.map