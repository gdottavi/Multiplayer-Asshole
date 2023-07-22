"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertColorHexToNum = exports.createButton = exports.setHoverColor = exports.createToast = exports.setActiveText = exports.setInactiveText = exports.getAllPlayedCards = exports.findSprite = exports.removeSprite = exports.areLastXValuesEqual = exports.getCenterY = exports.getCenterX = void 0;
const cardSprite_1 = __importDefault(require("../model/cardSprite"));
const gameUIHandler_1 = require("../game_helpers/gameUIHandler");
/**
 *
 * @param scene
 * @returns horizontal center of scene
 */
function getCenterX(scene) {
    return scene.cameras.main.centerX;
}
exports.getCenterX = getCenterX;
/**
 *
 * @param scene
 * @returns vertical center of scene
 */
function getCenterY(scene) {
    return scene.cameras.main.centerY;
}
exports.getCenterY = getCenterY;
/**
 * Checks if last x elements in an array are equal
 * @param arr - array to check
 * @param x - number of elements from end to compare
 * @returns - true if last x elements of array (arr) are equal to each other
 */
function areLastXValuesEqual(arr, x) {
    if (arr.length < x) {
        return false;
    }
    const lastXValues = arr.slice(arr.length - x);
    // Check if all values in the lastXValues array are equal
    return lastXValues.every((value, index, array) => value.value === array[0].value);
}
exports.areLastXValuesEqual = areLastXValuesEqual;
/**
 * Find and remove sprite associated with a given card in a scene
 * @param scene  - scene to search
 * @param card - card associated with sprite
 */
function removeSprite(scene, card) {
    findSprite(scene, card).destroy(true);
}
exports.removeSprite = removeSprite;
/**
 * Find sprite associated with a given card object in the scene
 * @param scene - scene to search
 * @param card - card associated with sprite
 * @returns card sprite associated with card
 */
function findSprite(scene, card) {
    let sprite = scene.children.list.find(obj => {
        var _a;
        if (obj instanceof cardSprite_1.default) {
            return ((_a = obj === null || obj === void 0 ? void 0 : obj.card) === null || _a === void 0 ? void 0 : _a.key) === card.key;
        }
    });
    if (sprite instanceof cardSprite_1.default) {
        return sprite;
    }
    else {
        return null;
    }
}
exports.findSprite = findSprite;
/**
 * Gets single array from all played cards with is a deck of decks array.
 * @param playedCardsDeck - array of hands played to flatten
 * @returns - array of all cards in deck array
 */
function getAllPlayedCards(playedCardsDeck) {
    return playedCardsDeck.flatMap((deck) => deck.cards);
}
exports.getAllPlayedCards = getAllPlayedCards;
/**
    *
    * @param text - text to set inactive
    */
function setInactiveText(text) {
    text.setColor(gameUIHandler_1.themeColors.inactiveGray);
    text.setFontStyle('italic');
    text.disableInteractive();
}
exports.setInactiveText = setInactiveText;
/**
*
* @param text - test to set active
*/
function setActiveText(text) {
    text.setColor(gameUIHandler_1.themeColors.cyan);
    text.setFontStyle('normal');
    text.setInteractive();
}
exports.setActiveText = setActiveText;
/**
 * Creates a toast message in the scene
 * @param scene - scene to show toast in
 * @param message - message to show
 * @param duration - length to show message (in ms)
 * @param x - x position of toast.  Default is center.
 * @param y - y position of toast. Default is center
 */
function createToast(scene, message, duration = 3000, x, y) {
    const toast = scene.add.text(x !== undefined ? x : scene.cameras.main.centerX, y !== undefined ? y : scene.cameras.main.centerY, message, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: gameUIHandler_1.themeColors.yellow,
        backgroundColor: gameUIHandler_1.themeColors.inactiveGray,
        padding: {
            x: 20,
            y: 10
        },
    });
    toast.setOrigin(0.5);
    scene.tweens.add({
        targets: toast,
        alpha: 0,
        duration: duration,
        onComplete: () => {
            toast.destroy();
        }
    });
}
exports.createToast = createToast;
/**
 * Sets text object to change color on hover
 * @param text - text to set hover color for
 */
function setHoverColor(text) {
    text.on('pointerover', () => {
        text.setColor(gameUIHandler_1.themeColors.magenta);
    });
    text.on('pointerout', () => {
        text.setColor(gameUIHandler_1.themeColors.cyan);
    });
}
exports.setHoverColor = setHoverColor;
/**
 *
 * @param scene
 * @param x  - x pos
 * @param y  - y pos
 * @param text - text to display
 * @param color - text color.  Default is cyan or grey determined by active flag.
 * @param fontSize - font size
 * @param active - sets interactive
 * @param clickCallback - function to call on button click
 * @returns - button added to current scene
 */
function createButton(scene, x, y, text, color, fontSize = "32px", active, clickCallback) {
    let button = scene.add.text(x, y, text, {
        fontSize: fontSize,
        color: color
    })
        .setOrigin(0.5);
    if (active) {
        setActiveText(button);
        setHoverColor(button);
    }
    else
        setInactiveText(button);
    if (clickCallback) {
        button.on("pointerdown", clickCallback);
    }
    return button;
}
exports.createButton = createButton;
/**
 * converts string hex color code to phaser number code
 * @param hexColor - string hex color code
 * @returns phaser number color code
 */
function convertColorHexToNum(hexColor) {
    const color = Phaser.Display.Color.HexStringToColor(hexColor);
    const colorNumber = color.color;
    return colorNumber;
}
exports.convertColorHexToNum = convertColorHexToNum;
//# sourceMappingURL=utils.js.map