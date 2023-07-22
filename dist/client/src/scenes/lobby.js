"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = __importDefault(require("phaser"));
const players_1 = require("../model/players");
const lobbySocketHandler_1 = __importDefault(require("../lobby_helpers/lobbySocketHandler"));
const startGameHandler_1 = __importDefault(require("../lobby_helpers/startGameHandler"));
const lobbyUIHandler_1 = __importDefault(require("../lobby_helpers/lobbyUIHandler"));
const game_1 = require("./game");
//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
class Lobby extends phaser_1.default.Scene {
    constructor() {
        super("Lobby");
        this.players = new players_1.Players;
        this.namePos = 0;
    }
    // Add your scene methods and logic here
    // For example, you can implement the preload, create, and update methods
    // See the Phaser documentation for more information: https://photonstorm.github.io/phaser3-docs/
    preload() {
        //load sounds
        this.load.audio(game_1.soundKeys.crackBeer, require('../assets/sounds/opening-beer-can.mp3').default);
        this.load.audio(game_1.soundKeys.asshole, require('../assets/sounds/Drink 45.mp3').default);
        //load images
        this.load.image('BeerfestAsshole', require('../assets/beerfest/beerfest-asshole-circle.png').default);
    }
    create() {
        // Initialize the rexUI plugin
        //this.rexUI = this.plugins.get('rexUI');
        this.LobbySocketHandler = new lobbySocketHandler_1.default(this);
        this.StartGameHandler = new startGameHandler_1.default(this);
        this.LobbyUIHandler = new lobbyUIHandler_1.default(this);
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
exports.default = Lobby;
//# sourceMappingURL=lobby.js.map