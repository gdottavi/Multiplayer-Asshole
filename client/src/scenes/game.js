import { Scene } from "phaser";
import InteractiveHandler from "../helpers/interactiveHandler";
import SocketHandler from "../helpers/socketHandler";
import UIHandler from "../helpers/uiHandler";
import GameHandler from "../helpers/gameHandler";
import DeckHandler from "../helpers/deckHandler";
import { ranks, suites } from "../model/card";
import { Deck } from "../model/deck";
export default class Game extends Scene {
    constructor() {
        super({
            key: 'Game',
        });
    }
    //load everything needed for game 
    preload() {
        //load all playing card images
        let path = '../assets/white/';
        let suite, rank;
        this.load.image('CardBack', require('../assets/CardBack.png').default);
        for (suite in suites) {
            for (rank in ranks) {
                let key = suites[suite] + ranks[rank];
                this.load.image(key, require(`../assets/white/${suites[suite]}${ranks[rank]}.png`).default);
            }
        }
    }
    //populate needed items for game
    create() {
        this.deck = new Deck();
        this.players = [];
        this.UIHandler = new UIHandler(this);
        this.GameHandler = new GameHandler(this);
        this.InteractiveHandler = new InteractiveHandler(this);
        this.SocketHandler = new SocketHandler(this);
        this.DeckHandler = new DeckHandler(this);
    }
    //make updates to game
    update() {
    }
}
//# sourceMappingURL=game.js.map