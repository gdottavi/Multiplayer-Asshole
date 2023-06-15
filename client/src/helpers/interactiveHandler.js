/**
 * Interactive functionality for card game
 */
export default class InteractiveHandler {
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
        scene.input.on('drop', (pointer, card, dropZone) => {
            console.log("is my turn: ", scene.GameHandler.isMyTurn);
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready" /* gameState.Ready */) {
                card.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
                card.y = dropZone.y;
                scene.dropZone.data.values.cards++;
                scene.input.setDraggable(card, false);
                console.log('dropped ', card);
                scene.socket.emit('cardPlayed', card, scene.socket.id);
            }
            else {
                card.x = card.input.dragStartX;
                card.y = card.input.dragStartY;
            }
        });
        //hover for deal text
        scene.dealText.on('pointerover', () => {
            scene.dealText.setColor('#ff69b4');
        });
        scene.dealText.on('pointerout', () => {
            scene.dealText.setColor('#00ffff');
        });
        //hover for deal text
        scene.readyText.on('pointerover', () => {
            scene.dealText.setColor('#ff69b4');
        });
        scene.readyText.on('pointerout', () => {
            scene.dealText.setColor('#00ffff');
        });
    }
}
//# sourceMappingURL=interactiveHandler.js.map