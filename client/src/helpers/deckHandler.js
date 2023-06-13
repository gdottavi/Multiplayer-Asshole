"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = __importStar(require("./card"));
/**
 * Handles dealing cards to start game
 */
class DeckHandler {
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
                scene.GameHandler.playerHand.push(playerCard.render(475 + (i * 100), 650, playerSprite, card_1.cardType.player));
                let opponentCard = new card_1.default(scene);
                scene.GameHandler.opponentHand.push(opponentCard.render(475 + (i * 100), 125, opponentSprite, card_1.cardType.opponent));
            }
        };
    }
}
exports.default = DeckHandler;
//# sourceMappingURL=deckHandler.js.map