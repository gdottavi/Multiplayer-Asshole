import { Scene } from "phaser";
import InteractiveHandler from "../game_helpers/gameInteractiveHandler";
import SocketHandler from "../game_helpers/gameSocketHandler";
import GameUIHandler from "../game_helpers/gameUIHandler";
import GameRuleHandler from "../game_helpers/gameRuleHandler";
import DeckHandler from "../game_helpers/deckHandler";
import { Deck } from "../model/deck";
import { Players } from "../model/players";
import { suites, values } from "../model/card";
import GameTurnHandler from "../game_helpers/gameTurnHandler";
import { Player } from "../model/player";
import Lobby from "./lobby";
export const soundKeys = {
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
export default class Game extends Scene {
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
        const deserializedPlayers = players.map(playerData => Player.deserialize(playerData));
        this.currentPlayers = new Players();
        this.currentPlayers.setPlayers(deserializedPlayers);
        this.socket = socket;
    }
    //load everything needed for game 
    preload() {
        //load all playing card images
        this.load.image('CardBack', require('../assets/CardBack.png').default);
        suites.forEach(suite => {
            values.forEach(value => {
                let key = suite + value;
                this.load.image(key, require('../assets/white/' + key + '.png').default);
            });
        });
        //load sounds
        this.load.audio(soundKeys.crackBeer, require('../assets/sounds/opening-beer-can.mp3').default);
        this.load.audio(soundKeys.antiFoaming, require('../assets/sounds/Anti Foaming.mp3').default);
        this.load.audio(soundKeys.ballBag, require('../assets/sounds/Ballbag.mp3').default);
        this.load.audio(soundKeys.betterDrunk, require('../assets/sounds/Better Drunk.mp3').default);
        this.load.audio(soundKeys.brainEm, require('../assets/sounds/Brain Em.mp3').default);
        this.load.audio(soundKeys.asshole, require('../assets/sounds/Drink 45.mp3').default);
        this.load.audio(soundKeys.gameOfSolders, require('../assets/sounds/Game of Soldiers.mp3').default);
        this.load.audio(soundKeys.graduatedCylinder, require('../assets/sounds/Graduated Cylinder.mp3').default);
        this.load.audio(soundKeys.lookingGood, require('../assets/sounds/lookingood.mp3').default);
        this.load.audio(soundKeys.notAgain, require('../assets/sounds/Not Again.mp3').default);
        this.load.audio(soundKeys.offspringWhore, require('../assets/sounds/offspring Whore.mp3').default);
        this.load.audio(soundKeys.oldCountry, require('../assets/sounds/Old Country.mp3').default);
        this.load.audio(soundKeys.password, require('../assets/sounds/Password.mp3').default);
        this.load.audio(soundKeys.popo, require('../assets/sounds/Popo.mp3').default);
        this.load.audio(soundKeys.ramUrine, require('../assets/sounds/Ram Urine.mp3').default);
        this.load.audio(soundKeys.sitMiddle, require('../assets/sounds/Sit Middle.mp3').default);
        this.load.audio(soundKeys.someoneDied, require('../assets/sounds/Someone Died.mp3').default);
        this.load.audio(soundKeys.takethebet, require('../assets/sounds/takethebet.mp3').default);
        this.load.audio(soundKeys.unBecks, require('../assets/sounds/Un Becks.mp3').default);
        this.load.audio(soundKeys.zj, require('../assets/sounds/ZJ.mp3').default);
    }
    //populate needed items for game - "this" is a scene of type Game
    create() {
        Lobby.currentScene = this; //keep track of current scene 
        this.deck = new Deck();
        this.selectedCardSprites = [];
        this.currentPlayedCards = new Deck();
        this.discardedCards = [];
        this.GameUIHandler = new GameUIHandler(this);
        this.GameRuleHandler = new GameRuleHandler(this);
        this.GameTurnHandler = new GameTurnHandler(this);
        this.InteractiveHandler = new InteractiveHandler(this);
        this.SocketHandler = new SocketHandler(this);
        this.DeckHandler = new DeckHandler(this);
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
//# sourceMappingURL=game.js.map