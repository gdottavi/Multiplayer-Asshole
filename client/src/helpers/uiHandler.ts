import Game from "../scenes/game";
import Zone from "./zone";

/**
 * Basic layout and UI for game
 */
export default class UIHandler {

    constructor(scene: Game){

        //play zone
        scene.zone = new Zone(scene);
        scene.dropZone = scene.zone.renderZone();
        scene.outline = scene.zone.renderOutline(scene.dropZone);         

       
        scene.dealText = scene.add.text(75, 350, ['DEAL Boner']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
       
 

    }
}