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
const deck_1 = require("../model/deck");
const players_1 = require("../model/players");
const card_1 = require("../model/card");
class Game extends phaser_1.Scene {
    constructor() {
        super({
            key: 'Game',
        });
    }
    //load everything needed for game 
    preload() {
        //load all playing card images
        this.load.image('CardBack', require('../assets/CardBack.png').default);
        card_1.suites.forEach(suite => {
            card_1.values.forEach(value => {
                let key = suite + value;
                this.load.image(key, require('../assets/white/' + key + '.png').default);
            });
        });
    }
    //populate needed items for game - "this" is a scene of type Game
    create() {
        this.deck = new deck_1.Deck();
        this.currentPlayers = new players_1.Players();
        this.currentPlayedCards = new deck_1.Deck();
        this.UIHandler = new uiHandler_1.default(this);
        this.GameHandler = new gameHandler_1.default(this);
        this.InteractiveHandler = new interactiveHandler_1.default(this);
        this.SocketHandler = new socketHandler_1.default(this);
        this.DeckHandler = new deckHandler_1.default(this);
        //handle physics
    }
    //make updates to game
    update() {
    }
}
exports.default = Game;
//# sourceMappingURL=game.js.map