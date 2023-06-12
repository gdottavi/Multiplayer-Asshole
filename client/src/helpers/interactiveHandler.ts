import { GameObjects, Input } from "phaser";
import Game from "../scenes/game";

export default class InteractiveHandler {

    constructor(scene: Game){

    scene.input.on('dragstart', function (pointer: Input.Pointer, gameObject: GameObjects.Sprite) {
        gameObject.setTint(0xff69b4);
        scene.children.bringToTop(gameObject);
    })

    scene.input.on('dragend', function (pointer: Input.Pointer, gameObject: GameObjects.Sprite, dropped: boolean) {
        gameObject.setTint();
        if (!dropped) {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        }
    })

    scene.input.on('drag', function (pointer: Input.Pointer, gameObject: GameObjects.Sprite, dragX: any, dragY: any) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    })

    scene.input.on('drop', function (pointer: Input.Pointer, gameObject: GameObjects.Sprite, dropZone: GameObjects.Zone) {
        dropZone.data.values.cards++;
        gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
        gameObject.y = dropZone.y;
        gameObject.disableInteractive();
        scene.socket.emit('cardPlayed', gameObject.texture.key, scene.isPlayerA);

    })

}
}