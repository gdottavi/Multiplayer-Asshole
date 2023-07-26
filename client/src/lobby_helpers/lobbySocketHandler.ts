import { io } from "socket.io-client";
import { Player } from "../model/player";
import Lobby from "../scenes/lobby";
import { Players } from "../model/players";
import Game, { soundKeys } from "../scenes/game";
import { createToast, getCenterX } from "../utils/utils";
import { Deck } from "../model/deck";
//import { displayPlayerName } from "./lobbyUIHandler";


//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';
// Access the Render environment variable directly
const baseURL = process.env.NODE_ENV === 'production' ? serverURL : localURL;

/**
 * Handles socket events for multiplayer functionality
 */
export default class LobbySocketHandler {

    static instance = null;
    static getInstance(scene: Lobby) {
        if (!LobbySocketHandler.instance) {
            LobbySocketHandler.instance = new LobbySocketHandler(scene);
        }
        return LobbySocketHandler.instance;
    }

    private constructor(scene: Lobby) {
        if (LobbySocketHandler.instance) {
            throw new Error("LobbySocketHandler is a singleton, use getInstance() instead.");
        }

        this.addSocketListeners(scene);

        LobbySocketHandler.instance = this;
    }

    private addSocketListeners(scene: Lobby) {

        //server connection
        if (!Lobby.socket) {
            Lobby.socket = io(baseURL);
        }

        // On connection check for already connected players
        Lobby.socket.on('connect', () => {
            Lobby.socket.emit('getPlayerList')
            console.log("an idiot connected")
        })


        // Display all players already in game
        Lobby.socket.on('playerList', (players: Players) => {
            console.log('before add', players)
            console.log('before add', scene.players)
            players.players.forEach((player: Player) => {
                scene.players.addPlayer(player);
                scene.LobbyUIHandler.addPlayerToGrid(player);
                scene.LobbyUIHandler.updateSelectedRank(player);
            })
            console.log('after add',scene.players)
        })

        // Listen for "playerJoined" event from the server
        Lobby.socket.on("playerJoined", (newPlayer: Player) => {
            scene.players.addPlayer(newPlayer);
            scene.LobbyUIHandler.addPlayerToGrid(newPlayer);
        });

        // Listen for playerExited event from the server
        Lobby.socket.on("playerExited", (removedPlayerSocketId: string) => {

            //handle player disconnecting from game scene.  
            if (scene !== Lobby.currentScene) {

                if (Lobby.currentScene instanceof Game) {
                    Lobby.currentScene.discardedCards = [];
                    Lobby.currentScene.currentPlayedCards = new Deck();
                }

                scene.players.removePlayer(removedPlayerSocketId);
                scene.players.resetPlayers(); //if a player drops the ranks will be out of sync

                Lobby.currentScene.scene.start('Lobby')

                // Add a 3-second delay to allow scene to finish loading before showing message
                setTimeout(() => {
                    createToast(scene, `Someone left the game, restarting.`, 5000, getCenterX(scene), 100);
                }, 2000);

            }
            //handle player disconnecting from lobby scene
            else {
                this.reloadLobby(scene, removedPlayerSocketId)
            }

        });

        // Update player ranks 
        Lobby.socket.on('updateRank', (player: Player, rank: number) => {
            let scenePlayer = scene.players.getPlayerById(player.socketId)
            scenePlayer.rank = rank
            scene.LobbyUIHandler.updateSelectedRank(scenePlayer);

        })

        //Listen for "startGame" event from the server
        //Start Game --> Advances from Lobby Scene to Game Scene.  Sends players and socket to game for intialization. 
        Lobby.socket.on("startGame", (currentPlayers) => {
            scene.playSound(soundKeys.crackBeer);
            scene.scene.start("Game", { players: currentPlayers, socket: Lobby.socket })
        })


    }

    private reloadLobby(scene: Lobby, removedPlayerSocketId: string) {
        let playerNameExited = scene.players.getPlayerById(removedPlayerSocketId)?.name ?? "Someone";

        scene.players.removePlayer(removedPlayerSocketId);

        createToast(scene, `${playerNameExited} left the game. Ranks Reset.`, 5000, getCenterX(scene), 100);


        scene.LobbyUIHandler.removePlayersFromGrid();

        scene.players.players.forEach(player => {
            player.rank = null;
            scene.LobbyUIHandler.addPlayerToGrid(player);
            scene.LobbyUIHandler.updateSelectedRank(player);
        });
    }
}