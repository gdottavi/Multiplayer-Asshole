"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.soundKeys = void 0;
const phaser_1 = require("phaser");
const gameInteractiveHandler_1 = __importDefault(require("../game_helpers/gameInteractiveHandler"));
const gameSocketHandler_1 = __importDefault(require("../game_helpers/gameSocketHandler"));
const gameUIHandler_1 = __importDefault(require("../game_helpers/gameUIHandler"));
const gameRuleHandler_1 = __importDefault(require("../game_helpers/gameRuleHandler"));
const deckHandler_1 = __importDefault(require("../game_helpers/deckHandler"));
const deck_1 = require("../model/deck");
const players_1 = require("../model/players");
const card_1 = require("../model/card");
const gameTurnHandler_1 = __importDefault(require("../game_helpers/gameTurnHandler"));
const player_1 = require("../model/player");
const lobby_1 = __importDefault(require("./lobby"));
exports.soundKeys = {
    crackBeer: 'opening-beer-can',
    asshole: 'Drink 45',
    antiFoaming: 'Anti Foaming',
    ballBag: 'Ballbag',
    betterDrunk: 'BetterDrunk',
    brainEm: 'Brain Em',
    gameOfSolders: 'Game of Soldiers',
    graduatedCylinder: 'Graduated Cylinder',
    lookingGood: 'lookingood',
    notAgain: 'Not Again',
    offspringWhore: 'offspring Whore',
    oldCountry: 'oldCountry',
    password: 'Password',
    popo: 'Popo',
    ramUrine: 'Ram Urine',
    sitMiddle: 'Sit Middle',
    someoneDied: 'Someone Died',
    takethebet: 'takethebet',
    unBecks: 'Un Becks',
    zj: 'ZJ'
};
class Game extends phaser_1.Scene {
    constructor() {
        super({
            key: 'Game',
        });
    }
    /**
     * Data initialization
     * @param data - data passed from other scenes, when coming from lobby this is an array of serialized player data
     */
    init(data) {
        //extract players and socket from data
        const { players, socket } = data;
        //Sets the initial players in game with names and socket IDs
        const deserializedPlayers = players.map(playerData => player_1.Player.deserialize(playerData));
        this.currentPlayers = new players_1.Players();
        this.currentPlayers.setPlayers(deserializedPlayers);
        this.socket = socket;
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
        //load sounds
        this.load.audio(exports.soundKeys.crackBeer, require('../assets/sounds/opening-beer-can.mp3').default);
        this.load.audio(exports.soundKeys.antiFoaming, require('../assets/sounds/Anti Foaming.mp3').default);
        this.load.audio(exports.soundKeys.ballBag, require('../assets/sounds/Ballbag.mp3').default);
        this.load.audio(exports.soundKeys.betterDrunk, require('../assets/sounds/Better Drunk.mp3').default);
        this.load.audio(exports.soundKeys.brainEm, require('../assets/sounds/Brain Em.mp3').default);
        this.load.audio(exports.soundKeys.asshole, require('../assets/sounds/Drink 45.mp3').default);
        this.load.audio(exports.soundKeys.gameOfSolders, require('../assets/sounds/Game of Soldiers.mp3').default);
        this.load.audio(exports.soundKeys.graduatedCylinder, require('../assets/sounds/Graduated Cylinder.mp3').default);
        this.load.audio(exports.soundKeys.lookingGood, require('../assets/sounds/lookingood.mp3').default);
        this.load.audio(exports.soundKeys.notAgain, require('../assets/sounds/Not Again.mp3').default);
        this.load.audio(exports.soundKeys.offspringWhore, require('../assets/sounds/offspring Whore.mp3').default);
        this.load.audio(exports.soundKeys.oldCountry, require('../assets/sounds/Old Country.mp3').default);
        this.load.audio(exports.soundKeys.password, require('../assets/sounds/Password.mp3').default);
        this.load.audio(exports.soundKeys.popo, require('../assets/sounds/Popo.mp3').default);
        this.load.audio(exports.soundKeys.ramUrine, require('../assets/sounds/Ram Urine.mp3').default);
        this.load.audio(exports.soundKeys.sitMiddle, require('../assets/sounds/Sit Middle.mp3').default);
        this.load.audio(exports.soundKeys.someoneDied, require('../assets/sounds/Someone Died.mp3').default);
        this.load.audio(exports.soundKeys.takethebet, require('../assets/sounds/takethebet.mp3').default);
        this.load.audio(exports.soundKeys.unBecks, require('../assets/sounds/Un Becks.mp3').default);
        this.load.audio(exports.soundKeys.zj, require('../assets/sounds/ZJ.mp3').default);
    }
    //populate needed items for game - "this" is a scene of type Game
    create() {
        lobby_1.default.currentScene = this; //keep track of current scene 
        this.deck = new deck_1.Deck();
        this.selectedCardSprites = [];
        this.currentPlayedCards = new deck_1.Deck();
        this.GameUIHandler = new gameUIHandler_1.default(this);
        this.GameRuleHandler = new gameRuleHandler_1.default(this);
        this.GameTurnHandler = new gameTurnHandler_1.default(this);
        this.InteractiveHandler = new gameInteractiveHandler_1.default(this);
        this.SocketHandler = new gameSocketHandler_1.default(this);
        this.DeckHandler = new deckHandler_1.default(this);
    }
    //make updates to game
    update() {
    }
    /**
     * plays a sound
     * @param key - sound key to play
     */
    playSound(key) {
        var sound = this.sound.add(key);
        sound.play();
    }
    /**
     * switch back to lobby
     */
    gotToLobbyScene() {
        this.scene.switch('Lobby'); // Switch to the Lobby scene
    }
}
exports.default = Game;
//# sourceMappingURL=game.js.map