import { io } from "socket.io-client";
import Game from "../scenes/game";
import { Card } from '../model/card';
import { Player } from "../model/player";
import CardSprite from "../model/cardSprite";
import { Players } from "../model/players";


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

        //Ready - Create Players
        scene.socket.on('ready', (players) => {
            players.forEach((p: string) => {
                //if player already exists with socketID delete first - TODO
                //
                let newPlayer = new Player(p, "Player " + scene.currentPlayers.numberPlayers());

                scene.currentPlayers.addPlayer(newPlayer);
            })

            //set first turn
            scene.GameHandler.setMyTurn(scene);
        })

        //Deal Cards
        scene.socket.on('dealCards', (players: Player[]) => {
            scene.currentPlayers.setPlayers(players);  //set players with data on all clients
            scene.DeckHandler.displayCards(); 
            scene.dealText.disableInteractive();
            scene.readyText.disableInteractive(); 
            scene.UIHandler.setPlayerNames(scene); 
        })

        //Advance Turn
        scene.socket.on('changeTurn', (cardPlayed: Card) => {
            scene.GameHandler.changeTurn(scene, cardPlayed);
        })

        //Pass Turn
        scene.socket.on('passTurn', () => {
           scene.GameHandler.changeTurn(scene, null)
        })

        //Change Game State
        scene.socket.on('changeGameState', (gameState) => {
            scene.GameHandler.changeGameState(gameState);
            if (gameState === "Initializing") {
                scene.dealText.setInteractive();
                scene.dealText.setColor('#00ffff');
            }
        });

        /**
         * Card Played - show on all clients and remove cards from hand
         */
        scene.socket.on('cardPlayed', (cardPlayed: Card, socketId: string) => {
            scene.GameHandler.playCard(socketId, scene, cardPlayed);
        })


    }



}