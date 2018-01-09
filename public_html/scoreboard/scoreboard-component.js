var scoreboardComponent = {
    controller: 'ScoreboardCtrl',
    controllerAs: 'scoreboardCtrl',
    templateUrl: 'scoreboard/scoreboard.html'
};


angular
        .module('pacman')
        .component('scoreboard', scoreboardComponent);