function ScoreboardCtrl($scope, scoreboardService) {
    this.score = scoreboardService.score;
    $scope.$watch(
            function() {return scoreboardService.score;},
            (function(newVal, oldVal){
                if (newVal !== oldVal) {
                    this.score = scoreboardService.score;
                }
            }).bind(this));
}


angular
        .module('pacman')
        .controller('ScoreboardCtrl',
                    ['$scope', 'scoreboardService', ScoreboardCtrl]);