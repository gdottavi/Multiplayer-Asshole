"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Basic layout and UI for game
 */
class UIHandler {
    constructor(scene) {
        //Create drop zone for cards
        scene.dropZone = scene.add.zone(700, 375, 900, 250).setRectangleDropZone(900, 250);
        //initialize middle to have zero cards
        scene.dropZone.setData({
            "cards": 0
        });
        let dropZoneOutline = scene.add.graphics();
        dropZoneOutline.lineStyle(4, 0xff69b4);
        dropZoneOutline.strokeRect(scene.dropZone.x - scene.dropZone.input.hitArea.width / 2, scene.dropZone.y - scene.dropZone.input.hitArea.height / 2, scene.dropZone.input.hitArea.width, scene.dropZone.input.hitArea.height);
        /* //Create current player card zone
        scene.currentPlayerZone = scene.add.zone(700, 135, 900, 250).setRectangleDropZone(900, 250);
        //initialize middle to have zero cards
        scene.currentPlayerZone.setData({
            "cards": 0
        })
        let currentPlayerZoneOutline = scene.add.graphics();
        currentPlayerZoneOutline.lineStyle(4, 0xff69b4);
        currentPlayerZoneOutline.strokeRect(scene.currentPlayerZone.x - scene.currentPlayerZone.input.hitArea.width / 2,
            scene.currentPlayerZone.y - scene.currentPlayerZone.input.hitArea.height / 2, scene.currentPlayerZone.input.hitArea.width, scene.currentPlayerZone.input.hitArea.height);
 */
        //menu options for game
        //TODO - don't allow dealing until ready is pushed
        scene.readyText = scene.add.text(75, 300, ['Ready']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        scene.dealText = scene.add.text(75, 350, ['Deal Cards']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        scene.resetText = scene.add.text(75, 400, ['Reset Game']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff');
    }
}
exports.default = UIHandler;
//# sourceMappingURL=uiHandler.js.map