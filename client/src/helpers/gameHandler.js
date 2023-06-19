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
        this.currentPlayedCards = new Deck();
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
            scene.DeckHandler.renderCard(scene, cardPlayed, ((scene.dropZone.x - 350) + (scene.dropZone.data.values.cards * 50)), (scene.dropZone.y), 0.15, cardPlayed.FrontImageSprite, false);
        }
        //add cards to cards played array
        this.currentPlayedCards.addCard(cardPlayed);
        console.log("cards played", this.currentPlayedCards);
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
        return false;
    }
}
//# sourceMappingURL=gameHandler.js.map