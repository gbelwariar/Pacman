function PacmanGameCtrl(scoreboardService) {
    this.scoreboardService = scoreboardService;
};

PacmanGameCtrl.prototype.eat = function(pointsToEarn) {
    this.scoreboardService.eat(pointsToEarn);
};

PacmanGameCtrl.prototype.getScore = function() {
    return this.scoreboardService.score;
};


angular
        .module('pacman')
        .controller('PacmanGameCtrl', ['scoreboardService', PacmanGameCtrl]);