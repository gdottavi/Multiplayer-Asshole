import { io } from "socket.io-client";
import Game from "../scenes/game";
import { Card } from '../model/card';
import { Player } from "../model/player";
import {  themeColors } from "./gameUIHandler";
import { setActiveText, setInactiveText } from "../utils/utils";


//server is for production deploy local is for testing
//const localURL = 'http://localhost:3000';
//const serverURL = 'https://asshole-server.onrender.com';

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

        //Reset Game
        scene.socket.on('reset', () => {
            scene.GameTurnHandler.resetGame()
            setActiveText(scene.dealText)
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
            await scene.GameTurnHandler.handlePlayerOut(scene, currentPlayer)
            scene.GameTurnHandler.changeTurn(scene, currentPlayer, nextPlayer, shouldClear)
        })


    }



}