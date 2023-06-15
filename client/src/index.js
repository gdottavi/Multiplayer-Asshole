import * as Phaser from "phaser";
import Game from "./scenes/game";
const width = window.innerWidth * window.devicePixelRatio;
const height = window.innerHeight * window.devicePixelRatio;
const config = {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1280,
    height: 720,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Game
    ]
};
const game = new Phaser.Game(config);
//# sourceMappingURL=index.js.map