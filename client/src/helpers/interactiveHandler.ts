import { GameObjects, Input } from "phaser";
import Game from "../scenes/game";
import GameHandler, {gameState} from "./gameHandler";
import CardSprite from "../model/cardSprite";


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
    scene.input.on('drop', (pointer: Input.Pointer, cardSprite: CardSprite, dropZone: GameObjects.Zone) => {

        if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === gameState.Ready) {
            cardSprite.x = (dropZone.x - 350) + (dropZone.data.values.cards * 50);
            cardSprite.y = dropZone.y;
            scene.dropZone.data.values.cards++;
            scene.input.setDraggable(cardSprite, false);
            console.log('dropped ', cardSprite.card)
            scene.socket.emit('cardPlayed', cardSprite.card, scene.socket.id);
        }
        else {
            cardSprite.x = cardSprite.input.dragStartX;
            cardSprite.y = cardSprite.input.dragStartY;
        }
    })

    //hover for deal text
    scene.dealText.on('pointerover', () => {
        scene.dealText.setColor('#ff69b4');
    })
    scene.dealText.on('pointerout', () => {
        scene.dealText.setColor('#00ffff'); 
    })
      //hover for deal text
      scene.readyText.on('pointerover', () => {
        scene.readyText.setColor('#ff69b4');
    })
    scene.readyText.on('pointerout', () => {
        scene.readyText.setColor('#00ffff'); 
    })

}
}