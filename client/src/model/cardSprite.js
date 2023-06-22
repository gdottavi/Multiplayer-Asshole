"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CardSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, card, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.card = card;
        this.selected = false;
        this.interactive = false;
    }
    create() {
        this.setVelocity(100, 200);
    }
}
exports.default = CardSprite;
//# sourceMappingURL=cardSprite.js.map