/* global enemyService */

function EnemyService(gameboard, enemyMovementMode) {
    // Initialize Blinky.
    var blinkyScatterModeFixedPos = 40;    
    var blinkyHTML = "<img height='20' width='20' src='images/blinky.png' class='horizontal-block'>";
    this.blinky = new Enemy(
                    blinkyHTML, 
                    gameboard,
                    enemyMovementMode,
                    getPositionInGameBoard_(gameboard.board, 'B'),
                    blinkyScatterModeFixedPos,
                    blinkyTargetPosStrategyInNonScatterMode_,
                    null);

    // Initialize Pinky.
    var pinkyScatterModeFixedPos = 0;    
    var pinkyHTML = "<img height='20' width='20' src='images/pinky.png' class='horizontal-block'>";
    this.pinky = new Enemy(
                    pinkyHTML, 
                    gameboard,
                    enemyMovementMode,
                    getPositionInGameBoard_(gameboard.board, 'P'),
                    pinkyScatterModeFixedPos,
                    pinkyTargetPosStrategyInNonScatterMode_,
                    null);

    // Initialize Inky. Note that 'Inky' has 'Blinky' as its dependency.
    var inkyScatterModeFixedPos = gameboard.board.length - 1;    
    var inkyHTML = "<img height='20' width='20' src='images/inky.png' class='horizontal-block'>";
    this.inky = new Enemy(
                    inkyHTML, 
                    gameboard,
                    enemyMovementMode,
                    getPositionInGameBoard_(gameboard.board, 'S'),
                    inkyScatterModeFixedPos,
                    inkyTargetPosStrategyInNonScatterMode_,
                    this.blinky);

    // Initialize Clyde.
    var clydeScatterModeFixedPos = gameboard.board.length - gameboard.breadth;    
    var clydeHTML = "<img height='20' width='20' src='images/clyde.png' class='horizontal-block'>";
    this.clyde = new Enemy(
                    clydeHTML, 
                    gameboard,
                    enemyMovementMode,
                    getPositionInGameBoard_(gameboard.board, 'D'),
                    clydeScatterModeFixedPos,
                    clydeTargetPosStrategyInNonScatterMode_,
                    null);
                    
    this.enemies = {
        blinky: this.blinky,
        pinky: this.pinky,
        inky: this.inky,
        clyde: this.clyde
    };    
}


// Enemy "class".
function Enemy(
        htmlTemplate,
        gameboard,
        enemyMovementMode,
        currentPos,
        scatterModeFixedPos,
        targetPosStrategyInNonScatterMode,
        dependency) {
    this.htmlTemplate_ = htmlTemplate;
    this.gameboard_ = gameboard;
    this.enemyMovementMode_ = enemyMovementMode;
    // The fixed position around which the pacman revolves when it is in the 
    // SCATTER mode.
    this.scatterModeFixedPos = scatterModeFixedPos;
    // The previous position of this enemy. It is 'null' initially.
    this.prevPos_ = null;    
    // The previous position of this enemy.
    this.currentPos_ = currentPos;
    // The previous movement mode. Initially all the enemies start from the
    // scatter mode. Unless and until the mode is changed through the API - 
    // 'this.getNextPos', the enemy follow the same mode as 'this.previousMode_'.
    this.previousMode_ = this.enemyMovementMode_.SCATTER;
    // Assign the dependency of this object as one of its properties. 
    // Currently, the only dependencies are -
    // a) 'Inky' dependent on 'Blinky' object.
    // b) 'Clyde' dependent on itself (non-harmful cyclic dependency).
    if (dependency !== null) {
        this.dependency_ = dependency;
    } else {
        this.dependency_ = this;
    }
    // The strategy used by this enemy to find the target pos when it is in 
    // CHASE or FRIGHTENED mode.
    this.targetPosStrategyInNonScatterMode_ = targetPosStrategyInNonScatterMode;
};  


/**
 * Returns the current position of this enemy.
 * 
 * @return {number}
 */				
Enemy.prototype.getCurrentPos = function() {
    return this.currentPos_;
};


/**
 * Returns the HTML template corresponding to this enemy.
 * 
 * @return {string}
 */				
Enemy.prototype.getHTMLTemplate = function() {
    return this.htmlTemplate_;
};


/**
 * Returns the current position of this enemy.
 * (This "semi-public" API is exposed only to the free functions etc present in 
 * this file).
 * 
 * @return {number}
 */				
Enemy.prototype.getScatterModeFixedPos = function() {
    return this.scatterModeFixedPos;
};


/**
 * Returns the next position of this enemy.
 * 
 * @param {mode} mode The current mode of the enemy.
 * @param {prevPacmanPos} prevPacmanPos Previous position of pacman.
 * @param {currentPacmanPos} currentPacmanPos Current position of pacman.
 * @return {number}
 */				
Enemy.prototype.getNextPos = function(mode, prevPacmanPos, currentPacmanPos) {
    var nextPos;
    var board = this.gameboard_.board;
    var breadth = this.gameboard_.breadth;
    // Initially all are in SCATTER mode hence the control never enters this
    // for loop.
    if (mode !== this.previousMode_) {
        nextPos = this.prevPos_;
    } else {
        /* Case 1 -
         *    W
         * -->E<--
         *   W/G
         */
        if (this.prevPos_ !== null && 
                board.charAt(this.currentPos_ - breadth) === 'W' &&
                (board.charAt(this.currentPos_ + breadth) === 'W' ||
                    board.charAt(this.currentPos_ + breadth) === 'G')) {
            // The condition after the OR operator stands for when the enemy
            // just came from the "transit shortcut" and is at the left-most
            // end of the board.                
            if (this.prevPos_ + 1 === this.currentPos_ ||
                    this.currentPos_ % breadth === 0) {
                nextPos = this.currentPos_ + 1;
            }
            // The condition after the OR operator stands for when the enemy
            // just came from the "transit shortcut" and is at the right most
            // end of the board.
            else if (this.prevPos_ - 1 ===  this.currentPos_ ||
                    (this.currentPos_ + 1) % breadth === 0) {
                nextPos = this.currentPos_ - 1;
            }
        }
        /* Case 2 -
         *  |  
         *  \/
         * WEW
         *  /\  
         *  |
         */
        else if (board.charAt(this.currentPos_ + 1) === 'W' &&
                board.charAt(this.currentPos_ - 1) === 'W') {
            if (this.prevPos_ - breadth === this.currentPos_) {
                nextPos = this.currentPos_ - breadth;
            } else if (this.prevPos_ + breadth ===  this.currentPos_) {
                nextPos = this.currentPos_ + breadth;
            }
        }    
        /* Case 3 -
         *    |
         *    \/ 
         * -->EW
         *    W
         */
        else if (board.charAt(this.currentPos_ + 1) === 'W' &&
                board.charAt(this.currentPos_ + breadth) === 'W') {
            if (this.prevPos_ + breadth === this.currentPos_) {
                nextPos = this.currentPos_ - 1;
            } else if (this.prevPos_ + 1 === this.currentPos_) {
                nextPos = this.currentPos_ - breadth;
            }
        }
        /* Case 4 -
         *    W 
         * -->EW
         *    /\
         *    |
         */
        else if (board.charAt(this.currentPos_ + 1) === 'W' &&
                board.charAt(this.currentPos_ - breadth) === 'W') {
            if (this.prevPos_ - breadth === this.currentPos_) {
                nextPos = this.currentPos_ - 1;
            } else if (this.prevPos_ + 1 === this.currentPos_) {
                nextPos = this.currentPos_ + breadth;
            }
        }
        /* Case 5 -
         *   W 
         *  WE<--
         *   /\
         *   |
         */
        else if (board.charAt(this.currentPos_ - 1) === 'W' &&
                board.charAt(this.currentPos_ - breadth) === 'W') {
            if (this.prevPos_ - breadth === this.currentPos_) {
                nextPos = this.currentPos_ + 1;
            } else if (this.prevPos_ - 1 === this.currentPos_) {
                nextPos = this.currentPos_ + breadth;
            }
        }
        /* Case 6 -
         *   | 
         *   \/
         *  WE<--
         *   W
         */
        else if (board.charAt(this.currentPos_ - 1) === 'W' &&
                board.charAt(this.currentPos_ + breadth) === 'W') {
            if (this.prevPos_ + breadth === this.currentPos_) {
                nextPos = this.currentPos_ + 1;
            } else if (this.prevPos_ - 1 === this.currentPos_) {
                nextPos = this.currentPos_ - breadth;
            }
        }
        // Case 7 - Pacman surrounded by only one/zero tile(s).
        else {
            if (mode === this.enemyMovementMode_.SCATTER) {
                nextPos = this.scatterModeFixedPos;
            } else {
                nextPos = this.targetPosStrategyInNonScatterMode_(
                                board.length,
                                breadth,
                                prevPacmanPos,
                                currentPacmanPos,
                                this.dependency_);
            }
            nextPos = makeChoice_(
                    this.currentPos_, this.prevPos_, nextPos, board, breadth);
        }
    }
    // Handle the case when the the calculated 'nextPos' is "transitable". 
    if (nextPos === this.currentPos_ + 1 &&
            (nextPos % this.gameboard_.breadth === 0)) {
        nextPos = nextPos - this.gameboard_.breadth;
    }
    else if (nextPos === this.currentPos_ - 1 &&
            (this.currentPos_ % this.gameboard_.breadth === 0)) {
        nextPos = this.currentPos_ + this.gameboard_.breadth - 1;
    }
    this.prevPos_ = this.currentPos_;
    this.currentPos_ = nextPos;
    this.previousMode_ = mode;
    return nextPos;
};


function getPositionInGameBoard_(board, character) {
    var res;
    for (var i = 0; i < board.length; i++) {
        if (board.charAt(i) === character) {
            res = i;
        }
    }
    return res;
}


// Blinky's target position strategy in non-scatter mode.
function blinkyTargetPosStrategyInNonScatterMode_(
        boardLength, breadth, prevPacmanPos, currentPacmanPos, dependency) {
    return currentPacmanPos;
}


// Pinky's target position strategy in non-scatter mode.
function pinkyTargetPosStrategyInNonScatterMode_(
        boardLength, breadth, prevPacmanPos, currentPacmanPos, dependency) {
    return getNPositionAheadOfPacman_(
            currentPacmanPos, prevPacmanPos, 4, breadth, boardLength);    
}


// Inky's target position strategy in non-scatter mode.
function inkyTargetPosStrategyInNonScatterMode_(
        boardLength, breadth, prevPacmanPos, currentPacmanPos, dependency) {
    var twoPositionAheadOfCurrentPacmanPos = 
            getNPositionAheadOfPacman_(
                    currentPacmanPos, prevPacmanPos, 2, breadth, boardLength);
    // 'Blinky' is passed as the dependency.
    var blinkyYCoordinate =
            getYCoordinate_(dependency.getCurrentPos(), breadth);
    var blinkyXCoordinate =
            getXCoordinate_(dependency.getCurrentPos(), breadth);
    var twoPositionAheadOfCurrentPacmanPosYCoordinate =
            getYCoordinate_(twoPositionAheadOfCurrentPacmanPos, breadth);
    var twoPositionAheadOfCurrentPacmanPosXCoordinate =
            getXCoordinate_(twoPositionAheadOfCurrentPacmanPos, breadth);
    // Use law of trigonometry to find the target position according to the 
    // strategy mentioned in "The Blue Ghost" section in -
    // http://gameinternals.com/post/2072558330/understanding-pac-man-ghost-behavior
    var targetPos =
            ((2*twoPositionAheadOfCurrentPacmanPosYCoordinate-blinkyYCoordinate)
                * breadth) + 2 * twoPositionAheadOfCurrentPacmanPosXCoordinate -
                blinkyXCoordinate;
    return targetPos;
}


// Clyde's target position strategy in non-scatter mode.
function clydeTargetPosStrategyInNonScatterMode_(
        boardLength, breadth, prevPacmanPos, currentPacmanPos, dependency) {
    if (getDistanceSquare_(
            currentPacmanPos, dependency.getCurrentPos(), breadth) >= 64) {
        return currentPacmanPos;
    } else {
        return dependency.getScatterModeFixedPos();
    }
}


function getNPositionAheadOfPacman_(
        currentPacmanPos, prevPacmanPos, N, breadth, boardLength) {
    var nPositionAheadOfCurrentPacmanPos;
    // The second condition in the below OR statement corresponds to the case
    // when the pacman never moved yet. Then automatically pacman faces towards
    // right and hence follow the same logic as when pacman moves one position
    // towards right and then faces right. Hence the below piece of code
    // assumes that the pacman initially would be facing towards right. 
    if (currentPacmanPos === prevPacmanPos + 1 ||
            currentPacmanPos === prevPacmanPos) {
        // If the nPositionAheadOfCurrentPacmanPos is found as the next row,
        // then adjust it to the rightmost tile in the same row.        
        if ((currentPacmanPos + N > boardLength) ||
                (getYCoordinate_(currentPacmanPos + N, breadth) !==
                getYCoordinate_(currentPacmanPos, breadth))) {
            nPositionAheadOfCurrentPacmanPos =
                    getYCoordinate_(currentPacmanPos, breadth) * breadth
                    + breadth - 1;
        } else  {
            nPositionAheadOfCurrentPacmanPos = currentPacmanPos + N;
        }
    } else if (currentPacmanPos + 1 === prevPacmanPos) {
        // If the nPositionAheadOfCurrentPacmanPos is found as the previous row,
        // then adjust it to the leftmost tile in the same row.
        if ((currentPacmanPos - N < 0) ||
                (getYCoordinate_(currentPacmanPos - N, breadth) !==
                getYCoordinate_(currentPacmanPos, breadth))) {
            nPositionAheadOfCurrentPacmanPos =
                    getYCoordinate_(currentPacmanPos, breadth) * breadth;
        } else  {
            nPositionAheadOfCurrentPacmanPos = currentPacmanPos - N;
        }
    } else if (currentPacmanPos === prevPacmanPos + breadth) {
        // If the nPositionAheadOfCurrentPacmanPos is out of the board, then
        // adjust it to the bottommost tile in the same column.
        if (currentPacmanPos + N * breadth > boardLength) {
            nPositionAheadOfCurrentPacmanPos =
                    getYCoordinate_(boardLength-1, breadth) * breadth +
                    getXCoordinate_(currentPacmanPos, breadth); 
        } else {
            nPositionAheadOfCurrentPacmanPos = currentPacmanPos + N * breadth;
        }

    } else if (currentPacmanPos + breadth === prevPacmanPos) {
        // If the nPositionAheadOfCurrentPacmanPos is out of the board, then
        // adjust it to the topmost tile in the same column.        
        if (currentPacmanPos - N * breadth < 0) {
            nPositionAheadOfCurrentPacmanPos =
                    getXCoordinate_(currentPacmanPos, breadth);
        } else {
            nPositionAheadOfCurrentPacmanPos = currentPacmanPos - N * breadth;
        }
    } 
    return nPositionAheadOfCurrentPacmanPos;
}


function getYCoordinate_(index, breadth) {
    return Math.floor(index / breadth);
}


function getXCoordinate_(index, breadth) {
    return index - getYCoordinate_(index, breadth) * breadth;
}


function getDistanceSquare_(index1, index2, breadth) {
    var diffXCoordinate =
            getXCoordinate_(index1, breadth) - getXCoordinate_(index2, breadth);
    var diffYCoordinate = 
            getYCoordinate_(index1, breadth) - getYCoordinate_(index2, breadth);
    return diffXCoordinate*diffXCoordinate + diffYCoordinate*diffYCoordinate;
}


function makePosAndDistanceSquarePair_(pos, distanceSquare) {
    return {
      pos: pos,
      distanceSquare: distanceSquare
    };
}


function makeChoice_(currentPos, prevPos, targetPos, board, breadth) {
    /**
     * Since the configuration of the board never changes (otherwise it would
     * break a lot of stuffs), hence the indices which corresponds to the 
     * region inside the gate are hard-coded for now. Retrieving it
     * programmatically sounded like an overkill.
     */ 
    var isInsideGate =
            (11*41 + 18 <= currentPos && currentPos <= 11*41 + 22) ||
            (12*41 + 18 <= currentPos && currentPos <= 12*41 + 22) ||
            (13*41 + 18 <= currentPos && currentPos <= 13*41 + 22);
    var nextPosCandidate1 = currentPos + 1;
    var nextPosCandidate2 = currentPos - 1;
    var nextPosCandidate3 = currentPos + breadth;
    var nextPosCandidate4 = currentPos - breadth;
    var distanceSquareBetweenTargetAndCandidate1 =
            (board.charAt(nextPosCandidate1) === 'W' ||
                (board.charAt(nextPosCandidate1) === 'G' &&
                    isInsideGate === false)) ?
                Number.MAX_VALUE :
                getDistanceSquare_(nextPosCandidate1, targetPos, breadth);
    var distanceSquareBetweenTargetAndCandidate2 =
            (board.charAt(nextPosCandidate2) === 'W' ||
                (board.charAt(nextPosCandidate2) === 'G' &&
                    isInsideGate === false)) ?
                Number.MAX_VALUE :
                getDistanceSquare_(nextPosCandidate2, targetPos, breadth);
    var distanceSquareBetweenTargetAndCandidate3 =
            (board.charAt(nextPosCandidate3) === 'W' ||
                (board.charAt(nextPosCandidate3) === 'G' &&
                    isInsideGate === false)) ?
                Number.MAX_VALUE :
                getDistanceSquare_(nextPosCandidate3, targetPos, breadth);
    var distanceSquareBetweenTargetAndCandidate4 =
            (board.charAt(nextPosCandidate4) === 'W' ||
                (board.charAt(nextPosCandidate4) === 'G' &&
                    isInsideGate === false)) ?
                Number.MAX_VALUE :
                getDistanceSquare_(nextPosCandidate4, targetPos, breadth);
    var arr = Array.of(
                makePosAndDistanceSquarePair_(nextPosCandidate1,
                    distanceSquareBetweenTargetAndCandidate1),
                makePosAndDistanceSquarePair_(nextPosCandidate2,
                    distanceSquareBetweenTargetAndCandidate2),
                makePosAndDistanceSquarePair_(nextPosCandidate3,
                    distanceSquareBetweenTargetAndCandidate3),
                makePosAndDistanceSquarePair_(nextPosCandidate4,
                    distanceSquareBetweenTargetAndCandidate4));
    var cmpfunc = function(pair1, pair2) {
        if (pair1.distanceSquare < pair2.distanceSquare) {
            return -1;
        } else if (pair1.distanceSquare > pair2.distanceSquare) {
            return 1;
        } else {
            if (pair1.pos === currentPos - breadth &&
                    pair2.pos === currentPos + breadth) {
                return -1;
            } else if (pair1.pos === currentPos + breadth &&
                    pair2.pos === currentPos - breadth) {
                return 1;
            } else if (pair1.pos === currentPos - breadth &&
                    pair2.pos + 1 === currentPos) {
                return -1;
            } else if (pair1.pos + 1 === currentPos &&
                    pair2.pos === currentPos - breadth) {
                return 1;
            } else if (pair1.pos === currentPos - breadth &&
                    pair2.pos === currentPos + 1) {
                return -1;
            } else if (pair1.pos === currentPos + 1 &&
                    pair2.pos === currentPos - breadth) {
                return 1;
            } else if (pair1.pos === currentPos + breadth &&
                    pair2.pos + 1 === currentPos) {
                return -1;
            } else if (pair1.pos + 1 === currentPos &&
                    pair2.pos === currentPos + breadth) {
                return 1;
            } else if (pair1.pos === currentPos + breadth &&
                    pair2.pos === currentPos + 1) {
                return -1;
            } else if (pair1.pos === currentPos + 1 &&
                    pair2.pos === currentPos + breadth) {
                return 1;
            } else {
                return 0;
            }
        }
    };
    arr.sort(cmpfunc);    
    return ((arr[0].pos === prevPos) ? arr[1].pos : arr[0].pos);
}


angular
        .module('pacman')
        .service('enemyService',
                ['gameboard', 'enemyMovementMode', EnemyService]);
