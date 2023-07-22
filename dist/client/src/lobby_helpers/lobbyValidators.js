"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateName = exports.getRankString = exports.generateRankOptions = exports.validateRanks = void 0;
/**
 * Validates that no duplicate ranks have been assigned to players in game
 * @param players - players in game
 * @returns - true if all players in game have unique ranks, false otherwise
 */
function validateRanks(players) {
    const rankSet = new Set(); // Set to store unique ranks
    for (const player of players) {
        if (rankSet.has(player.rank)) {
            return false; // Duplicate rank found
        }
        rankSet.add(player.rank);
    }
    return true; // No duplicate ranks found
}
exports.validateRanks = validateRanks;
/**
 * Produces list of rank options given players in the game
 * @param scene
 * @param player
 * @returns
 */
function generateRankOptions(scene, player) {
    const numberOfPlayers = scene.players.numberPlayers();
    const rankOptions = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        rankOptions.push({ label: `${i + 1}`, value: i });
    }
    return rankOptions;
}
exports.generateRankOptions = generateRankOptions;
/**
 * Gets the display associated with a given rank
 * @param rank - number rank
 */
function getRankString(rank) {
    return `${rank + 1}`;
}
exports.getRankString = getRankString;
/**
 * Ensures name is valid
 * @param name - player name to validate
 * @returns - true if valid, false otherwise
 */
function validateName(name) {
    if (name === "") {
        return false;
    }
    if (name.length > 20) {
        return false;
    }
    return true;
}
exports.validateName = validateName;
//# sourceMappingURL=lobbyValidators.js.map