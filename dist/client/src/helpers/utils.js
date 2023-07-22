"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cardSprite_1 = __importDefault(require("../model/cardSprite"));
const uiHandler_1 = require("./uiHandler");
class Utils {
    /**
     * checks if last x elements in an array are equal
     * @param arr - array to check
     * @param x - number of elements from end to compare
     * @returns - true if last x elements of array (arr) are equal to each other
     */
    areLastXValuesEqual(arr, x) {
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
    removeSprite(scene, card) {
        this.findSprite(scene, card).destroy(true);
    }
    /**
     * Find sprite associated with a given card object in the scene
     * @param scene - scene to searc
     * @param card - card associated with sprite
     * @returns card sprite associated with card
     */
    findSprite(scene, card) {
        let sprite = scene.children.list.find(obj => {
            var _a;
            if (obj instanceof cardSprite_1.default) {
                return ((_a = obj === null || obj === void 0 ? void 0 : obj.card) === null || _a === void 0 ? void 0 : _a.key) === card.key;
            }
        });
        if (sprite instanceof cardSprite_1.default) {
            return sprite;
        }
        else
            return null;
    }
    /**
    * Gets single array from all played cards with is a deck of decks array.
    * @param playedCardsDeck - array of hands played to flatten
    * @returns - array of all cards in deck array
    */
    getAllPlayedCards(playedCardsDeck) {
        return playedCardsDeck.flatMap((deck) => deck.cards);
    }
    /**
     *
     * @param scene - scene to show toast in
     * @param x - x position of toast
     * @param y - y position of toast
     * @param message - message to show
     * @param duration - length to show message (in ms)
     */
    createToast(scene, message, duration = 3000, x, y) {
        const toast = scene.add.text(x !== undefined ? x : scene.cameras.main.centerX, y !== undefined ? y : scene.cameras.main.centerY, message, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: uiHandler_1.themeColors.yellow,
            backgroundColor: uiHandler_1.themeColors.inactiveGray,
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
}
exports.default = Utils;
//# sourceMappingURL=utils.js.map