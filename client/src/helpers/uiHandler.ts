import CardSprite from "../model/cardSprite";
import { Player } from "../model/player";
import Game from "../scenes/game";


export enum themeColors {
    black = '#000000',
    cyan = '#00ffff',
    magenta = '#ff69b4',
    yellow = '#ffff00',
    inactiveGray = '#888888'
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


        //menu options for game - TODO Add PLAY AGAIN OPTION
        scene.readyText = scene.add.text(75, 300, ['Ready']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan).setInteractive();
        scene.dealText = scene.add.text(75, 350, ['Deal Cards Doofus']).setFontSize(18).setFontFamily('Trebuchet MS')
        this.setInactiveText(scene.dealText);
        scene.resetText = scene.add.text(75, 400, ['Reset Game']).setFontSize(18).setFontFamily('Trebuchet MS')
        this.setInactiveText(scene.resetText)
        scene.passText = scene.add.text(750, 525, ['Pass Turn']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan)
        this.setInactiveText(scene.passText);
        scene.sortCardsText = scene.add.text(250, 525, ['Sort Cards']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan)
        this.setInactiveText(scene.sortCardsText)
    }

    /**
     * Sets initial player names on board
     * @param scene 
     */
    setPlayerNames(scene: Game): void {
        //display initial players names in game
        let opponentPos = 0;
        scene.currentPlayers.players.forEach(player => {

            if (scene.socket.id !== player.socketId) { opponentPos++ };
            if (scene.socket.id === player.socketId) {
                scene.add.text(100, 575, [player.name]).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan).setData('id', player.socketId).setData('type', 'playerName');
            }
            else {
                scene.add.text(100, 50 + (opponentPos * 80), [player.name]).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan).setData('id', player.socketId).setData('type', 'playerName');
            }

        })
    }

    /**
     * Updates color of player name.  Will default to cyan if player in game.
     * @param scene 
     * @param player - player name to update
     * @param color - color to update name to
     */
    async updatePlayerNameColor(scene: Game, player: Player, color: string): Promise<void> {

       let socketId = player.socketId; 

        scene.children.each((child) => {
            if (child instanceof Phaser.GameObjects.Text && child.getData('type') === 'playerName') {

                if (child.getData('id') === socketId) child.setColor(color)
            }

        })

        return Promise.resolve();
    }

    /**
     * 
     * @param text - text to set inactive
     */
    setInactiveText(text: Phaser.GameObjects.Text): void {
        text.setColor(themeColors.inactiveGray);
        text.setFontStyle('italic');
        text.disableInteractive();
    }

    /**
     * 
     * @param text - test to set active
     */
    setActiveText(text: Phaser.GameObjects.Text): void {
        text.setColor(themeColors.cyan);
        text.setFontStyle('normal');
        text.setInteractive();
    }




}