// Properly comment out and mention the parameters and the return values.
function pacmanGameDirective(
        $document, $interval, gameboard, enemyMovementMode, enemyService) {
    return {
      controller: 'PacmanGameCtrl',
      compile: function(elem) {
          
          var monsterGateHTML = "<img height='20' width='20' src='images/monster_gate.png' class='horizontal-block'>";
          var emptyHTML = "<img height='20' width='20' src='images/empty.png' class='horizontal-block'>";
          var dotHTML = "<img height='20' width='20' src='images/dot.png' class='horizontal-block'>";
          var wallHTML = "<img height='20' width='20' src='images/wall.png' class='horizontal-block'>";
          var spaceWithNoFoodHTML = "<img height='20' width='20' src='images/empty_space.png' class='horizontal-block'>";
          var pacmanRightHTML = "<img height='20' width='20' src='images/pacman_right.png' class='horizontal-block'>";
          var pacmanLeftHTML = "<img height='20' width='20' src='images/pacman_left.png' class='horizontal-block'>";
          var pacmanUpHTML = "<img height='20' width='20' src='images/pacman_top.png' class='horizontal-block'>";
          var pacmanDownHTML = "<img height='20' width='20' src='images/pacman_down.png' class='horizontal-block'>";
          var cherryHTML = "<img height='20' width='20' src='images/cherry.png' class='horizontal-block'>";
          var afterLosingHTML = "<img height='600' width='800' src='images/after_losing.gif' class='horizontal-block'>";
          
          var previousEvent = null;
          // We have to initialize this variable outside the event handler.
          // See this for more - https://stackoverflow.com/questions/17545389/global-and-local-variable-on-the-event-handler-function
          var currIndex = -1;     
          var cherryFirstPos = 634, cherrySecondPos = 636;
          var pacDotPoints = 10, cherryPoints = 100;
          var cherryFirstPosTarget = 200, cherrySecondPosTarget = 800;
          var cherriesExposed = 0, totalCherries = 2;
          var visited = new Array(gameboard.board.length);
          var intervalPromises = [];
          var enemies = enemyService.enemies;
          
          var currentPacmanPos, nextPacmanPos, prevPacmanPos;
          for (var i=0; i<gameboard.board.length; i++) {
              // Pacman initially faces towards right.
              if (gameboard.board.charAt(i) === 'L') {
                  prevPacmanPos = currentPacmanPos = i;
              }
          }
          var pacmanHTML = '';
          for (var i=0; i<gameboard.board.length; i++) {
              visited[i] = false;
              if (i%gameboard.breadth === 0) {
                  if (i !== 0) {
                      pacmanHTML += "</div>";
                  }
                  pacmanHTML += "<div class='wrapper'>";
              }
              switch(gameboard.board.charAt(i)) {
                  case 'W':
                      pacmanHTML += wallHTML;
                      break;
                  case '.':
                      pacmanHTML += dotHTML;
                      break;
                  case 'E':
                      pacmanHTML += emptyHTML;
                      break;
                  case 'L':
                      pacmanHTML += pacmanRightHTML;
                      break;
                  case 'O':
                      pacmanHTML += spaceWithNoFoodHTML;
                      break;
                  case 'G':
                      pacmanHTML += monsterGateHTML;
                      break;
                  case 'B':
                      pacmanHTML += enemies.blinky.getHTMLTemplate();
                      break;
                  case 'P':
                      pacmanHTML += enemies.pinky.getHTMLTemplate();
                      break;
                  case 'S':
                      pacmanHTML += enemies.inky.getHTMLTemplate();
                      break;
                  case 'D':
                      pacmanHTML += enemies.clyde.getHTMLTemplate();
                      break;
              }
          }
          pacmanHTML += "</div>";
          elem.html(pacmanHTML);
          return function(scope, elem, attr, ctrl) {
              // Providing cherry.
              scope.$watch(function() {
                  return ctrl.getScore();
              }, function(newVal, oldVal) {
                  if (newVal !== oldVal && cherriesExposed < totalCherries) {
                      if (newVal >= cherryFirstPosTarget &&
                              cherriesExposed === 0) {
                          replaceHTML(cherryFirstPos, cherryHTML);
                          cherriesExposed++;
                          replaceBoardCharacter(cherryFirstPos, 'C');
                          visited[cherryFirstPos] = false;
                      } 
                      if (newVal >= cherrySecondPosTarget &&
                              cherriesExposed === 1) {
                          replaceHTML(cherrySecondPos, cherryHTML);
                          cherriesExposed++;
                          replaceBoardCharacter(cherrySecondPos, 'C');
                          visited[cherrySecondPos] = false;
                      }
                  }
              });
              
              // User gameplay.
              $document.on('keydown', function(event) {
                  if (previousEvent === null ||
                          previousEvent.key !== event.key) {
                      previousEvent = event;
                      prevPacmanPos = currentPacmanPos;
                      switch(event.key) {
                          case 'ArrowRight':
                              nextPacmanPos = currentPacmanPos + 1;
                              break;
                          case 'ArrowLeft':
                              nextPacmanPos = currentPacmanPos - 1;
                              break;
                          case 'ArrowDown':
                              nextPacmanPos = currentPacmanPos +
                                                gameboard.breadth;
                              break;
                          case 'ArrowUp':
                              nextPacmanPos = currentPacmanPos -
                                                gameboard.breadth;
                              break;
                      }
                      walk(currentPacmanPos, nextPacmanPos);              
                  }
              });
              
              $document.on('keyup', function() {
                  previousEvent = null;
              });          
              
              // Function that make a move.
              function walk(currPos, nextPos) {
                  // If any of the enemy meets pac-man at the nextPos, then take
                  // one life.
                  // If there is a wall at the nextPos, provided that the 
                  // currentPos is not a transit cell, or if the next move is 
                  // not possible, then don't do anything.
                  if (currPos % gameboard.breadth !== 0 &&
                          (currPos + 1) % gameboard.breadth !== 0 &&
                          (nextPos < 0 ||
                                nextPos >= gameboard.board.length ||
                                gameboard.board.charAt(nextPos) === 'W' ||
                                gameboard.board.charAt(nextPos) === 'G')) {
                      return;
                  }         
                  replaceHTML(currPos, spaceWithNoFoodHTML);
                  if (nextPos === currPos + 1) {
                      if (nextPos % gameboard.breadth === 0) {
                          replaceHTML(
                                  nextPos - gameboard.breadth, pacmanRightHTML);
                          currentPacmanPos = nextPos - gameboard.breadth;
                      }
                      else {
                          replaceHTML(nextPos, pacmanRightHTML);
                          currentPacmanPos = nextPos;
                      }
                  } else if (nextPos === currPos - 1) {
                      if (currPos % gameboard.breadth === 0) {
                          replaceHTML(
                                  currPos+gameboard.breadth-1, pacmanLeftHTML);
                          currentPacmanPos = currPos + gameboard.breadth - 1;
                      } else {
                          replaceHTML(nextPos, pacmanLeftHTML);
                          currentPacmanPos = nextPos;
                      }
                  } else if (nextPos === currPos + gameboard.breadth) {
                      replaceHTML(nextPos, pacmanDownHTML);
                      currentPacmanPos = nextPos;
                  } else if (nextPos === currPos - gameboard.breadth) {
                      replaceHTML(nextPos, pacmanUpHTML);
                      currentPacmanPos = nextPos;
                  } 
                  // Insert the logic of incrementing the bonus collected here.
                  if (gameboard.board.charAt(nextPos) === '.' &&
                          visited[nextPos] === false) {
                      ctrl.eat(pacDotPoints);
                      visited[nextPos] = true;
                  } else if (gameboard.board.charAt(nextPos) === 'C' &&
                          visited[nextPos] === false) {
                      ctrl.eat(cherryPoints);
                      visited[nextPos] = true;
                  }
              }

              /**
               * The following code is required to make the enemies move.
               * Initially it was thought that moving all the enemies inside
               * a single $interval promise call would be much faster than 
               * having one for each of the enemies. However, it turned out
               * that this was indeed a bad approach and separating the 
               * movements of each of the enemies into different $interval
               * promise was a better choice. For example, the last enemy
               * reached at its fixed position in the scatter mode after 29 sec
               * in the former approach as oppesed to 20 sec in the latter
               * approach. It also gave a much better control over the movement
               * of each of the enemies.
               */
              
              // Blinky's move.
              getEnemyPromise(enemies.blinky, 1, 60, enemyMovementMode.SCATTER)
                      .then(function() {
                          getEnemyPromise(enemies.blinky, 1, 180, enemyMovementMode.CHASE)
                                .then(function() {
                                    getEnemyPromise(enemies.blinky, 1, 60, enemyMovementMode.SCATTER)
                                            .then(function() {
                                                getEnemyPromise(enemies.blinky, 1, undefined, enemyMovementMode.CHASE);
                                            })
                                            .catch(angular.noop);
                                })
                                .catch(angular.noop);
                      })
                      .catch(angular.noop);

              // Pinky's move.
              getEnemyPromise(enemies.pinky, 1, 60, enemyMovementMode.SCATTER)
                      .then(function() {
                          getEnemyPromise(enemies.pinky, 1, 180, enemyMovementMode.CHASE)
                                .then(function() {
                                    getEnemyPromise(enemies.pinky, 1, 60, enemyMovementMode.SCATTER)
                                            .then(function() {
                                                getEnemyPromise(enemies.pinky, 1, undefined, enemyMovementMode.CHASE);
                                            })
                                            .catch(angular.noop);
                                })
                                .catch(angular.noop);
                      })
                      .catch(angular.noop);

              // Inky's move.
              getEnemyPromise(enemies.inky, 1, 60, enemyMovementMode.SCATTER)
                      .then(function() {
                          getEnemyPromise(enemies.inky, 1, 180, enemyMovementMode.CHASE)
                                .then(function() {
                                    getEnemyPromise(enemies.inky, 1, 60, enemyMovementMode.SCATTER)
                                            .then(function() {
                                                getEnemyPromise(enemies.inky, 1, undefined, enemyMovementMode.CHASE);
                                            })
                                            .catch(angular.noop);
                                })
                                .catch(angular.noop);
                      })
                      .catch(angular.noop);

              // Clyde's move.
              getEnemyPromise(enemies.clyde, 1, 60, enemyMovementMode.SCATTER)
                      .then(function() {
                          getEnemyPromise(enemies.clyde, 1, 180, enemyMovementMode.CHASE)
                                .then(function() {
                                    getEnemyPromise(enemies.clyde, 1, 60, enemyMovementMode.SCATTER)
                                            .then(function() {
                                                getEnemyPromise(enemies.clyde, 1, undefined, enemyMovementMode.CHASE);
                                            })
                                            .catch(angular.noop);
                                })
                                .catch(angular.noop);
                      })
                      .catch(angular.noop);

              // A function that replaces the template present at the 'index'
              // by 'htmlString'
              function replaceHTML(index, htmlString) {
                  if (index < 0 || index >= gameboard.board.length) {
                      return;
                  }
                  var j;
                  var newHTML = '';
                  var prevHTML = elem.html();
                  for(j=0; j<prevHTML.length; j++) {               
                      if (j+4 < prevHTML.length
                              && prevHTML.charAt(j) === '<'
                              && prevHTML.charAt(j+1) === 'i'
                              && prevHTML.charAt(j+2) === 'm'
                              && prevHTML.charAt(j+3) === 'g'
                              && prevHTML.charAt(j+4) === ' ') {
                          currIndex++;
                      }
                      if (currIndex < index) {
                          newHTML += prevHTML.charAt(j);
                      } else if(currIndex === index) {
                          break;
                      }                     
                  }
                  newHTML += htmlString;
                  j++;
                  // Potential bug - If the attribute has '<' symbol.
                  while (prevHTML.charAt(j) !== '<') {
                      j++;
                  }
                  newHTML += prevHTML.substring(j);
                  elem.html(newHTML);
                  // Reset to the default value.
                  currIndex = -1;
              }
              
              function replaceBoardCharacter(index, character) {
                  if (index < 0 || index >= gameboard.board.length) {
                      return;
                  }
                  gameboard.board =
                          gameboard.board.substring(0, index) + character +
                          gameboard.board.substring(index+1);
              }

              function getEnemyPromise(enemy, speed, count, mode) {
                  var resPromise = $interval(function() {  
                      intervalPromises.push(resPromise);
                      var currentEnemyPos = enemy.getCurrentPos();
                      var nextEnemyPos = enemy.getNextPos(
                              mode, prevPacmanPos, currentPacmanPos);
                      // Handle the case when it collides with other
                      // enemies. If it works fine automatically, then
                      // leave it as it it.
                      var templateToReplaceWith = spaceWithNoFoodHTML;
                      if (gameboard.board.charAt(currentEnemyPos)=== '.'
                              && visited[currentEnemyPos] === false) {
                          templateToReplaceWith = dotHTML;
                      } else if (gameboard.board.charAt(currentEnemyPos)
                              === 'G') {
                          templateToReplaceWith = monsterGateHTML;
                      } else if (gameboard.board.charAt(currentEnemyPos)
                              === 'C' &&
                              visited[currentEnemyPos] === false) {
                          templateToReplaceWith = cherryHTML;
                      }
                      replaceHTML(currentEnemyPos, templateToReplaceWith);
                      replaceHTML(nextEnemyPos, enemy.getHTMLTemplate());
                      if (currentEnemyPos === currentPacmanPos) {
                          alert('You lost!');
                          angular.forEach(
                                  intervalPromises, function(intervalPromise) {
                                      $interval.cancel(intervalPromise); 
                                  });
                          elem.html(afterLosingHTML);
                      }                                    
                  }, speed, count);
                  return resPromise;
              }          
          };
      }
    };
};

angular
        .module('pacman')
        .directive('pacmanGame',
                   [
                       '$document',
                       '$interval',
                       'gameboard',
                       'enemyMovementMode',
                       'enemyService',
                       pacmanGameDirective
                   ]);