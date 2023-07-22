var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setInactiveText } from "../utils/utils";
export var themeColors;
(function (themeColors) {
    themeColors["black"] = "#000000";
    themeColors["cyan"] = "#00ffff";
    themeColors["magenta"] = "#ff69b4";
    themeColors["yellow"] = "#ffff00";
    themeColors["inactiveGray"] = "#888888";
})(themeColors || (themeColors = {}));
/**
 * Basic layout and UI for game
 */
export default class UIHandler {
    constructor(scene) {
        //Create drop zone for cards
        scene.dropZone = scene.add.zone(700, 375, 900, 250).setRectangleDropZone(900, 250);
        let dropZoneOutline = scene.add.graphics();
        dropZoneOutline.lineStyle(4, 0xff69b4);
        dropZoneOutline.strokeRect(scene.dropZone.x - scene.dropZone.input.hitArea.width / 2, scene.dropZone.y - scene.dropZone.input.hitArea.height / 2, scene.dropZone.input.hitArea.width, scene.dropZone.input.hitArea.height);
        /*  //Create current player card zone - TODO
         scene.currentPlayerZone = scene.add.zone(650, 625, 1250, 150).setRectangleDropZone(1250, 150);
         let currentPlayerZoneOutline = scene.add.graphics();
         currentPlayerZoneOutline.lineStyle(4, 0xff69b4);
         currentPlayerZoneOutline.strokeRect(scene.currentPlayerZone.x - scene.currentPlayerZone.input.hitArea.width / 2,
             scene.currentPlayerZone.y - scene.currentPlayerZone.input.hitArea.height / 2, scene.currentPlayerZone.input.hitArea.width, scene.currentPlayerZone.input.hitArea.height);
 
  */
        //TODO - create zones for all opponent hands
        //menu options for game - TODO Add PLAY AGAIN OPTION
        scene.readyText = scene.add.text(75, 300, ['Ready']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan).setInteractive();
        scene.dealText = scene.add.text(75, 350, ['Deal Cards Doofus']).setFontSize(18).setFontFamily('Trebuchet MS');
        setInactiveText(scene.dealText);
        scene.resetText = scene.add.text(75, 400, ['Reset Game']).setFontSize(18).setFontFamily('Trebuchet MS');
        setInactiveText(scene.resetText);
        scene.passText = scene.add.text(750, 525, ['Pass Turn']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan);
        setInactiveText(scene.passText);
        scene.sortCardsText = scene.add.text(250, 525, ['Sort Cards']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan);
        setInactiveText(scene.sortCardsText);
        //add player names to board
        this.setPlayerNames(scene);
    }
    /**
     * Sets initial player names on board
     * @param scene
     */
    setPlayerNames(scene) {
        //display initial players names in game
        let opponentPos = 0;
        scene.currentPlayers.players.forEach(player => {
            //if (scene.socket.id !== player.socketId) { opponentPos++ };
            if (scene.socket.id === player.socketId) {
                scene.add.text(100, 575, [player.getDisplayName()]).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan).setData('id', player.socketId).setData('type', 'playerName');
            }
            else {
                opponentPos++;
                scene.add.text(100, 50 + (opponentPos * 80), [player.getDisplayName()]).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan).setData('id', player.socketId).setData('type', 'playerName');
            }
        });
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
//# sourceMappingURL=uiHandler.js.map