import * as Phaser from "phaser";
import Game from "./scenes/game";
import Lobby from "./scenes/lobby";

const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio; 

const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 1280,
    height: 720,
	dom: {
        createContainer: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {y: 0}
        }
        
    },
    scene: [
        Lobby,
        Game
    ]
};

const game = new Phaser.Game(config);