import { GameObjects, Input, Events } from "phaser";
import Game, { soundKeys } from "../scenes/game";
import GameHandler, { gameStateEnum } from "./gameHandler";
import CardSprite from "../model/cardSprite";
import { Player } from "../model/player";
import { Deck } from "../model/deck";

const OFFSET_X = 20;


/**
 * Interactive functionality for card game
 */
export default class InteractiveHandler {



    constructor(scene: Game) {

        let shouldAddToSelected = true;  //used to make sure after a drop the click event doesn't re-add cards to play and drag
        // Define a flag to track whether the Ctrl key is held down
        let ctrlKeyHeld = false;

        //deal cards on click
        scene.dealText.on('pointerdown', () => {
            scene.DeckHandler.dealCards()
            scene.socket.emit('dealCards', scene.currentPlayers.players);
        })

        //ready on click
        scene.readyText.on('pointerdown', () => {
            scene.socket.emit('ready')
            scene.playSound(soundKeys.crackBeer); 
        })

        //pass turn on click
        scene.passText.on('pointerdown', () => {
            scene.socket.emit('passTurn');
        })

        //make card active when dragging - not used
        scene.input.on('dragstart', function (pointer: Input.Pointer, gameObject: GameObjects.Sprite) {


        })

        //finished dragging
        scene.input.on('dragend', function (pointer: Input.Pointer, gameObject: GameObjects.Sprite, dropped: boolean) {
            //if not dropped in drop zone send back to starting positions
            if (!dropped) {
                scene.selectedCardSprites.forEach(sprite => {
                    sprite.x = sprite.getData('dragStartX');
                    sprite.y = sprite.getData('dragStartY');
                })
            }

        })


        //move card while dragging
        scene.input.on('drag', function (pointer: Input.Pointer, cardSprite: CardSprite, dragX: any, dragY: any) {

            scene.selectedCardSprites.forEach((sprite, i) => {
                sprite.x = dragX + i * OFFSET_X;
                sprite.y = dragY;
            })
        })



        //click up on card
        scene.input.on('gameobjectup', (pointer: Input.Pointer, gameObject: GameObjects.Sprite) => {

            if (gameObject instanceof CardSprite) {

                scene.input.setDraggable(gameObject);

                const isSelected = scene.selectedCardSprites.some(sprite => sprite === gameObject)
                let index = scene.selectedCardSprites.indexOf(gameObject);

                //select card for dragging
                if (!isSelected && shouldAddToSelected) {
                    //set start points for returning if not dragged to middle
                    gameObject.setData('dragStartX', gameObject.x)
                    gameObject.setData('dragStartY', gameObject.y)
                    //add to selected and show as selected
                    scene.selectedCardSprites.push(gameObject);
                    gameObject.setTint(0xff69b4);
                    scene.children.bringToTop(gameObject);
                }
                //unselect card if clicked a second time
                else if (isSelected) {
                    scene.selectedCardSprites.splice(index, 1);
                    gameObject.clearTint();
                    scene.children.sendToBack(gameObject);
                }

            }

            shouldAddToSelected = true;
        })




        //Card Played
        scene.input.on('drop', (pointer: Input.Pointer, sprite: CardSprite, dropZone: GameObjects.Zone) => {

            //array of cards from sprites
            const cardsTryPlayed = scene.selectedCardSprites.map(sprite => sprite.card); 
            let cardsPlayed = []; 

            //card dropped in the play zone
            if (scene.GameHandler.canPlay(scene, cardsTryPlayed)) {

                scene.selectedCardSprites.forEach((cardSprite, i) => {
                    //set position offset by number currently played in middle
                    cardSprite.x = (dropZone.x - 350) + ((scene.GameHandler.getTotalCountCardsPlayed(scene)+(i+1)) * 50);
                    cardSprite.y = dropZone.y;
                    //disable the card from being dragged again after play
                    scene.input.setDraggable(cardSprite, false);
                    //add to currently played cards
                    cardsPlayed.push(cardSprite.card);
                    //remove from players hand
                    scene.currentPlayers.getPlayerById(scene.socket.id)?.removeCard(cardSprite.card);
                })
                scene.socket.emit('playCards', cardsPlayed, scene.socket.id)
                let nextPlayer = scene.GameHandler.getNextTurnPlayer(scene, cardsPlayed) 
                //advance turn and clear cards if appropriate
                scene.socket.emit('changeTurn', nextPlayer, scene.GameHandler.shouldClear); 

            }
            else {
                scene.selectedCardSprites.forEach((cardSprite) => {
                    cardSprite.x = cardSprite.input.dragStartX;
                    cardSprite.y = cardSprite.input.dragStartY;
                })
            }
            scene.selectedCardSprites.forEach(sprite => {
                sprite.clearTint()
            }
            )
            scene.selectedCardSprites = []
            shouldAddToSelected = false;
        })


        this.setupMenuOptions(scene);


    }


    /**
     * sets up all menus
     * @param scene 
     */
    setupMenuOptions(scene: Game): void {
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

    /**
  * Move card off of screen
  * @param scene 
  * @param card 
  */
    moveCard(scene: Game, card: CardSprite): void {
        scene.physics.moveTo(card, 0, 375, 500)
    }
}