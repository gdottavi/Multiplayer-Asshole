import { themeColors } from "../game_helpers/gameUIHandler";
import Lobby from "../scenes/lobby";
import { setActiveText, setInactiveText } from "../utils/utils";


/**
 * Basic layout and UI for game
 */
export default class LobbyUIHandler {

    constructor(scene: Lobby) {

                // Create lobby UI elements
                scene.add.text(100, 100, "Players In Game", { fontSize: "32px", color: "#ffffff" })

                // Create the input text box
                const inputBox = scene.add.dom(640, 360).createFromHTML(`
            <input type="text" id="nameInput" placeholder="Enter Name" style="font-size: 16px; width: 200px; height: 40px;">
        `);
        
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
                    scene.StartGameHandler.joinGame(playerName);
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



}


 /**
     * Displays a single player name on the screen
     * @param playerName - player name to display
     */
 export function displayPlayerName(scene: Lobby, playerName: string): void{
    let yPos = 150 + scene.namePos*30;
    let xPos = 200;

    scene.add.text(xPos, yPos, playerName, { fontSize: "24px", color: themeColors.cyan })
    scene.namePos++; 
}