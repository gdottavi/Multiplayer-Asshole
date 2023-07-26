import { io } from "socket.io-client";
import Game from "../scenes/game";
import { Card } from '../model/card';
import { Player } from "../model/player";
import {  themeColors } from "./gameUIHandler";
import { createToast, getCenterX, setActiveText, setInactiveText } from "../utils/utils";


/**
 * Handles socket events for multiplayer functionality
 */
export default class SocketHandler {

    constructor(scene: Game) {

        //Deal Cards
        scene.socket.on('dealCards', (playerData: any) => {
            scene.DeckHandler.updateAfterDeal(playerData);
        })

        //Pass Turn 
        scene.socket.on('passTurn', (currentPlayer: Player, nextPlayer: Player) => {
            scene.GameTurnHandler.changeTurn(scene, currentPlayer, nextPlayer, false, true)
        })

        //Cards Added To Player (e.g. tried to end on 2 or 4)
        scene.socket.on('cardsAdded', (updatedPlayer: Player, cards: Card[]) => {
            scene.DeckHandler.updateAfterCardAdd(updatedPlayer, cards)
        })

        //Reset Game
        scene.socket.on('reset', () => {
            scene.GameTurnHandler.resetGame()
        })

        //Change Game State
        scene.socket.on('changeGameState', (gameState) => {
            scene.GameRuleHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                scene.dealText.setInteractive();
                scene.dealText.setColor(themeColors.cyan);
            }
        });

        /**
         * Card Played Handling for all Clients
         *   - show cards played on all clients
         *   - remove cards form opponent hands
         *   - check if should clear played cards
         *   - handle players winning/exiting game
         *   - handle updating turn
         */
        scene.socket.on('playCards', async (cardsPlayed: Card[], socketId: string, shouldClear: boolean, currentPlayer: Player, nextPlayer: Player) => {
            await scene.GameRuleHandler.playCards(socketId, cardsPlayed)
            await scene.GameTurnHandler.handleEndTwoFour(cardsPlayed, currentPlayer); 
            await scene.GameTurnHandler.handlePlayerOut(scene, currentPlayer)
            scene.GameTurnHandler.changeTurn(scene, currentPlayer, nextPlayer, shouldClear)
            console.log('socket on play cards', scene.currentPlayers)
        })

     
    }



}