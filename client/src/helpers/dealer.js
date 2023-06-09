"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = __importDefault(require("./card"));
class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let playerSprite, opponentSprite;
            //only show cards to current player
            if (scene.isPlayerA) {
                playerSprite = 'cyanCardFront';
                opponentSprite = 'magentaCardBack';
            }
            else {
                playerSprite = 'magentaCardFront';
                opponentSprite = 'cyanCardBack';
            }
            for (let i = 0; i < 5; i++) {
                let playerCard = new card_1.default(scene);
                playerCard.render(475 + (i * 100), 650, playerSprite);
                let opponentCard = new card_1.default(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite).disableInteractive());
            }
        };
    }
}
exports.default = Dealer;
//# sourceMappingURL=dealer.js.map