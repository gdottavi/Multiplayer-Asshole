import { themeColors } from "../game_helpers/gameUIHandler";
import { Player } from "../model/player";
import Lobby from "../scenes/lobby";
import { setActiveText, setInactiveText } from "../utils/utils";
import { GridSizer, DropDownList } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import Label from "phaser3-rex-plugins/templates/ui/ui-components.js";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';


const gridConfig = {
    x: 100, y: 100,
    width: 300, height: undefined,

    column: 2, row: 2,
    columnProportions: [.2, .8], rowProportions: 0,
    space: {
        left: 10, right: 10, top: 10, bottom: 10,
        column: 5,
        row: 5
    },
}

const rankOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
]



/**
 * Basic layout and UI for game
 */
export default class LobbyUIHandler {

    scene: Lobby;
    playerGrid: GridSizer;



    constructor(scene: Lobby) {

        this.scene = scene;
        // Create lobby UI elements
        //scene.add.text(100, 60, "Players In Game", { fontSize: "32px", color: "#ffffff" })

        this.playerGrid = new GridSizer(scene, gridConfig).setOrigin(0)
            .addBackground(scene.rexUI.add.roundRectangle(0, 0, 1, 1, 0, 0x260e04))

        this.addHeadersToGrid();
        this.addTitleToGrid();

        // Create the input text box with a dropdown selection and spacing
        const inputBox = scene.add.dom(640, 360).createFromHTML(`
            <div style="display: flex; align-items: center;">
                <input type="text" id="nameInput" placeholder="Enter Name" style="font-size: 16px; width: 200px; height: 40px;">
            </div>
  `         );


        // Add a ready button
        const joinButton = scene.add.text(640, 420, "Join Game", { fontSize: "32px", color: themeColors.cyan }).setOrigin(0.5).setInteractive().setFontFamily('Trebuchet MS')
        setActiveText(joinButton);
        joinButton.on('pointerover', () => {
            joinButton.setColor(themeColors.magenta);
        });

        joinButton.on('pointerout', () => {
            joinButton.setColor(themeColors.cyan);
        });

        joinButton.on("pointerdown", () => {
            const playerName = (document.getElementById("nameInput") as HTMLInputElement).value;
            let newPlayer = scene.StartGameHandler.joinGame(playerName);

            setInactiveText(joinButton)
            setActiveText(startButton)
            startButton.on('pointerover', () => {
                startButton.setColor(themeColors.magenta);
            });

            startButton.on('pointerout', () => {
                startButton.setColor(themeColors.cyan);
            });


        });

        // Add a start button
        const startButton = scene.add.text(640, 640, "Start Game", { fontSize: "32px", color: themeColors.inactiveGray }).setOrigin(0.5).setInteractive().setFontFamily('Trebuchet MS')
        //startButton.setInteractive();
        setInactiveText(startButton);

        startButton.on("pointerdown", () => {
            //const playerName = (document.getElementById("nameInput") as HTMLInputElement).value;
            scene.StartGameHandler.startGame();
        });



    }

    /**
     * Adds player information to player grid
     * @param player - player to add
     */
    addPlayerToGrid(player: Player): void {
        this.playerGrid
            .add(this.scene.add.text(0, 0, player.name), {})
            .add(this.createRankSelection(), {})
            .layout()
    }

    /**
     * 
     * @returns a dropdown list for rank selection
     */
    createRankSelection(): DropDownList {
        return new DropDownList(this.scene, {
            x: 0,
            y: 0,
            background: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x4e342e),
            icon: this.scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x7b5e57),
            text: this.scene.add.text(0, 0, "--Select--"),

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
                    return scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, 0x260e04);
                },
                createButtonCallback: function (scene: Lobby, option, index, options) {
                    var text = option.label;
                    var button = scene.rexUI.add.label({
                        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0),

                        text: this.scene.add.text(0, 0, text),

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

                // scope: dropDownList
                onButtonClick: function (button: any, index, pointer, event) {
                    // Set label text, and value
                    this.text = button.text;
                    this.value = button.value;
                    console.log(`Select ${button.text}, value=${button.value}`)
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
                console.log(value);
            },
            value: undefined

        })

    }



    // Define a separate function for the value change callback
    handleDropdownValueChange(dropDownList: DropDownList, value: string, previousValue: string) {
        // Handle value change
        console.log('Selected Value:', value);
    }

    /**
     * Adds Headers to player grid
     */
    addHeadersToGrid() {
        this.playerGrid.add(this.scene.add.text(0, 0, "Rank", { fontSize: "24px", color: themeColors.cyan }), {
            column: 0,
            row: 1,
            align: 'center',
        })

        this.playerGrid.add(this.scene.add.text(0, 0, "Name", { fontSize: "24px", color: themeColors.cyan }), {
            column: 1,
            row: 1,
            align: 'center'
        }).layout();

    }

    /**
     * Adds title to player grid
     */
    addTitleToGrid() {
        this.playerGrid
            .add(this.scene.add.text(0, 0, "Players In Game", { fontSize: "32px", color: themeColors.white }), {
                row: 0,
                align: 'center',
                expand: true
            })
            .add(this.scene.add.text(0, 0, "", {}), {
                row: 0,
                expand: false
            })
            .layout();
    }
}



// /**
//     * Displays a single player name on the screen
//     * @param playerName - player name to display
//     */
// export function displayPlayerName(scene: Lobby, playerName: string): void {
//     let yPos = 125 + scene.namePos * 30;
//     let xPos = 125;

//     scene.add.text(xPos, yPos, playerName, { fontSize: "24px", color: themeColors.cyan })
//     scene.namePos++;
// }






