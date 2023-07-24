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
Object.defineProperty(exports, "__esModule", { value: true });
exports.opponentStartXPos = exports.currPlayerYPos = exports.currPlayerXPos = exports.themeColors = void 0;
const utils_1 = require("../utils/utils");
var themeColors;
(function (themeColors) {
    themeColors["black"] = "#000000";
    themeColors["cyan"] = "#00ffff";
    themeColors["blue"] = "#3343A7";
    themeColors["magenta"] = "#ff69b4";
    themeColors["yellow"] = "#ffff00";
    themeColors["inactiveGray"] = "#888888";
    themeColors["white"] = "#ffffff";
})(themeColors || (exports.themeColors = themeColors = {}));
exports.currPlayerXPos = 150;
exports.currPlayerYPos = 575;
exports.opponentStartXPos = 50;
const playZoneWidth = 900;
const playZoneHeight = 200;
/**
 * Basic layout and UI for game
 */
class GameUIHandler {
    constructor(scene) {
        this.scene = scene;
        // Create drop zone for cards in the middle
        scene.dropZone = scene.add.zone((0, utils_1.getCenterX)(scene), (0, utils_1.getCenterY)(scene), playZoneWidth, playZoneHeight).setRectangleDropZone(playZoneWidth, playZoneHeight);
        let dropZoneOutline = scene.add.graphics();
        dropZoneOutline.lineStyle(4, (0, utils_1.convertColorHexToNum)(themeColors.magenta));
        dropZoneOutline.strokeRect((0, utils_1.getCenterX)(scene) - playZoneWidth / 2, (0, utils_1.getCenterY)(scene) - playZoneHeight / 2, playZoneWidth, playZoneHeight);
        this.setupButtons();
        this.setPlayerNames();
    }
    /**
     * setup for all interactive text buttons in game
     */
    setupButtons() {
        // Get the center of the drop zone
        const dropZoneCenterX = this.scene.dropZone.x;
        const dropZoneCenterY = this.scene.dropZone.y;
        // Calculate the vertical position for the buttons based on the drop zone center
        const verticalOffset = 25;
        const dealTextY = dropZoneCenterY - verticalOffset;
        const resetTextY = dropZoneCenterY + verticalOffset;
        // Calculate the horizontal position for the buttons based on the drop zone center and width
        const horizontalOffset = playZoneWidth / 2 + 125; // Adjust the offset as needed
        const dealTextX = dropZoneCenterX - horizontalOffset;
        const resetTextX = dropZoneCenterX - horizontalOffset;
        this.scene.dealText = this.scene.add.text(dealTextX, dealTextY, ['Deal Cards']).setFontSize(18).setFontFamily('Trebuchet MS');
        (0, utils_1.setActiveText)(this.scene.dealText);
        this.scene.resetText = this.scene.add.text(resetTextX, resetTextY, ['New Game']).setFontSize(18).setFontFamily('Trebuchet MS');
        (0, utils_1.setActiveText)(this.scene.resetText);
        //Player Options
        this.scene.passText = this.scene.add.text(exports.currPlayerXPos - 125, this.getCurrPlayerYPos() + 40, ['Pass Turn']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan);
        (0, utils_1.setInactiveText)(this.scene.passText);
        this.scene.sortCardsText = this.scene.add.text(exports.currPlayerXPos - 125, this.getCurrPlayerYPos() + 70, ['Sort Cards']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan);
        (0, utils_1.setInactiveText)(this.scene.sortCardsText);
    }
    /**
     * Sets initial player names on board
     */
    setPlayerNames() {
        //display initial players names in game
        let opponentPos = 0;
        this.scene.currentPlayers.players.forEach(player => {
            //current player
            if (this.scene.socket.id === player.socketId) {
                this.scene.add.text(exports.currPlayerXPos, this.getCurrPlayerYPos(), [player.getDisplayName()]).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.white).setData('id', player.socketId).setData('type', 'playerName');
            }
            else {
                this.scene.add.text(exports.opponentStartXPos + (opponentPos * 250), 25, [player.getDisplayName()]).setFontSize(16).setFontFamily('Trebuchet MS').setColor(themeColors.white).setData('id', player.socketId).setData('type', 'playerName');
                opponentPos++;
            }
        });
    }
    /**
     *
     * @returns current player Y position
     */
    getCurrPlayerYPos() {
        const dropZoneCenterY = this.scene.dropZone.y;
        const dropZoneHeight = playZoneHeight;
        const verticalOffset = 100;
        return dropZoneCenterY + dropZoneHeight / 2 + verticalOffset;
    }
    /**
     * Updates color of player name.  Will default to cyan if player in game.
     * @param scene
     * @param player - player name to update
     * @param color - color to update name to
     */
    updatePlayerNameColor(scene, player, color) {
        return __awaiter(this, void 0, void 0, function* () {
            let socketId = player.socketId;
            scene.children.each((child) => {
                if (child instanceof Phaser.GameObjects.Text && child.getData('type') === 'playerName') {
                    if (child.getData('id') === socketId)
                        child.setColor(color);
                }
            });
            return Promise.resolve();
        });
    }
}
exports.default = GameUIHandler;
//# sourceMappingURL=gameUIHandler.js.map