import { GameObjects, Input } from "phaser";
import Game from "../scenes/game";
import GameHandler, {gameState} from "./gameHandler";


/**
 * Interactive functionality for card game
 */
export default class InteractiveHandler {

    constructor(scene: Game){
    
    //deal cards on click
    scene.dealText.on('pointerdown', () =>  {
            scene.socket.emit('dealCards', scene.socket.id); 
    })

    //ready on click
    scene.readyText.on('pointerdown', () => {
        scene.socket.emit('ready')
    })

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

    //Card Played
    scene.input.on('drop', (pointer: Input.Pointer, gameObject: GameObjects.Sprite, dropZone: GameObjects.Zone) => {
        if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === gameState.Ready) {
            gameObject.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            gameObject.y = dropZone.y;
            scene.dropZone.data.values.cards++;
            scene.input.setDraggable(gameObject, false);
            scene.socket.emit('cardPlayed', gameObject.texture.key, scene.socket.id);
        }
        else {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        }
    })

    //hover for deal text
    scene.dealText.on('pointerover', () => {
        scene.dealText.setColor('#ff69b4');
    })
    scene.dealText.on('pointerout', () => {
        scene.dealText.setColor('#00ffff'); 
    })

}
}