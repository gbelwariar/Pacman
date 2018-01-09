/* global enemyMovementMode */

var mode = {
    SCATTER: 'Scatter',
    FRIGHTENED: 'Frightened',
    CHASE: 'Chase'
};


angular
        .module('pacman')
        .constant('enemyMovementMode', mode);
