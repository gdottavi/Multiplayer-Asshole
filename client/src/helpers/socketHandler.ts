import { io } from "socket.io-client";
import Game from "../scenes/game";
import { Card } from '../model/card';
import { Player } from "../model/player";
import { themeColors } from "./uiHandler";


//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';

/**
 * Handles socket events for multiplayer functionality
 */
export default class SocketHandler {

    constructor(scene: Game) {

        //server connection
        scene.socket = io(localURL);

        scene.socket.on('connect', () => {
            console.log("Game Connected!");
        })

        //Ready - Create Players from array of socket Ids (players)
        scene.socket.on('ready', (players) => {
            players.forEach((socketID: string) => {
                //if player already exists with socketID delete first - TODO
                let newPlayer = new Player(socketID, "Player " + scene.currentPlayers.numberPlayers());
                scene.currentPlayers.addPlayer(newPlayer);
            })

            //set first turn
            scene.GameTurnHandler.setTurn(scene.currentPlayers.players[0]);
            //update state of menu options
            scene.UIHandler.setActiveText(scene.dealText);
            scene.UIHandler.setInactiveText(scene.readyText);
        })

        //Deal Cards
        scene.socket.on('dealCards', (players: Player[]) => {
            scene.DeckHandler.updateAfterDeal(players);
        })

        // //Between card played and advancing turn check if player is out and if game is over
        // scene.socket.on('handlePlayerOut', () => {
        //     scene.GameTurnHandler.handlePlayerOut();
        // })


        // //Advance Turn
        // scene.socket.on('changeTurn', (nextPlayer: Player, shouldClear: boolean) => {
        //     scene.GameTurnHandler.changeTurn(scene, nextPlayer, shouldClear);
        // })

        //Pass Turn - TODO
        scene.socket.on('passTurn', (currentPlayer: Player, nextPlayer: Player) => {
            scene.GameTurnHandler.changeTurn(scene, currentPlayer, nextPlayer, false, true)
        })

        //Reset Game
        scene.socket.on('reset', () => {
            scene.GameTurnHandler.resetGame(scene)
            scene.UIHandler.setActiveText(scene.dealText)
        })

        //Change Game State
        scene.socket.on('changeGameState', (gameState) => {
            scene.GameRuleHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                scene.dealText.setInteractive();
                scene.dealText.setColor('#00ffff');
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
            await scene.GameRuleHandler.playCards(socketId, cardsPlayed);
            await scene.GameTurnHandler.handlePlayerOut(currentPlayer.socketId);
            scene.GameTurnHandler.changeTurn(scene, currentPlayer, nextPlayer, shouldClear); 
        })


    }



}