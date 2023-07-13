import { themeColors } from "../game_helpers/gameUIHandler";
import { Player } from "../model/player";
import Lobby from "../scenes/lobby";
import { convertColorHexToNum, createButton, createToast, setActiveText, setInactiveText } from "../utils/utils";
import { GridSizer, DropDownList } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import Label from "phaser3-rex-plugins/templates/ui/ui-components.js";
import { setHoverColor } from "../utils/utils";
import { generateRankOptions, getRankString, validateName } from "./lobbyValidators";
import InputText from 'phaser3-rex-plugins/plugins/inputtext'
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';


const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const COLOR_CYAN = 0x00FFFF;

/**
 * Basic layout and UI for game
 */
export default class LobbyUIHandler {

    scene: Lobby;
    playerGrid: GridSizer;
    joinButton: Phaser.GameObjects.Text;
    startButton: Phaser.GameObjects.Text;
    dropDownArrow: Phaser.GameObjects.Text;
    inputBox: Phaser.GameObjects.DOMElement;

    constructor(scene: Lobby) {

        this.scene = scene;
        this.initialUISetup();
    }

    /**
     * Initial UI setup without data
     */
    initialUISetup() {
        this.setupPlayerGrid();
        this.addButtons();
        this.addInputBox();
    }

    /**
     * Adds player information to player grid and update rank options for all 
     * @param player - player to add
     */
    addPlayerToGrid(player: Player): void {
        this.playerGrid
            .add(this.createRankSelection(player), {
                align: "left"
            })
            .add(this.scene.add.text(0, 0, player.name), {
                align: "left"
            })
            .layout()

        this.updateRankOptionsForAllPlayers()
    }

    /**
   * Updates the rank options for all players
   */
    updateRankOptionsForAllPlayers(): void {
        const players = this.scene.players.players;
        players.forEach(player => {
            const dropdown = player.rankDropDown
            if (dropdown) {
                const rankOptions = generateRankOptions(this.scene, player);
                dropdown.setOptions(rankOptions);
            }
        });
    }

    /**
     * Update selected Ranks for all players
     * @param player - player to update rank for
     */
    updateRank(player: Player): void {
        const rank = player.rank;
        if (player) {
            const dropdownToUpdate = player.rankDropDown;
            if (dropdownToUpdate) {
                dropdownToUpdate.value = rank;
                dropdownToUpdate.text = getRankString(rank);
            }
        }
    }

    /**
     * 
     * @returns a dropdown list for rank selection
     */
    createRankSelection(player: Player): DropDownList {
        const rankOptions = generateRankOptions(this.scene, player);
        let rankDropdown = new DropDownList(this.scene, dropDownConfig(this.scene, rankOptions))
        rankDropdown.setData('player', player);  //need to associate drop down with player so we can save rank to that player 
        player.rankDropDown = rankDropdown;  //keep track on player so we can update options when new players join
        return rankDropdown;
    }

    /**
     * Initial Player Grid setup
     */
    setupPlayerGrid() {
        this.playerGrid = new GridSizer(this.scene, gridConfig()).setOrigin(0)
        this.addTitleToGrid();
        this.addHeadersToGrid();

    }

    /**
     * Adds Headers to player grid
     * Column 0: Player Name
     * Column 1: Player Rank
     */
    addHeadersToGrid() {
        const rankHeader = this.scene.add.text(0, 0, "Rank", { fontSize: "24px", color: themeColors.yellow });
        const nameHeader = this.scene.add.text(0, 0, "Name", { fontSize: "24px", color: themeColors.yellow });
        
        this.playerGrid
          .add(rankHeader, {
            align: 'left',
            padding: { bottom: 5 },
          })
          .add(nameHeader, {
            align: 'left',
            padding: { bottom: 5 }
          })
          .layout();
      }
      
      
      

    /**
     * Adds title to player grid
     */
    addTitleToGrid() {
        this.playerGrid
            .add(this.scene.add.text(0, 0, "Players In Game", { fontSize: "28px", color: themeColors.white }), {
                padding: { bottom: 5 },
                align: 'left'
            })
            .add(this.scene.add.text(0, 0, "", {}), {
                padding: { bottom: 5 }
            })
            .layout();
    }

    /**
     * Adds name input box
     */
    addInputBox() {
        this.inputBox = this.scene.add.dom(640, 360).createFromHTML(
            `<div style="display: flex; align-items: center;">
            <input type="text" id="nameInput" placeholder="Enter Name" style="font-size: 16px; width: 200px; height: 40px;">
        </div>`
        );
    }

    /**
     * Add buttons to join and start game
     */
    addButtons() {
        this.joinButton = createButton(this.scene, 640, 420, "Join Game", null, "32px", true, this.joinButtonCallBack)
        this.startButton = createButton(this.scene, 640, 640, "Start Game", null, "32px", false, this.scene.StartGameHandler.startGame)
    }

    /**
     * Call back function for join button
     * @returns - call back function 
     */
    joinButtonCallBack = () => {
        const playerName = (document.getElementById("nameInput") as HTMLInputElement).value;
        if (!validateName(playerName)) {
            createToast(this.scene, "Must enter a valid name before joining", 5000, 640, 100)
            return
        }
        let newPlayer = this.scene.StartGameHandler.joinGame(playerName);
        setInactiveText(this.joinButton)
        setActiveText(this.startButton)
        setHoverColor(this.startButton)

        // Disable the input box
        this.inputBox = this.scene.add.dom(640, 360).createFromHTML(`
            <div style="display: flex; align-items: center;">
            <input type="text" id="nameInput" placeholder="" style="font-size: 16px; width: 200px; height: 40px;" disabled>
            </div>
        `);
    }
}


/**
 * Configuration for Player Grid
 * @returns GridSizer Configuration Object
 */
function gridConfig(): GridSizer.IConfig {
    return {
        x: 50, y: 25,
        width: 400, height: undefined,

        column: 2, row: 2,
        columnProportions: [1,3], rowProportions: 0,
        space: {
            left: 10, right: 10, top: 10, bottom: 10,
            column: 5,
            row: 5
        },
    }
}

/**
 * Label config
 * @param scene 
 * @param text - text to display
 * @returns 
 */
function labelConfig(scene: Lobby, text: string): any {
    return {
        background: scene.add.existing(new RoundRectangle(scene, 0, 0, 2, 2, 0)),
        text: scene.add.text(0, 0, text, {
            color: themeColors.black
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10
        }
    }
}

/**
 * Configuration for rank drop down selection
 * @param scene 
 * @returns DropDownList Configuration Object
 */
function dropDownConfig(scene: Lobby, rankOptions: any[]): DropDownList.IConfig {
    return {
        x: 0,
        y: 0,
        //background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, convertColorHexToNum(themeColors.blue)),
        icon: scene.add.text(0, 0, "▼", { fontSize: "24px", color: themeColors.cyan }),
        text: scene.add.text(0, 0, "--"),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10
        },
        options: rankOptions,
        list: {
            createBackgroundCallback: function (scene: Lobby) {
                return scene.add.existing(new RoundRectangle(scene, 0, 0, 2, 2, 0, convertColorHexToNum(themeColors.white)))
            },
            createButtonCallback: function (scene: Lobby, option, index, options) {
                var button = scene.rexUI.add.label(labelConfig(scene, option.label))
                button.value = option.value;
                return button;
            },

            // set the option on click
            onButtonClick: function (button: any, index, pointer, event) {
                this.text = button.text;
                this.value = button.value;
            },

            //highlight option
            onButtonOver: function (button: any, index: number, pointer, event) {
                button.getElement('background').setStrokeStyle(1, convertColorHexToNum(themeColors.magenta));
                button.getElement('text').setColor(themeColors.magenta);
            },

            //remove highlight of option
            onButtonOut: function (button: any, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
                button.getElement('text').setColor(themeColors.black);
            },

        },

        setValueCallback: function (dropDownList, value, previousValue) {
            scene.StartGameHandler.updateRank(dropDownList.getData('player'), value)
        },
        value: undefined

    }

}


