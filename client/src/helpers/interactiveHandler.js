"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cardSprite_1 = __importDefault(require("../model/cardSprite"));
/**
 * Interactive functionality for card game
 */
class InteractiveHandler {
    constructor(scene) {
        //deal cards on click
        scene.dealText.on('pointerdown', () => {
            scene.DeckHandler.dealCards();
            console.log("clicked deal", scene.currentPlayers);
            scene.socket.emit('dealCards', scene.currentPlayers.players);
        });
        //ready on click
        scene.readyText.on('pointerdown', () => {
            scene.socket.emit('ready');
        });
        //pass turn on click
        scene.passText.on('pointerdown', () => {
            scene.socket.emit('passTurn');
        });
        //make card active when dragging
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
        //move card while dragging
        scene.input.on('drag', function (pointer, cardSprite, dragX, dragY) {
            cardSprite.x = dragX;
            cardSprite.y = dragY;
        });
        //Handle selecting cards to play
        scene.input.on('gameobjectup', (pointer, gameObject) => {
            //only applies to cards clicked
            if (gameObject instanceof cardSprite_1.default) {
                //only applies to cards clicked for current player
                if (!gameObject.selected) {
                    gameObject.setTint(0xff69b4);
                    gameObject.y = gameObject.y - 25;
                    gameObject.selected = true;
                    scene.GameHandler.queuedCardsToPlay.addCard(gameObject.card); //add card to list of cards to play
                }
                else {
                    gameObject.setTint();
                    gameObject.y = gameObject.y + 25;
                    gameObject.selected = false;
                    scene.GameHandler.queuedCardsToPlay.removeCard(gameObject.card);
                }
            }
        });
        //play cards on click
        scene.playCardsText.on('pointerdown', () => {
            let cardsToPlay = scene.GameHandler.queuedCardsToPlay;
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready" /* gameState.Ready */ && scene.GameHandler.canPlay(cardsToPlay)) {
                cardsToPlay.cards.forEach(card => {
                    let cardSprite = scene.GameHandler.findSprite(scene, card);
                    cardSprite.x = (350) + (scene.currentPlayedCards.getNumberCards() * 50);
                    cardSprite.y = 375;
                });
                //scene.dropZone.data.values.cards++;
                //scene.input.setDraggable(cardSprite, false);
                //scene.socket.emit('cardPlayed', cardSprite.card, scene.socket.id);
            }
            else {
                alert("Unable to play these cards");
            }
        });
        //Card Played
        scene.input.on('drop', (pointer, cardSprite, dropZone) => {
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready" /* gameState.Ready */) {
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
        //hover for play text
        scene.playCardsText.on('pointerover', () => {
            scene.playCardsText.setColor('#ff69b4');
        });
        scene.playCardsText.on('pointerout', () => {
            scene.playCardsText.setColor('#00ffff');
        });
    }
    /**
  * Move card off of screen
  * @param scene
  * @param card
  */
    moveCard(scene, card) {
        scene.physics.moveTo(card, 0, 375, 500);
    }
}
exports.default = InteractiveHandler;
//# sourceMappingURL=interactiveHandler.js.map