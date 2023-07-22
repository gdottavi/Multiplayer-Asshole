import CardSprite from "../model/cardSprite";
import { themeColors } from "../game_helpers/gameUIHandler";
/**
 *
 * @param scene
 * @returns horizontal center of scene
 */
export function getCenterX(scene) {
    return scene.cameras.main.centerX;
}
/**
 *
 * @param scene
 * @returns vertical center of scene
 */
export function getCenterY(scene) {
    return scene.cameras.main.centerY;
}
/**
 * Checks if last x elements in an array are equal
 * @param arr - array to check
 * @param x - number of elements from end to compare
 * @returns - true if last x elements of array (arr) are equal to each other
 */
export function areLastXValuesEqual(arr, x) {
    if (arr.length < x) {
        return false;
    }
    const lastXValues = arr.slice(arr.length - x);
    // Check if all values in the lastXValues array are equal
    return lastXValues.every((value, index, array) => value.value === array[0].value);
}
/**
 * Find and remove sprite associated with a given card in a scene
 * @param scene  - scene to search
 * @param card - card associated with sprite
 */
export function removeSprite(scene, card) {
    findSprite(scene, card).destroy(true);
}
/**
 * Find sprite associated with a given card object in the scene
 * @param scene - scene to search
 * @param card - card associated with sprite
 * @returns card sprite associated with card
 */
export function findSprite(scene, card) {
    let sprite = scene.children.list.find(obj => {
        var _a;
        if (obj instanceof CardSprite) {
            return ((_a = obj === null || obj === void 0 ? void 0 : obj.card) === null || _a === void 0 ? void 0 : _a.key) === card.key;
        }
    });
    if (sprite instanceof CardSprite) {
        return sprite;
    }
    else {
        return null;
    }
}
/**
 * Gets single array from all played cards with is a deck of decks array.
 * @param playedCardsDeck - array of hands played to flatten
 * @returns - array of all cards in deck array
 */
export function getAllPlayedCards(playedCardsDeck) {
    return playedCardsDeck.flatMap((deck) => deck.cards);
}
/**
    *
    * @param text - text to set inactive
    */
export function setInactiveText(text) {
    text.setColor(themeColors.inactiveGray);
    text.setFontStyle('italic');
    text.disableInteractive();
}
/**
*
* @param text - test to set active
*/
export function setActiveText(text) {
    text.setColor(themeColors.cyan);
    text.setFontStyle('normal');
    text.setInteractive();
}
/**
 * Creates a toast message in the scene
 * @param scene - scene to show toast in
 * @param message - message to show
 * @param duration - length to show message (in ms)
 * @param x - x position of toast.  Default is center.
 * @param y - y position of toast. Default is center
 */
export function createToast(scene, message, duration = 3000, x, y) {
    const toast = scene.add.text(x !== undefined ? x : scene.cameras.main.centerX, y !== undefined ? y : scene.cameras.main.centerY, message, {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: themeColors.yellow,
        backgroundColor: themeColors.inactiveGray,
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
/**
 * Sets text object to change color on hover
 * @param text - text to set hover color for
 */
export function setHoverColor(text) {
    text.on('pointerover', () => {
        text.setColor(themeColors.magenta);
    });
    text.on('pointerout', () => {
        text.setColor(themeColors.cyan);
    });
}
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
export function createButton(scene, x, y, text, color, fontSize = "32px", active, clickCallback) {
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
/**
 * converts string hex color code to phaser number code
 * @param hexColor - string hex color code
 * @returns phaser number color code
 */
export function convertColorHexToNum(hexColor) {
    const color = Phaser.Display.Color.HexStringToColor(hexColor);
    const colorNumber = color.color;
    return colorNumber;
}
//# sourceMappingURL=utils.js.map