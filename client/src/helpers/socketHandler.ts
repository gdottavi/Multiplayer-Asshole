import { io } from "socket.io-client";
import Game from "../scenes/game";
import { Card, cardType } from '../model/card';
import { Player } from "../model/player";


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
                let newPlayer = new Player(p, "Greg" + scene.players.length);
                scene.players.push(newPlayer)
            })
            console.log(scene.players)

            //set first turn
            scene.GameHandler.setMyTurn(scene); 
            console.log(scene.GameHandler.currentTurnPlayer)
        })

        //Deal Cards
        scene.socket.on('dealCards', (socketId: string, players: []) => {
            scene.DeckHandler.dealCards(socketId);
            scene.dealText.disableInteractive();
        })

        //Advance Turn
        scene.socket.on('changeTurn', () => {
            console.log("changing turn")
            scene.GameHandler.changeTurn(scene);
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

            console.log("card played received :", cardPlayed)
            //only perform on clients that did not play the card
           if (socketId !== scene.socket.id) {
                //scene.GameHandler.opponentHand.pop();
                //find which player played the card and remove from their hand - TODO


                scene.DeckHandler.renderCard(scene, cardPlayed,((scene.dropZone.x - 350) + (scene.dropZone.data.values.cards * 50)), (scene.dropZone.y), 0.15,
                    cardPlayed.FrontImageSprite, false); 

                scene.dropZone.data.values.cards++; 
            } 
        })


    }
}