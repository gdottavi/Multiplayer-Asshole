import { Deck } from "../model/deck";
import CardSprite from "../model/cardSprite";
export default class GameHandler {
    constructor(scene) {
        this.gameState = "Initializing" /* gameState.Initializing */;
        this.isMyTurn = false;
        this.currentTurnPlayer = scene.currentPlayers.players[0];
        this.changeGameState = (gameState) => {
            this.gameState = gameState;
        };
    }
    /**
     * Advances turn to next eligible player
     * @param scene
     */
    changeTurn(scene) {
        let nextPlayerPos = 0;
        //find index of current player in active players
        let currentPlayerPosition = scene.currentPlayers.players.findIndex(p => p.getId() === this.currentTurnPlayer.getId());
        //set back to first player if at end
        if (currentPlayerPosition >= (scene.currentPlayers.numberPlayers() - 1) || currentPlayerPosition == -1) {
            currentPlayerPosition = 0;
        }
        else
            currentPlayerPosition++;
        this.currentTurnPlayer = scene.currentPlayers.players[currentPlayerPosition];
        this.setMyTurn(scene);
    }
    /**
     *
     * @param socketId
     * @param scene
     * @param cardPlayed
     */
    playCard(socketId, scene, cardPlayed) {
        this.lastPlayedHand = new Deck();
        if (socketId !== scene.socket.id) {
            //find which player played the card and remove from their hand
            let player = scene.currentPlayers.players.find(p => p.getId() === socketId);
            player.cardHand.filter(c => c.key !== cardPlayed.key);
            player.removeCard(cardPlayed);
            //find sprite associated with the card played and remove it
            let spriteToDestroy = scene.children.list.find(obj => {
                var _a;
                if (obj instanceof CardSprite) {
                    return ((_a = obj === null || obj === void 0 ? void 0 : obj.card) === null || _a === void 0 ? void 0 : _a.key) === cardPlayed.key;
                }
            });
            spriteToDestroy.destroy(true);
            //show card played in middle for everyone
            console.log(scene.currentPlayedCards.getNumberCards());
            scene.DeckHandler.renderCard(scene, cardPlayed, ((scene.dropZone.x - 350) + (scene.currentPlayedCards.getNumberCards() * 50)), (scene.dropZone.y), 0.15, cardPlayed.FrontImageSprite, false);
        }
        //add cards to all cards played
        scene.currentPlayedCards.addCard(cardPlayed);
        console.log("cards played", scene.currentPlayedCards);
        //add card to last hand to beat unless a 4
        if (cardPlayed.value !== '4') {
            this.lastPlayedHand.addCard(cardPlayed);
        }
    }
    /**
     * sets currently client turn
     * @param scene
     */
    setMyTurn(scene) {
        if (this.currentTurnPlayer == null) {
            this.currentTurnPlayer = scene.currentPlayers.players[0];
        }
        if (this.currentTurnPlayer.getId() === scene.socket.id) {
            this.isMyTurn = true;
        }
        else {
            this.isMyTurn = false;
        }
    }
    /**
     * Determines if a card played is valid and beats existing cards on table
     * @param cardPlayed
     */
    canPlay(cardPlayed) {
        if (this.lastPlayedHand == null || this.lastPlayedHand.getNumberCards() === 0) {
            return true;
        }
        //check if card value is higher than last card played
        if (cardPlayed.value < this.lastPlayedHand.cards[0].value) {
            alert("Card value not high enough to beat previous play");
            return false;
        }
        //check if 2 and clear
        //check if 4 or double and set skip
        return true;
    }
}
//# sourceMappingURL=gameHandler.js.map