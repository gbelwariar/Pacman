/* global scoreboardService */

function ScoreboardService($rootScope) {
    this.rootScope = $rootScope;
    this.score = 0;
}

ScoreboardService.prototype.eat = function(pointsToEarn) {
    this.score += pointsToEarn;
    this.rootScope.$apply();
};


angular
        .module('pacman')
        .service('scoreboardService', ['$rootScope', ScoreboardService]);