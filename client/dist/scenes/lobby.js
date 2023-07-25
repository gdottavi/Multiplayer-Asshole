import Phaser from "phaser";
import { Players } from "../model/players";
import LobbySocketHandler from "../lobby_helpers/lobbySocketHandler";
import StartGameHandler from "../lobby_helpers/startGameHandler";
import LobbyUIHandler from "../lobby_helpers/lobbyUIHandler";
import { soundKeys } from "./game";
class Lobby extends Phaser.Scene {
    constructor() {
        super("Lobby");
        this.players = new Players;
        this.namePos = 0;
        Lobby.currentScene = this;
    }
    // Add your scene methods and logic here
    // For example, you can implement the preload, create, and update methods
    // See the Phaser documentation for more information: https://photonstorm.github.io/phaser3-docs/
    preload() {
        //load sounds
        this.load.audio(soundKeys.crackBeer, require('../assets/sounds/opening-beer-can.mp3').default);
        this.load.audio(soundKeys.asshole, require('../assets/sounds/Drink 45.mp3').default);
        //load images
        this.load.image('BeerfestAsshole', require('../assets/beerfest/beerfest-asshole-circle.png').default);
    }
    create() {
        this.LobbySocketHandler = new LobbySocketHandler(this);
        this.StartGameHandler = new StartGameHandler(this);
        this.LobbyUIHandler = new LobbyUIHandler(this);
        // Request the player list when the scene is created (or when you switch back to it)
        if (Lobby.socket && Lobby.socket.connected) {
            Lobby.socket.emit('getPlayerList');
        }
    }
    update() {
        // Update the lobby scene logic (e.g., handle user input, check game state)
    }
    /**
      * plays a sound
      * @param key - sound key to play
      */
    playSound(key) {
        var sound = this.sound.add(key);
        sound.play();
    }
}
Lobby.socket = null;
export default Lobby;
//# sourceMappingURL=lobby.js.map