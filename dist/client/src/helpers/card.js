"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Playing Cards
class Card {
    constructor(scene) {
        this.render = (x, y, image_key) => {
            let card = scene.add.image(x, y, image_key).setScale(0.3, 0.3).setInteractive();
            scene.input.setDraggable(card);
            return card;
        };
    }
}
exports.default = Card;
//# sourceMappingURL=card.js.map