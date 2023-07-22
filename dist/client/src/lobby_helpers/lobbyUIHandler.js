"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameUIHandler_1 = require("../game_helpers/gameUIHandler");
const utils_1 = require("../utils/utils");
const ui_components_js_1 = require("phaser3-rex-plugins/templates/ui/ui-components.js");
const utils_2 = require("../utils/utils");
const lobbyValidators_1 = require("./lobbyValidators");
const roundrectangle_js_1 = __importDefault(require("phaser3-rex-plugins/plugins/roundrectangle.js"));
const game_1 = require("../scenes/game");
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const COLOR_CYAN = 0x00FFFF;
/**
 * Basic layout and UI for game
 */
class LobbyUIHandler {
    constructor(scene) {
        /**
         * Call back function for join button
         * @returns - call back function
         */
        this.joinButtonCallBack = () => {
            const playerName = document.getElementById("nameInput").value;
            if (!(0, lobbyValidators_1.validateName)(playerName)) {
                (0, utils_1.createToast)(this.scene, "Must enter a valid name before joining", 5000, (0, utils_1.getCenterX)(this.scene), 100);
                return;
            }
            let newPlayer = this.scene.StartGameHandler.joinGame(playerName);
            (0, utils_1.setInactiveText)(this.joinButton);
            (0, utils_1.setActiveText)(this.startButton);
            (0, utils_2.setHoverColor)(this.startButton);
            // Disable the input box
            this.inputBox = this.scene.add.dom((0, utils_1.getCenterX)(this.scene), (0, utils_1.getCenterY)(this.scene)).createFromHTML(`
            <div style="display: flex; align-items: center;">
            <input type="text" id="nameInput" placeholder="" style="font-size: 16px; width: 200px; height: 40px;" disabled>
            </div>
        `);
        };
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
        this.showImages();
    }
    /**
     * Adds player information to player grid and update rank options for all
     * @param player - player to add
     */
    addPlayerToGrid(player) {
        this.playerGrid
            .add(this.createRankSelection(player), {
            align: "left"
        })
            .add(this.scene.add.text(0, 0, player.name), {
            align: "left"
        })
            .layout();
        this.updateRankOptionsForAllPlayers();
    }
    /**
     * clears the grid of all players
     */
    removePlayersFromGrid() {
        this.playerGrid.removeAll(true);
        this.addTitleToGrid();
        this.addHeadersToGrid();
    }
    /**
   * Updates the rank options for all players
   */
    updateRankOptionsForAllPlayers() {
        const players = this.scene.players.players;
        players.forEach(player => {
            const dropdown = player.rankDropDown;
            if (dropdown) {
                const rankOptions = (0, lobbyValidators_1.generateRankOptions)(this.scene, player);
                dropdown.setOptions(rankOptions);
            }
        });
    }
    /**
     * Update selected Ranks for all players
     * @param player - player to update rank for
     */
    updateRank(player) {
        const rank = player.rank;
        if (player) {
            const dropdownToUpdate = player.rankDropDown;
            if (dropdownToUpdate) {
                if (rank === null) {
                    dropdownToUpdate.value = undefined;
                    dropdownToUpdate.text = '--';
                }
                else {
                    dropdownToUpdate.value = rank;
                    dropdownToUpdate.text = (0, lobbyValidators_1.getRankString)(rank);
                }
            }
        }
    }
    /**
     *
     * @returns a dropdown list for rank selection
     */
    createRankSelection(player) {
        const rankOptions = (0, lobbyValidators_1.generateRankOptions)(this.scene, player);
        let rankDropdown = new ui_components_js_1.DropDownList(this.scene, dropDownConfig(this.scene, rankOptions));
        rankDropdown.setData('player', player); //need to associate drop down with player so we can save rank to that player 
        player.rankDropDown = rankDropdown; //keep track on player so we can update options when new players join
        return rankDropdown;
    }
    /**
     * Initial Player Grid setup
     */
    setupPlayerGrid() {
        this.playerGrid = new ui_components_js_1.GridSizer(this.scene, gridConfig()).setOrigin(0);
        this.addTitleToGrid();
        this.addHeadersToGrid();
    }
    /**
     * Adds Headers to player grid
     * Column 0: Player Name
     * Column 1: Player Rank
     */
    addHeadersToGrid() {
        const rankHeader = this.scene.add.text(0, 0, "Rank", { fontSize: "24px", color: gameUIHandler_1.themeColors.yellow });
        const nameHeader = this.scene.add.text(0, 0, "Name", { fontSize: "24px", color: gameUIHandler_1.themeColors.yellow });
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
            .add(this.scene.add.text(0, 0, "Players In Game", { fontSize: "28px", color: gameUIHandler_1.themeColors.white }), {
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
        this.inputBox = this.scene.add.dom((0, utils_1.getCenterX)(this.scene), (0, utils_1.getCenterY)(this.scene)).createFromHTML(`<div style="display: flex; align-items: center;">
            <input type="text" id="nameInput" placeholder="Enter Name" style="font-size: 16px; width: 200px; height: 40px;">
        </div>`);
    }
    /**
     * Add buttons to join and start game
     */
    addButtons() {
        this.joinButton = (0, utils_1.createButton)(this.scene, (0, utils_1.getCenterX)(this.scene), (0, utils_1.getCenterY)(this.scene) + 80, "Join Game", null, "32px", true, this.joinButtonCallBack);
        this.startButton = (0, utils_1.createButton)(this.scene, (0, utils_1.getCenterX)(this.scene), this.scene.cameras.main.height - 60, "Start Game", null, "48px", false, this.scene.StartGameHandler.startGame);
    }
    /**
     * Display images
     */
    showImages() {
        //asshole image
        const image = this.scene.add.image(this.scene.cameras.main.width - 20, 20, 'BeerfestAsshole');
        image.setOrigin(1, 0); // Set the origin to the top-right corner of the image
        image.setScale(1.5); // Scale the image if needed
        image.alpha = 0;
        //fade image in
        this.scene.tweens.add({
            targets: image,
            alpha: 1,
            duration: 5000,
            ease: Phaser.Math.Easing.Sine.InOut,
        });
        //add sound on image click
        image.setInteractive();
        image.on('pointerdown', () => {
            const assholeSound = this.scene.sound.add(game_1.soundKeys.asshole);
            assholeSound.play();
        });
    }
}
exports.default = LobbyUIHandler;
/**
 * Configuration for Player Grid
 * @returns GridSizer Configuration Object
 */
function gridConfig() {
    return {
        x: 50, y: 25,
        width: 400, height: undefined,
        column: 2, row: 2,
        columnProportions: [1, 3], rowProportions: 0,
        space: {
            left: 10, right: 10, top: 10, bottom: 10,
            column: 5,
            row: 5
        },
    };
}
/**
 * Label config
 * @param scene
 * @param text - text to display
 * @returns
 */
function labelConfig(scene, text) {
    return {
        background: scene.add.existing(new roundrectangle_js_1.default(scene, 0, 0, 2, 2, 0)),
        text: scene.add.text(0, 0, text, {
            color: gameUIHandler_1.themeColors.black
        }),
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10
        }
    };
}
/**
 * Configuration for rank drop down selection
 * @param scene
 * @returns DropDownList Configuration Object
 */
function dropDownConfig(scene, rankOptions) {
    return {
        x: 0,
        y: 0,
        icon: scene.add.text(0, 0, "▼", { fontSize: "24px", color: gameUIHandler_1.themeColors.cyan }),
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
            createBackgroundCallback: function (scene) {
                return scene.add.existing(new roundrectangle_js_1.default(scene, 0, 0, 2, 2, 0, (0, utils_1.convertColorHexToNum)(gameUIHandler_1.themeColors.white)));
            },
            createButtonCallback: function (scene, option, index, options) {
                var button = scene.rexUI.add.label(labelConfig(scene, option.label));
                button.value = option.value;
                return button;
            },
            // set the option on click
            onButtonClick: function (button, index, pointer, event) {
                this.text = button.text;
                this.value = button.value;
            },
            //highlight option
            onButtonOver: function (button, index, pointer, event) {
                button.getElement('background').setStrokeStyle(1, (0, utils_1.convertColorHexToNum)(gameUIHandler_1.themeColors.magenta));
                button.getElement('text').setColor(gameUIHandler_1.themeColors.magenta);
            },
            //remove highlight of option
            onButtonOut: function (button, index, pointer, event) {
                button.getElement('background').setStrokeStyle();
                button.getElement('text').setColor(gameUIHandler_1.themeColors.black);
            },
        },
        setValueCallback: function (dropDownList, value, previousValue) {
            scene.StartGameHandler.updateRank(dropDownList.getData('player'), value);
        },
        value: undefined
    };
}
//# sourceMappingURL=lobbyUIHandler.js.map