import { GameObjects, Input, Events } from "phaser";
import Game from "../scenes/game";
import GameHandler, { gameState } from "./gameHandler";
import CardSprite from "../model/cardSprite";
import { Player } from "../model/player";

const OFFSET_X = 5;


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
        })

        //pass turn on click
        scene.passText.on('pointerdown', () => {
            scene.socket.emit('passTurn');
        })
/* 
        //make card active when dragging
        scene.input.on('dragstart', function (pointer: Input.Pointer, gameObject: GameObjects.Sprite) {

            const isSelected = scene.selectedCardSprites.some(sprite => sprite === gameObject)

            if (!isSelected) {
                gameObject.setTint(0xff69b4);
                scene.children.bringToTop(gameObject);
                scene.selectedCardSprites.push(gameObject);

            }

        }) */

        //finished dragging
        scene.input.on('dragend', function (pointer: Input.Pointer, gameObject: GameObjects.Sprite, dropped: boolean) {

            if (!dropped) {
                scene.selectedCardSprites.forEach(sprite => {
                    //sprite.clearTint()
                    sprite.x = sprite.input.dragStartX;
                    sprite.y = sprite.input.dragStartY;
                })
            }
            /*      scene.selectedCardSprites.forEach(sprite => {
                     sprite.clearTint()
                 }) */
            //scene.selectedCardSprites = []

        })
        //move card while dragging
        scene.input.on('drag', function (pointer: Input.Pointer, cardSprite: CardSprite, dragX: any, dragY: any) {

            scene.selectedCardSprites.forEach((sprite, i) => {
                sprite.x = dragX + 1 * OFFSET_X;
                sprite.y = dragY;
            })
            //cardSprite.x = dragX;
            //cardSprite.y = dragY;
        })



        // Listen for keydown and keyup events to track the state of the Ctrl key
        scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {

            if (event.ctrlKey || event.metaKey) {
                // Ctrl key is pressed
                ctrlKeyHeld = true;
            }
        });
        scene.input.keyboard.on('keyup', (event: KeyboardEvent) => {

            if (event.ctrlKey || event.metaKey) {
                // Ctrl key is pressed
                ctrlKeyHeld = false;
            }
        });




        //click up on card
        scene.input.on('gameobjectup', (pointer: Input.Pointer, gameObject: GameObjects.Sprite) => {

            if (gameObject instanceof CardSprite) {

                const isSelected = scene.selectedCardSprites.some(sprite => sprite === gameObject)
                let index = scene.selectedCardSprites.indexOf(gameObject);

                if (!isSelected && shouldAddToSelected && ctrlKeyHeld) {
                    scene.selectedCardSprites.push(gameObject);
                    gameObject.setTint(0xff69b4);
                    scene.children.bringToTop(gameObject);
                }
                else if (!shouldAddToSelected && isSelected && ctrlKeyHeld) {
                    scene.selectedCardSprites.splice(index, 1);
                    gameObject.clearTint();
                }

            }

            shouldAddToSelected = true;
        })




        //Card Played
        scene.input.on('drop', (pointer: Input.Pointer, cardSprite: CardSprite, dropZone: GameObjects.Zone) => {

            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === gameState.Ready) {
                cardSprite.x = (dropZone.x - 350) + (scene.currentPlayedCards.getNumberCards() * 50);
                cardSprite.y = dropZone.y;
                scene.input.setDraggable(cardSprite, false);
                scene.socket.emit('cardPlayed', cardSprite.card, scene.socket.id);
            }
            else {
                cardSprite.x = cardSprite.input.dragStartX;
                cardSprite.y = cardSprite.input.dragStartY;
            }
            scene.selectedCardSprites.forEach(sprite => {
                sprite.clearTint()
            }
            )
            scene.selectedCardSprites = []
            shouldAddToSelected = false;

            //set played cards
            //scene.currentPlayedCards.addCard(card);
            //TODO set players remaining cards

            //let currentPlayer = scene.currentPlayers.getPlayerById(scene.socket.id)
            //currentPlayer.removeCard(card);

            //TODO let other clients know the cards that were played
            //scene.socket.emit('cardPlayed', card, scene.socket.id);
        })


        this.setupMenuOptions(scene);

        /* //play cards on click
        scene.playCardsText.on('pointerdown', () => {

            let cardsToPlay = scene.GameHandler.queuedCardsToPlay;

            if (!scene.GameHandler.isMyTurn) {
                alert("It's not your turn idiot");
                return;
            }

            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === gameState.Ready && scene.GameHandler.canPlay(cardsToPlay)) {

                cardsToPlay.cards.forEach(card => {

                    //move the sprite to the middle
                    let cardSprite = scene.GameHandler.findSprite(scene, card);
                    cardSprite.x = (350) + (scene.currentPlayedCards.getNumberCards() * 50);
                    cardSprite.y = 375;
                    //set properties on card in the middle
                    cardSprite.disableInteractive();
                    cardSprite.setTint();

                    //set played cards
                    scene.currentPlayedCards.addCard(card);
                    //TODO set players remaining cards

                    let currentPlayer = scene.currentPlayers.getPlayerById(scene.socket.id)
                    currentPlayer.removeCard(card);

                    //TODO let other clients know the cards that were played
                    scene.socket.emit('cardPlayed', card, scene.socket.id);
                })


            }
            else {
                alert("Unable to play these cards")
            }
        })
 */

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

        //hover for play text
        scene.playCardsText.on('pointerover', () => {
            scene.playCardsText.setColor('#ff69b4');
        })
        scene.playCardsText.on('pointerout', () => {
            scene.playCardsText.setColor('#00ffff');
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