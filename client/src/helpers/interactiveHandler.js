"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Interactive functionality for card game
 */
class InteractiveHandler {
    constructor(scene) {
        //deal cards on click
        scene.dealText.on('pointerdown', () => {
            scene.socket.emit('dealCards', scene.socket.id);
        });
        //ready on click
        scene.readyText.on('pointerdown', () => {
            scene.socket.emit('ready');
        });
        scene.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xff69b4);
            scene.children.bringToTop(gameObject);
        });
        scene.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        });
        scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        //Card Played
        scene.input.on('drop', (pointer, cardSprite, dropZone) => {
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready" /* gameState.Ready */ && scene.GameHandler.canPlay(cardSprite.card)) {
                cardSprite.x = (dropZone.x - 350) + (scene.currentPlayedCards.getNumberCards() * 50);
                cardSprite.y = dropZone.y;
                scene.dropZone.data.values.cards++;
                scene.input.setDraggable(cardSprite, false);
                scene.socket.emit('cardPlayed', cardSprite.card, scene.socket.id);
            }
            else {
                cardSprite.x = cardSprite.input.dragStartX;
                cardSprite.y = cardSprite.input.dragStartY;
            }
        });
        this.setupMenuOptions(scene);
    }
    setupMenuOptions(scene) {
        //hover for deal text
        scene.dealText.on('pointerover', () => {
            scene.dealText.setColor('#ff69b4');
        });
        scene.dealText.on('pointerout', () => {
            scene.dealText.setColor('#00ffff');
        });
        //hover for deal text
        scene.readyText.on('pointerover', () => {
            scene.readyText.setColor('#ff69b4');
        });
        scene.readyText.on('pointerout', () => {
            scene.readyText.setColor('#00ffff');
        });
    }
}
exports.default = InteractiveHandler;
//# sourceMappingURL=interactiveHandler.js.map