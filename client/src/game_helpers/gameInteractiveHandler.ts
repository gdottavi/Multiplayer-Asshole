import { GameObjects, Input, Events } from "phaser";
import Game, { soundKeys } from "../scenes/game";
import CardSprite from "../model/cardSprite";
import { Player } from "../model/player";
import { setHoverColor } from "../utils/utils";


const OFFSET_X = 20;


/**
 * Interactive functionality for card game
 */
export default class InteractiveHandler {

    constructor(scene: Game) {

        let shouldAddToSelected = true;  //used to make sure after a drop the click event doesn't re-add cards to play and drag

        //deal cards on click
        scene.dealText.on('pointerdown', async () => {
            await scene.DeckHandler.dealCards();
            const currentPlayers = scene.currentPlayers.players.map(playerData => Player.serialize(playerData));
            scene.socket.emit('dealCards', currentPlayers);
        })


        //reset on click
        scene.resetText.on('pointerdown', () => {
            scene.socket.emit('reset')
        })

        //pass turn on click
        scene.passText.on('pointerdown', async () => {
            const nextPlayer = await scene.GameTurnHandler.getNextTurnPlayer(scene, null, true)
            const currentPlayer = scene.currentPlayers.getPlayerById(scene.socket.id);
            scene.socket.emit('passTurn', currentPlayer, nextPlayer);
        })

        //sort cards on click
        scene.sortCardsText.on('pointerdown', () => {
            const currentPlayer = scene.currentPlayers.getPlayerById(scene.socket.id);
            currentPlayer.cardHand.sortDeck(); 
            scene.DeckHandler.redisplayHand(currentPlayer.cardHand)
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
                    scene.children.bringToTop(sprite)
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
                    gameObject.setData('dragStartX', gameObject.x);
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
                }


            }

            shouldAddToSelected = true;
        })




        //Card Played
        scene.input.on('drop', async (pointer: Input.Pointer, sprite: CardSprite, dropZone: GameObjects.Zone) => {

            //array of cards from sprites
            const cardsTryPlayed = scene.selectedCardSprites.map(sprite => sprite.card);
            let cardsPlayed = [];

            //card dropped in the play zone 
            if (scene.GameRuleHandler.canPlay(cardsTryPlayed)) {

                const currentPlayer = scene.currentPlayers.getPlayerById(scene.socket.id)

                scene.selectedCardSprites.forEach((cardSprite, i) => {
                    //set position offset by number currently played in middle
                    cardSprite.x = (dropZone.x - 350) + ((scene.GameRuleHandler.getTotalCountCardsPlayed() + (i + 1)) * 50);
                    cardSprite.y = dropZone.y;
                    //disable the card from being dragged again after play
                    scene.input.setDraggable(cardSprite, false);
                    cardSprite.clearTint()
                    scene.children.bringToTop(cardSprite); 
                    //add to currently played cards
                    cardsPlayed.push(cardSprite.card);
                    //remove from players hand 
                    currentPlayer?.removeCard(cardSprite.card);
                })

                let nextPlayer = await scene.GameTurnHandler.getNextTurnPlayer(scene, cardsPlayed)
                scene.socket.emit('playCards', cardsPlayed, scene.socket.id, scene.GameTurnHandler.shouldClear, currentPlayer, nextPlayer)              

            }
            //if unable to play cards return each to start position
            else {
                scene.selectedCardSprites.forEach((cardSprite) => {
                    cardSprite.x = cardSprite.getData('dragStartX');
                    cardSprite.y = cardSprite.getData('dragStartY');
                    cardSprite.clearTint()
                    scene.children.bringToTop(cardSprite); 
                })
            }
            scene.selectedCardSprites = []
            shouldAddToSelected = false;
        })


        this.setupMenuOptions(scene);


    }


    /**
     * sets up all menus to change color on hover
     * @param scene 
     */
    setupMenuOptions(scene: Game): void {   
        setHoverColor(scene.dealText);
        setHoverColor(scene.resetText);
        setHoverColor(scene.passText);
        setHoverColor(scene.sortCardsText);
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