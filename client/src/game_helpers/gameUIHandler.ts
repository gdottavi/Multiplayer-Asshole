import { Scene } from "phaser";
import CardSprite from "../model/cardSprite";
import { Player } from "../model/player";
import Game from "../scenes/game";
import { convertColorHexToNum, getCenterX, getCenterY, setActiveText, setInactiveText } from "../utils/utils";


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
export const fontSize = 18;


/**
 * Basic layout and UI for game
 */
export default class GameUIHandler {
    scene: Game;
    playZoneWidth: number;
    playZoneHeight: number;

    constructor(scene: Game) {

        this.scene = scene;

        // Create drop zone for cards in the middle
        this.playZoneWidth = scene.scale.width * 0.7
        this.playZoneHeight = scene.scale.height * 0.25
        scene.dropZone = scene.add.zone(getCenterX(scene), getCenterY(scene), this.playZoneWidth, this.playZoneHeight).setRectangleDropZone(this.playZoneWidth, this.playZoneHeight);
        let dropZoneOutline = scene.add.graphics();
        dropZoneOutline.lineStyle(4, convertColorHexToNum(themeColors.magenta));
        dropZoneOutline.strokeRect(getCenterX(scene) - this.playZoneWidth / 2, getCenterY(scene) - this.playZoneHeight / 2, this.playZoneWidth, this.playZoneHeight);


        this.setupButtons()
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
        const horizontalOffset = this.playZoneWidth / 2 + 125; // Adjust the offset as needed
        const dealTextX = dropZoneCenterX - horizontalOffset;
        const resetTextX = dropZoneCenterX - horizontalOffset;

        this.scene.dealText = this.scene.add.text(dealTextX, dealTextY, ['Deal Cards']).setFontSize(fontSize).setFontFamily('Trebuchet MS');
        setActiveText(this.scene.dealText);

        this.scene.resetText = this.scene.add.text(resetTextX, resetTextY, ['New Game']).setFontSize(fontSize).setFontFamily('Trebuchet MS');
        setActiveText(this.scene.resetText);

        //Player Options
        this.scene.passText = this.scene.add.text(currPlayerXPos - 125, this.getCurrPlayerYPos() + 40, ['Pass Turn']).setFontSize(fontSize).setFontFamily('Trebuchet MS').setColor(themeColors.cyan)
        setInactiveText(this.scene.passText);
        this.scene.sortCardsText = this.scene.add.text(currPlayerXPos - 125, this.getCurrPlayerYPos() + 70, ['Sort Cards']).setFontSize(fontSize).setFontFamily('Trebuchet MS').setColor(themeColors.cyan)
        setInactiveText(this.scene.sortCardsText)
    }

    /**
     * Sets initial player names on board
     */
    setPlayerNames(): void {
        //display initial players names in game
        let opponentPos = 0

        this.scene.currentPlayers.players.forEach(player => {

            //current player
            if (this.scene.socket.id === player.socketId) {
                this.scene.add.text(currPlayerXPos,
                    this.getCurrPlayerYPos(),
                    [player.getDisplayName()]).setFontSize(fontSize).setFontFamily('Trebuchet MS').setColor(themeColors.white).setData('id', player.socketId).setData('type', 'playerName');
            }
            else {
                this.scene.add.text(opponentStartXPos + (opponentPos * 250), 25, [player.getDisplayName()]).setFontSize(fontSize).setFontFamily('Trebuchet MS').setColor(themeColors.white).setData('id', player.socketId).setData('type', 'playerName');
                opponentPos++;
            }

        })
    }

    /**
     * 
     * @returns current player Y position
     */
    getCurrPlayerYPos(): number {
        const dropZoneCenterY = this.scene.dropZone.y;
        const dropZoneHeight = this.playZoneHeight;
        const verticalOffset = 100;

        return dropZoneCenterY + dropZoneHeight / 2 + verticalOffset
    }

    /**
     * Updates color of player name.  Will default to cyan if player in game.
     * @param scene 
     * @param player - player name to update
     * @param color - color to update name to
     */
    updatePlayerNameColor(scene: Game, player: Player, color: string): void {

        let socketId = player.socketId;

        scene.children.each((child) => {
            if (child instanceof Phaser.GameObjects.Text && child.getData('type') === 'playerName') {

                if (child.getData('id') === socketId) child.setColor(color)
            }

        })

    }






}

