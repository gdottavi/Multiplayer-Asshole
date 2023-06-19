import { Scene } from "phaser";
import InteractiveHandler from "../helpers/interactiveHandler";
import SocketHandler from "../helpers/socketHandler";
import UIHandler from "../helpers/uiHandler";
import GameHandler from "../helpers/gameHandler";
import DeckHandler from "../helpers/deckHandler";
import { Deck } from "../model/deck";
import { Players } from "../model/players";
import { suites, values } from "../model/card";
export default class Game extends Scene {
    constructor() {
        super({
            key: 'Game',
        });
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
    }
    //populate needed items for game - "this" is a scene of type Game
    create() {
        this.deck = new Deck();
        this.currentPlayers = new Players();
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