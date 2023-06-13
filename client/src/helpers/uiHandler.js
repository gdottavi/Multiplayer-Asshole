"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zone_1 = __importDefault(require("./zone"));
/**
 * Basic layout and UI for game
 */
class UIHandler {
    constructor(scene) {
        //play zone
        scene.zone = new zone_1.default(scene);
        scene.dropZone = scene.zone.renderZone();
        scene.outline = scene.zone.renderOutline(scene.dropZone);
        scene.dealText = scene.add.text(75, 350, ['DEAL Boner']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
    }
}
exports.default = UIHandler;
//# sourceMappingURL=uiHandler.js.map