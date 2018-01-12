function PacmanGameCtrl(scoreboardService) {
    this.scoreboardService = scoreboardService;
};


/**
 * Eat the pac-dot and earn points.
 * 
 * @param {number} pointsToEarn The number of points to earn.
 */				
PacmanGameCtrl.prototype.eat = function(pointsToEarn) {
    this.scoreboardService.eat(pointsToEarn);
};


/**
 * Fetches the current score from scoreboard.
 * 
 * @return {number}
 */				
PacmanGameCtrl.prototype.getScore = function() {
    return this.scoreboardService.score;
};


angular
        .module('pacman')
        .controller('PacmanGameCtrl', ['scoreboardService', PacmanGameCtrl]);
