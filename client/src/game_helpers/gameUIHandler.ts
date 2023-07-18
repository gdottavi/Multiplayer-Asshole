import CardSprite from "../model/cardSprite";
import { Player } from "../model/player";
import Game from "../scenes/game";
import { setActiveText, setInactiveText } from "../utils/utils";


export enum themeColors {
    black = '#000000',
    cyan = '#00ffff',
    blue = '#3343A7',
    magenta = '#ff69b4',
    yellow = '#ffff00',
    inactiveGray = '#888888',
    white = '#ffffff'
}

export const currPlayerXPos = 150;
export const currPlayerYPos = 575;
export const opponentStartXPos = 50;
const playZoneWidth = 900;
const playZoneHeight = 200;

/**
 * Basic layout and UI for game
 */
export default class GameUIHandler {
    scene: Game;

    constructor(scene: Game) {

        this.scene = scene;
        //Create drop zone for cards
        scene.dropZone = scene.add.zone(700, 375, playZoneWidth, playZoneHeight).setRectangleDropZone(playZoneWidth, playZoneHeight);

        let dropZoneOutline = scene.add.graphics();
        dropZoneOutline.lineStyle(4, 0xff69b4);
        dropZoneOutline.strokeRect(scene.dropZone.x - scene.dropZone.input.hitArea.width / 2,
            scene.dropZone.y - scene.dropZone.input.hitArea.height / 2, scene.dropZone.input.hitArea.width, scene.dropZone.input.hitArea.height);

        this.setupButtons()
        this.setPlayerNames();
    }

    /**
     * setup for all interactive text buttons in game
     */
    setupButtons() {
        this.scene.dealText = this.scene.add.text(75, 350, ['Deal Cards']).setFontSize(18).setFontFamily('Trebuchet MS')
        setActiveText(this.scene.dealText);
        this.scene.resetText = this.scene.add.text(75, 400, ['Reset Game']).setFontSize(18).setFontFamily('Trebuchet MS')
        setInactiveText(this.scene.resetText)
        this.scene.passText = this.scene.add.text(currPlayerXPos - 125, currPlayerYPos + 40, ['Pass Turn']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan)
        setInactiveText(this.scene.passText);
        this.scene.sortCardsText = this.scene.add.text(currPlayerXPos - 125, currPlayerYPos + 70, ['Sort Cards']).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.cyan)
        setInactiveText(this.scene.sortCardsText)
    }

    /**
     * Sets initial player names on board
     */
    setPlayerNames(): void {
        //display initial players names in game
        let opponentPos = 0
        this.scene.currentPlayers.players.forEach(player => {

            //if (this.scene.socket.id !== player.socketId) { opponentPos++ };
            if (this.scene.socket.id === player.socketId) {
                this.scene.add.text(currPlayerXPos, currPlayerYPos, [player.getDisplayName()]).setFontSize(18).setFontFamily('Trebuchet MS').setColor(themeColors.white).setData('id', player.socketId).setData('type', 'playerName');
            }
            else {
                this.scene.add.text(opponentStartXPos + (opponentPos * 250), 25, [player.getDisplayName()]).setFontSize(12).setFontFamily('Trebuchet MS').setColor(themeColors.white).setData('id', player.socketId).setData('type', 'playerName');
                opponentPos++;
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






}

