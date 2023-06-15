"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CardSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, card, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        this.card = card;
        scene.add.existing(this);
    }
}
exports.default = CardSprite;
//# sourceMappingURL=cardSprite.js.map