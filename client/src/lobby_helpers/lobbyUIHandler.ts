import { themeColors } from "../game_helpers/gameUIHandler";
import { Player } from "../model/player";
import Lobby from "../scenes/lobby";
import { setActiveText, setInactiveText } from "../utils/utils";
import { GridSizer, DropDownList } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import Label from "phaser3-rex-plugins/templates/ui/ui-components.js";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import { setHoverColor } from "../utils/utils";
import { generateRankOptions, getRankString } from "./lobbyValidators";


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

    constructor(scene: Lobby) {

        this.scene = scene;
        // Create lobby UI elements
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
            .add(this.scene.add.text(0, 0, player.name), {
                expand: true
            })
            .add(this.createRankSelection(player), {
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
     * Column 2: Player Socket ID (not shown)
     */
    addHeadersToGrid() {
        this.playerGrid
            .add(this.scene.add.text(0, 0, "Name", { fontSize: "24px", color: themeColors.cyan }), {
                align: 'center',
                padding: { bottom: 5 },
                expand: true
            })
            .add(this.scene.add.text(0, 0, "Rank", { fontSize: "24px", color: themeColors.cyan }), {
                align: 'center',
                padding: { bottom: 5 }
            })
            .layout();
    }

    /**
     * Adds title to player grid
     */
    addTitleToGrid() {
        this.playerGrid
            .add(this.scene.add.text(0, 0, "Players In Game", { fontSize: "32px", color: themeColors.white }), {
                expand: true,
                padding: { bottom: 5 }
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
        const inputBox = this.scene.add.dom(640, 360).createFromHTML(`
        <div style="display: flex; align-items: center;">
            <input type="text" id="nameInput" placeholder="Enter Name" style="font-size: 16px; width: 200px; height: 40px;">
        </div>
`         );
    }

    /**
     * Add buttons to join and start game
     */
    addButtons() {
        // Add a ready/join button
        const joinButton = this.scene.add.text(640, 420, "Join Game", { fontSize: "32px", color: themeColors.cyan }).setOrigin(0.5).setInteractive()
        setActiveText(joinButton);
        setHoverColor(joinButton)

        joinButton.on("pointerdown", () => {
            const playerName = (document.getElementById("nameInput") as HTMLInputElement).value;
            let newPlayer = this.scene.StartGameHandler.joinGame(playerName);

            setInactiveText(joinButton)
            setActiveText(startButton)
            setHoverColor(startButton)
        });

        // Add a start button
        const startButton = this.scene.add.text(640, 640, "Start Game", { fontSize: "32px", color: themeColors.inactiveGray }).setOrigin(0.5).setInteractive()
        //startButton.setInteractive();
        setInactiveText(startButton);

        startButton.on("pointerdown", () => {
            //const playerName = (document.getElementById("nameInput") as HTMLInputElement).value;
            this.scene.StartGameHandler.startGame();
        });
    }
}



/**
 * Configuration for Player Grid
 * @returns GridSizer Configuration Object
 */
function gridConfig(): GridSizer.IConfig {
    return {
        x: 100, y: 100,
        width: 500, height: undefined,

        column: 2, row: 2,
        columnProportions: 0, rowProportions: 0,
        space: {
            left: 10, right: 10, top: 10, bottom: 10,
            column: 5,
            row: 5
        },
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
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x4e342e),
        icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x7b5e57),
        text: scene.add.text(0, 0, "--Select--"),

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
                return scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_DARK);
            },
            createButtonCallback: function (scene: Lobby, option, index, options) {
                var text = option.label;
                var button = scene.rexUI.add.label({
                    background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0),

                    text: scene.add.text(0, 0, text),

                    space: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10,
                        icon: 10
                    }
                });
                button.value = option.value;

                return button;
            },

            // set the option on click
            onButtonClick: function (button: any, index, pointer, event) {
                // Set label text, and value
                this.text = button.text;
                this.value = button.value;
            },

            // scope: dropDownList
            onButtonOver: function (button: any, index: number, pointer, event) {
                button.getElement('background').setStrokeStyle(1, 0xffffff);
            },

            // scope: dropDownList
            onButtonOut: function (button: any, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
            },

            // expandDirection: 'up',
        },

        setValueCallback: function (dropDownList, value, previousValue) {
            scene.StartGameHandler.updateRank(dropDownList.getData('player'), value)
        },
        value: undefined

    }

}


