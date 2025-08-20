/**
 * Game Service - Mode-agnostic utilities for Suspect Everyone
 * Shared logic between Detective and Killer game modes
 */

export class GameService {
    
    // ===== ARRAY UTILITIES =====
    
    /**
     * Proper Fisher-Yates shuffle algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} - New shuffled array
     */
    static shuffle(array) {
        const shuffled = [...array]; // Create a copy
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Deep clone suspect array
     * @param {Array} susArray - Array of suspect objects
     * @returns {Array} - Cloned array
     */
    static cloneSuspectArray(susArray) {
        return susArray.map(obj => Object.assign({}, obj));
    }

    /**
     * Convert flat array to 5x5 grid
     * @param {Array} susArray - Flat array of 25 suspects
     * @returns {Array} - 2D array (5x5 grid)
     */
    static populateBoardArray(susArray) {
        return susArray.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / 5);
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = []; // start a new chunk
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
        }, []);
    }

    // ===== BOARD UTILITIES =====

    /**
     * Find coordinates of a suspect by ID
     * @param {Array} suspects - 2D array of suspects
     * @param {Number} personId - Suspect ID to find
     * @returns {Array} - [rowIndex, colIndex] or [null, null] if not found
     */
    static getLocation(suspects, personId) {
        for (const [rowIndex, row] of suspects.entries()) {
            for (const [colIndex, suspect] of row.entries()) {
                if (suspect.id === personId) {
                    return [rowIndex, colIndex];
                }
            }
        }
        return [null, null];
    }

    /**
     * Get adjacent valid positions around a location
     * @param {Array} suspects - 2D array of suspects
     * @param {Array} location - [rowIndex, colIndex]
     * @param {Boolean} includeCenter - Include the center position
     * @returns {Array} - Array of valid adjacent coordinates
     */
    static getAdjacent(suspects, location, includeCenter = false) {
        const [rowIndex, colIndex] = location;
        const rowMinus = rowIndex - 1;
        const rowPlus = rowIndex + 1;
        const colMinus = colIndex - 1;
        const colPlus = colIndex + 1;

        let adjacent = [
            // top row
            [rowMinus, colMinus], [rowMinus, colIndex], [rowMinus, colPlus],
            // mid row
            [rowIndex, colMinus], /* center position */ [rowIndex, colPlus],
            // bottom row
            [rowPlus, colMinus], [rowPlus, colIndex], [rowPlus, colPlus]
        ];

        if (includeCenter) {
            adjacent.splice(4, 0, [rowIndex, colIndex]);
        }

        // Filter for valid positions with living suspects
        return adjacent.filter(([row, col]) => {
            return row >= 0 && row <= 4 && 
                   col >= 0 && col <= 4 && 
                   suspects[row][col].alive;
        });
    }

    /**
     * Get suspects in a specific column
     * @param {Array} suspects - 2D array of suspects
     * @param {Number} index - Column index
     * @returns {Array} - Array of suspects in column
     */
    static getSuspectCol(suspects, index) {
        return suspects.map(row => row[index]);
    }

    /**
     * Get suspects in a specific row
     * @param {Array} suspects - 2D array of suspects
     * @param {Number} index - Row index
     * @returns {Array} - Array of suspects in row
     */
    static getSuspectRow(suspects, index) {
        return suspects[index];
    }

    /**
     * Shift elements in an array based on direction
     * @param {Array} toShift - Array to shift (will be modified)
     * @param {String} direction - 'up', 'down', 'left', 'right'
     * @returns {Array} - Modified array
     */
    static shiftSuspect(toShift, direction) {
        switch (direction) {
            case 'up':
                const shiftingUp = toShift[0];
                toShift.splice(0, 1);
                toShift.push(shiftingUp);
                return toShift;
            case 'down':
                const shiftingDown = toShift[4];
                toShift.splice(4, 1);
                toShift.unshift(shiftingDown);
                return toShift;
            case 'left':
                const shiftingLeft = toShift[0];
                toShift.splice(0, 1);
                toShift.push(shiftingLeft);
                return toShift;
            case 'right':
                const shiftingRight = toShift[4];
                toShift.splice(4, 1);
                toShift.unshift(shiftingRight);
                return toShift;
            default:
                return toShift;
        }
    }

    /**
     * Move board rows or columns
     * @param {Array} suspects - 2D array of suspects
     * @param {Number} index - Row/column index to move
     * @param {String} direction - 'up', 'down', 'left', 'right'
     * @returns {Array} - New 2D array with moved suspects
     */
    static moveBoard(suspects, index, direction) {
        const newSuspects = suspects.map(row => [...row]); // Deep copy

        if (direction === 'left' || direction === 'right') {
            // Move row
            newSuspects[index] = this.shiftSuspect([...newSuspects[index]], direction);
        } else {
            // Move column (up or down)
            const columnData = this.getSuspectCol(newSuspects, index);
            const shiftedColumn = this.shiftSuspect([...columnData], direction);
            
            // Apply shifted column back to the grid
            newSuspects.forEach((row, rowIndex) => {
                row[index] = shiftedColumn[rowIndex];
            });
        }

        return newSuspects;
    }

    // ===== GAME INITIALIZATION =====

    /**
     * Initialize game data with shuffled suspects and evidence
     * @param {Array} suspectList - Original suspect list
     * @param {Object} gameMode - Game mode specific settings
     * @returns {Object} - Initial game state
     */
    static initializeGame(suspectList, gameMode = {}) {
        const suspects = this.shuffle(this.cloneSuspectArray(suspectList));
        const evidenceDeck = this.shuffle(this.cloneSuspectArray(suspectList));
        
        const baseState = {
            suspects: this.populateBoardArray(suspects),
            evidenceDeck: evidenceDeck,
            killCount: 0,
            modalState: gameMode.startWithModal !== false, // Default true
            won: false,
            lost: false,
            showArrestList: false,
            arrestList: []
        };

        return baseState;
    }

    // ===== SUSPECT MANAGEMENT =====

    /**
     * Give alibi to a suspect
     * @param {Array} suspects - 2D array of suspects
     * @param {Number} suspectId - ID of suspect to give alibi
     * @returns {Array} - Updated suspects array
     */
    static alibiSuspect(suspects, suspectId) {
        const [rowIndex, colIndex] = this.getLocation(suspects, suspectId);
        if (rowIndex !== null && colIndex !== null) {
            const newSuspects = suspects.map(row => [...row]);
            newSuspects[rowIndex][colIndex].alibied = true;
            return newSuspects;
        }
        return suspects;
    }

    /**
     * Kill a suspect
     * @param {Array} suspects - 2D array of suspects
     * @param {Number} suspectId - ID of suspect to kill
     * @returns {Array} - Updated suspects array
     */
    static killSuspect(suspects, suspectId) {
        const [rowIndex, colIndex] = this.getLocation(suspects, suspectId);
        if (rowIndex !== null && colIndex !== null) {
            const newSuspects = suspects.map(row => [...row]);
            newSuspects[rowIndex][colIndex].alive = false;
            return newSuspects;
        }
        return suspects;
    }

    /**
     * Remove alibi from player's alibi list when they're killed
     * @param {Array} alibiList - Current alibi list
     * @param {Array} evidenceDeck - Evidence deck to draw from
     * @param {Number} suspectId - ID of killed suspect
     * @returns {Object} - {alibiList, evidenceDeck} updated arrays
     */
    static removeAlibiFromPlayer(alibiList, evidenceDeck, suspectId) {
        const newAlibiList = [...alibiList];
        const newEvidenceDeck = [...evidenceDeck];
        
        for (let i = 0; i < newAlibiList.length; i++) {
            if (newAlibiList[i].id === suspectId) {
                // Remove the alibi
                newAlibiList.splice(i, 1);
                // Add a new card if available
                if (newEvidenceDeck.length > 0) {
                    newAlibiList.push(newEvidenceDeck.splice(0, 1)[0]);
                }
                break;
            }
        }

        return {
            alibiList: newAlibiList,
            evidenceDeck: newEvidenceDeck
        };
    }
}