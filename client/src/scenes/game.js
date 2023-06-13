"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = require("phaser");
const interactiveHandler_1 = __importDefault(require("../helpers/interactiveHandler"));
const socketHandler_1 = __importDefault(require("../helpers/socketHandler"));
const uiHandler_1 = __importDefault(require("../helpers/uiHandler"));
const gameHandler_1 = __importDefault(require("../helpers/gameHandler"));
const deckHandler_1 = __importDefault(require("../helpers/deckHandler"));
//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';
class Game extends phaser_1.Scene {
    constructor(t) {
        super({
            key: 'Game',
        });
    }
    //load everything needed for game 
    preload() {
        //load card images
        this.load.image('cyanCardFront', require('../assets/CyanCardFront.png').default);
        this.load.image('cyanCardBack', require('../assets/CyanCardBack.png').default);
        this.load.image('magentaCardFront', require('../assets/MagentaCardFront.png').default);
        this.load.image('magentaCardBack', require('../assets/MagentaCardBack.png').default);
    }
    //populate needed items for game
    create() {
        this.UIHandler = new uiHandler_1.default(this);
        this.GameHandler = new gameHandler_1.default(this);
        this.InteractiveHandler = new interactiveHandler_1.default(this);
        this.SocketHandler = new socketHandler_1.default(this);
        this.DeckHandler = new deckHandler_1.default(this);
    }
    //make updates to game
    update() {
    }
}
exports.default = Game;
//# sourceMappingURL=game.js.map