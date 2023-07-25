"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cardSprite_1 = __importDefault(require("../model/cardSprite"));
const player_1 = require("../model/player");
const utils_1 = require("../utils/utils");
const OFFSET_X = 20;
/**
 * Interactive functionality for card game
 */
class InteractiveHandler {
    constructor(scene) {
        let shouldAddToSelected = true; //used to make sure after a drop the click event doesn't re-add cards to play and drag
        //deal cards on click
        scene.dealText.on('pointerdown', () => __awaiter(this, void 0, void 0, function* () {
            yield scene.DeckHandler.dealCards();
            const currentPlayers = scene.currentPlayers.players.map(playerData => player_1.Player.serialize(playerData));
            scene.socket.emit('dealCards', currentPlayers);
        }));
        //reset on click
        scene.resetText.on('pointerdown', () => {
            scene.socket.emit('reset');
        });
        //pass turn on click
        scene.passText.on('pointerdown', () => __awaiter(this, void 0, void 0, function* () {
            const nextPlayer = yield scene.GameTurnHandler.getNextTurnPlayer(scene, null, true);
            const currentPlayer = scene.currentPlayers.getPlayerById(scene.socket.id);
            scene.socket.emit('passTurn', currentPlayer, nextPlayer);
        }));
        //sort cards on click
        scene.sortCardsText.on('pointerdown', () => {
            const currentPlayer = scene.currentPlayers.getPlayerById(scene.socket.id);
            currentPlayer.cardHand.sortDeck();
            scene.DeckHandler.redisplayHand(currentPlayer.cardHand);
        });
        //make card active when dragging - not used
        scene.input.on('dragstart', function (pointer, gameObject) {
        });
        //finished dragging
        scene.input.on('dragend', function (pointer, gameObject, dropped) {
            //if not dropped in drop zone send back to starting positions
            if (!dropped) {
                scene.selectedCardSprites.forEach(sprite => {
                    sprite.x = sprite.getData('dragStartX');
                    sprite.y = sprite.getData('dragStartY');
                    scene.children.bringToTop(sprite);
                });
            }
        });
        //move card while dragging
        scene.input.on('drag', function (pointer, cardSprite, dragX, dragY) {
            scene.selectedCardSprites.forEach((sprite, i) => {
                sprite.x = dragX + i * OFFSET_X;
                sprite.y = dragY;
            });
        });
        //click up on card
        scene.input.on('gameobjectup', (pointer, gameObject) => {
            if (gameObject instanceof cardSprite_1.default) {
                scene.input.setDraggable(gameObject);
                const isSelected = scene.selectedCardSprites.some(sprite => sprite === gameObject);
                let index = scene.selectedCardSprites.indexOf(gameObject);
                //select card for dragging
                if (!isSelected && shouldAddToSelected) {
                    //set start points for returning if not dragged to middle
                    gameObject.setData('dragStartX', gameObject.x);
                    gameObject.setData('dragStartY', gameObject.y);
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
        });
        //Card Played
        scene.input.on('drop', (pointer, sprite, dropZone) => __awaiter(this, void 0, void 0, function* () {
            //array of cards from sprites
            const cardsTryPlayed = scene.selectedCardSprites.map(sprite => sprite.card);
            let cardsPlayed = [];
            //card dropped in the play zone 
            if (scene.GameRuleHandler.canPlay(cardsTryPlayed)) {
                const currentPlayer = scene.currentPlayers.getPlayerById(scene.socket.id);
                scene.selectedCardSprites.forEach((cardSprite, i) => {
                    //set position offset by number currently played in middle
                    cardSprite.x = (dropZone.x - dropZone.width / 2 + 100) + ((scene.GameRuleHandler.getTotalCountCardsPlayed() + (i + 1)) * 50);
                    cardSprite.y = dropZone.y;
                    //disable the card from being dragged again after play
                    scene.input.setDraggable(cardSprite, false);
                    cardSprite.clearTint();
                    scene.children.bringToTop(cardSprite);
                    //add to currently played cards
                    cardsPlayed.push(cardSprite.card);
                    //remove from players hand 
                    currentPlayer === null || currentPlayer === void 0 ? void 0 : currentPlayer.removeCard(cardSprite.card);
                });
                let nextPlayer = yield scene.GameTurnHandler.getNextTurnPlayer(scene, cardsPlayed);
                scene.socket.emit('playCards', cardsPlayed, scene.socket.id, scene.GameTurnHandler.shouldClear, currentPlayer, nextPlayer);
            }
            //if unable to play cards return each to start position
            else {
                scene.selectedCardSprites.forEach((cardSprite) => {
                    cardSprite.x = cardSprite.getData('dragStartX');
                    cardSprite.y = cardSprite.getData('dragStartY');
                    cardSprite.clearTint();
                    scene.children.bringToTop(cardSprite);
                });
            }
            scene.selectedCardSprites = [];
            shouldAddToSelected = false;
        }));
        this.setupMenuOptions(scene);
    }
    /**
     * sets up all menus to change color on hover
     * @param scene
     */
    setupMenuOptions(scene) {
        (0, utils_1.setHoverColor)(scene.dealText);
        (0, utils_1.setHoverColor)(scene.resetText);
        (0, utils_1.setHoverColor)(scene.passText);
        (0, utils_1.setHoverColor)(scene.sortCardsText);
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
//# sourceMappingURL=gameInteractiveHandler.js.map