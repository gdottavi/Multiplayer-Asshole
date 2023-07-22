export const cardWidth = 655;
export const cardHeight = 930;
export default class CardSprite extends Phaser.Physics.Arcade.Sprite {
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
//# sourceMappingURL=cardSprite.js.map