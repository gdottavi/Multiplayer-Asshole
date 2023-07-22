"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardHeight = exports.cardWidth = void 0;
exports.cardWidth = 655;
exports.cardHeight = 930;
class CardSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, card, x, y, texture, frame, scale) {
        super(scene, x, y, texture, frame);
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.card = card;
        this.selected = false;
        this.interactive = false;
        // Store the initial position for reference
        this.startPosition = { x, y };
    }
    create() {
        this.setVelocity(100, 200);
    }
}
exports.default = CardSprite;
//# sourceMappingURL=cardSprite.js.map