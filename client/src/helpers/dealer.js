import Card, { cardType } from "./card";
export default class Dealer {
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
                let playerCard = new Card(scene);
                playerCard.render(475 + (i * 100), 650, playerSprite, cardType.player);
                let opponentCard = new Card(scene);
                scene.opponentCards.push(opponentCard.render(475 + (i * 100), 125, opponentSprite, cardType.opponent));
            }
        };
    }
}
//# sourceMappingURL=dealer.js.map