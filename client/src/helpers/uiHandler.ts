import CardSprite from "../model/cardSprite";
import Game from "../scenes/game";


export enum themeColors {
    black,
    teal = '#00ffff',
    magenta = '#ff69b4'
}

/**
 * Basic layout and UI for game
 */
export default class UIHandler {

    constructor(scene: Game) {

        //Create drop zone for cards
        scene.dropZone = scene.add.zone(700, 375, 900, 250).setRectangleDropZone(900, 250);

        let dropZoneOutline = scene.add.graphics();
        dropZoneOutline.lineStyle(4, 0xff69b4);
        dropZoneOutline.strokeRect(scene.dropZone.x - scene.dropZone.input.hitArea.width / 2,
            scene.dropZone.y - scene.dropZone.input.hitArea.height / 2, scene.dropZone.input.hitArea.width, scene.dropZone.input.hitArea.height);


        /*  //Create current player card zone - TODO
         scene.currentPlayerZone = scene.add.zone(650, 625, 1250, 150).setRectangleDropZone(1250, 150);
         let currentPlayerZoneOutline = scene.add.graphics();
         currentPlayerZoneOutline.lineStyle(4, 0xff69b4);
         currentPlayerZoneOutline.strokeRect(scene.currentPlayerZone.x - scene.currentPlayerZone.input.hitArea.width / 2,
             scene.currentPlayerZone.y - scene.currentPlayerZone.input.hitArea.height / 2, scene.currentPlayerZone.input.hitArea.width, scene.currentPlayerZone.input.hitArea.height);
 
  */
        //TODO - create zones for all opponent hands


        //menu options for game
        //TODO - don't allow dealing until ready is pushed and finished processing (add delay)
        scene.readyText = scene.add.text(75, 300, ['Ready']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        scene.dealText = scene.add.text(75, 350, ['Deal Cards Doofus']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        scene.resetText = scene.add.text(75, 400, ['Reset Game']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff')
        scene.passText = scene.add.text(750, 525, ['Pass Turn']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();



    }

    setPlayerNames(scene: Game): void {
        //display initial players names in game
        let opponentPos = 0;
        scene.currentPlayers.players.forEach(player => {

            if (scene.socket.id !== player.socketId) { opponentPos++ };
            if (scene.socket.id === player.socketId) {
                scene.add.text(100, 575, [player.name]).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff')
            }
            else {
                scene.add.text(100, 50 + (opponentPos * 80), [player.name]).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff')
            }

        })
    }


}