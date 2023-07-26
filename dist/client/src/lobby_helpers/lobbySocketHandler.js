"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const lobby_1 = __importDefault(require("../scenes/lobby"));
const game_1 = __importStar(require("../scenes/game"));
const utils_1 = require("../utils/utils");
const deck_1 = require("../model/deck");
//import { displayPlayerName } from "./lobbyUIHandler";
//server is for production deploy local is for testing
const localURL = 'http://localhost:3000';
const serverURL = 'https://asshole-server.onrender.com';
// Access the Render environment variable directly
const baseURL = process.env.NODE_ENV === 'production' ? serverURL : localURL;
/**
 * Handles socket events for multiplayer functionality
 */
class LobbySocketHandler {
    static getInstance(scene) {
        if (!LobbySocketHandler.instance) {
            LobbySocketHandler.instance = new LobbySocketHandler(scene);
        }
        return LobbySocketHandler.instance;
    }
    constructor(scene) {
        if (LobbySocketHandler.instance) {
            throw new Error("LobbySocketHandler is a singleton, use getInstance() instead.");
        }
        this.addSocketListeners(scene);
        LobbySocketHandler.instance = this;
    }
    addSocketListeners(scene) {
        //server connection
        if (!lobby_1.default.socket) {
            lobby_1.default.socket = (0, socket_io_client_1.io)(baseURL);
        }
        // On connection check for already connected players
        lobby_1.default.socket.on('connect', () => {
            lobby_1.default.socket.emit('getPlayerList');
            console.log("an idiot connected");
        });
        // Display all players already in game
        lobby_1.default.socket.on('playerList', (players) => {
            console.log('before add', players);
            console.log('before add', scene.players);
            players.players.forEach((player) => {
                scene.players.addPlayer(player);
                scene.LobbyUIHandler.addPlayerToGrid(player);
                scene.LobbyUIHandler.updateSelectedRank(player);
            });
            console.log('after add', scene.players);
        });
        // Listen for "playerJoined" event from the server
        lobby_1.default.socket.on("playerJoined", (newPlayer) => {
            scene.players.addPlayer(newPlayer);
            scene.LobbyUIHandler.addPlayerToGrid(newPlayer);
        });
        // Listen for playerExited event from the server
        lobby_1.default.socket.on("playerExited", (removedPlayerSocketId) => {
            //handle player disconnecting from game scene.  
            if (scene !== lobby_1.default.currentScene) {
                if (lobby_1.default.currentScene instanceof game_1.default) {
                    lobby_1.default.currentScene.discardedCards = [];
                    lobby_1.default.currentScene.currentPlayedCards = new deck_1.Deck();
                }
                scene.players.removePlayer(removedPlayerSocketId);
                scene.players.resetPlayers(); //if a player drops the ranks will be out of sync
                lobby_1.default.currentScene.scene.start('Lobby');
                // Add a 3-second delay to allow scene to finish loading before showing message
                setTimeout(() => {
                    (0, utils_1.createToast)(scene, `Someone left the game, restarting.`, 5000, (0, utils_1.getCenterX)(scene), 100);
                }, 2000);
            }
            //handle player disconnecting from lobby scene
            else {
                this.reloadLobby(scene, removedPlayerSocketId);
            }
        });
        // Update player ranks 
        lobby_1.default.socket.on('updateRank', (player, rank) => {
            let scenePlayer = scene.players.getPlayerById(player.socketId);
            scenePlayer.rank = rank;
            scene.LobbyUIHandler.updateSelectedRank(scenePlayer);
        });
        //Listen for "startGame" event from the server
        //Start Game --> Advances from Lobby Scene to Game Scene.  Sends players and socket to game for intialization. 
        lobby_1.default.socket.on("startGame", (currentPlayers) => {
            scene.playSound(game_1.soundKeys.crackBeer);
            scene.scene.start("Game", { players: currentPlayers, socket: lobby_1.default.socket });
        });
    }
    reloadLobby(scene, removedPlayerSocketId) {
        var _a, _b;
        let playerNameExited = (_b = (_a = scene.players.getPlayerById(removedPlayerSocketId)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "Someone";
        scene.players.removePlayer(removedPlayerSocketId);
        (0, utils_1.createToast)(scene, `${playerNameExited} left the game. Ranks Reset.`, 5000, (0, utils_1.getCenterX)(scene), 100);
        scene.LobbyUIHandler.removePlayersFromGrid();
        scene.players.players.forEach(player => {
            player.rank = null;
            scene.LobbyUIHandler.addPlayerToGrid(player);
            scene.LobbyUIHandler.updateSelectedRank(player);
        });
    }
}
LobbySocketHandler.instance = null;
exports.default = LobbySocketHandler;
//# sourceMappingURL=lobbySocketHandler.js.map