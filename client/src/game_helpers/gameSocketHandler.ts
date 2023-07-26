import { io } from "socket.io-client";
import Game from "../scenes/game";
import { Card } from '../model/card';
import { Player } from "../model/player";
import {  themeColors } from "./gameUIHandler";
import { createToast, getCenterX, setActiveText, setInactiveText } from "../utils/utils";

//TODO - MAKE THIS STATIC - CAUSING ISSUES BY having multiple event listeners for sockets
/**
 * Handles socket events for multiplayer functionality
 */
export default class SocketHandler {

    static instance = null;
    scene: Game;
    static getInstance(scene: Game) {
        if (!SocketHandler.instance) {
            SocketHandler.instance = new SocketHandler(scene);
        }
        return SocketHandler.instance;
    }

    constructor(scene: Game) {

        if (SocketHandler.instance) {
            throw new Error("SocketHandler is a singleton, use getInstance() instead.");
        }

        this.scene = scene;
        this.addSocketListeners();

        SocketHandler.instance = this;
    }


    addSocketListeners() {

        //Deal Cards
        this.scene.socket.on('dealCards', (playerData: any) => {
            this.scene.DeckHandler.updateAfterDeal(playerData);
        })

        //Pass Turn 
        this.scene.socket.on('passTurn', (currentPlayer: Player, nextPlayer: Player) => {
            this.scene.GameTurnHandler.changeTurn(this.scene, currentPlayer, nextPlayer, false, true)
        })

        //Cards Added To Player (e.g. tried to end on 2 or 4)
        this.scene.socket.on('cardsAdded', (updatedPlayer: Player, cards: Card[]) => {
            this.scene.DeckHandler.updateAfterCardAdd(updatedPlayer, cards)
        })

        //Reset Game
        this.scene.socket.on('reset', () => {
            console.log('reset')
            this.scene.GameTurnHandler.resetGame()
        })

        //Change Game State
        this.scene.socket.on('changeGameState', (gameState) => {
            this.scene.GameRuleHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                this.scene.dealText.setInteractive();
                this.scene.dealText.setColor(themeColors.cyan);
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
        this.scene.socket.on('playCards', async (cardsPlayed: Card[], socketId: string, shouldClear: boolean, currentPlayer: Player, nextPlayer: Player) => {
            await this.scene.GameRuleHandler.playCards(socketId, cardsPlayed)
            await this.scene.GameTurnHandler.handleEndTwoFour(cardsPlayed, currentPlayer); 
            await this.scene.GameTurnHandler.handlePlayerOut(this.scene, currentPlayer)
            this.scene.GameTurnHandler.changeTurn(this.scene, currentPlayer, nextPlayer, shouldClear)
            console.log('socket on play cards', this.scene.currentPlayers)
        })

     
    }



}