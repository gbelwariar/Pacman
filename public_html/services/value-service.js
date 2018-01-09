/* global gameboard */

var gameboard = {
    /**
     * The meaning of the symbols are -
     * 
     *    W = The wall.
     *    . = The pac-dot.
     *    G = The gate enclosing the monsters.
     *    E = The empty space(not reachable).
     *    X = The enemy.
     *    O = The cell having no food.
     *    L = Pacman facing right.
     *    J = Pacman facing left.
     *    I = Pacman facing top.
     *    K = Pacman facing down.
     *    B = Blinky - The red enemy.
     *    P = Pinky - The pink enemy.
     *    S = Inky - The blue enemy.
     *    D = Clyde - The orange enemy.
     *    C = The cherry - It comes only after the pacman exceeds a 
     *        threshold of points.
     *        
     *    All coordinates as well as the index of a tile mentined in the program
     *    are measured by taking the top left corner as the origin.
     *    
     *             x
     *    (0,0) ---------->
     *      |
     *      |
     *    y |
     *      |
     *      \/ 
     */              
    board:  'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW' +
            'W...................W...................W' +
            'W.WWWWWWW.WWWWWWWWW.W.WWWWWWWWW.WWWWWWW.W' +
            'W.WWWWWWW.WWWWWWWWW.W.WWWWWWWWW.WWWWWWW.W' +
            'W.WWWWWWW.WWWWWWWWW.W.WWWWWWWWW.WWWWWWW.W' +
            'W.......................................W' +
            'W.WWWWWWW.W.WWWWWWWWWWWWWWWWW.W.WWWWWWW.W' +
            'W.........W.........W.........W.........W' +
            'WWWWWWWWW.WWWWWOOOOOWOOOOOWWWWW.WWWWWWWWW' +
            'EEEEEEEEW.WOOOOOOOOOBOOOOOOOOOW.WEEEEEEEE' +
            'EEEEEEEEW.WOOOOOOWGGGGGWOOOOOOW.WEEEEEEEE' +
            'WWWWWWWWW.OOOOOOOWOOOOOWOOOOOOO.WWWWWWWWW' +
            'OOOOOOOOO.OOOOOOOWOSPDOWOOOOOOO.OOOOOOOOO' +
            'WWWWWWWWW.WOOOOOOWOOOOOWOOOOOOW.WWWWWWWWW' +
            'EEEEEEEEW.WOOOOOOWGGGGGWOOOOOOW.WEEEEEEEE' +
            'EEEEEEEEW.WOOOOOOOOOOOOOOOOOOOW.WEEEEEEEE' +
            'WWWWWWWWW.WOOOOOOOWWWWWOOOOOOOW.WWWWWWWWW' +
            'W...................W...................W' +
            'W.WWWWWWW.WWWWWWWWW.W.WWWWWWWWW.WWWWWWW.W' +
            'W.......W...........L...........W.......W' +
            'WWWWWWW.W.W.WWWWWWWWWWWWWWWWW.W.W.WWWWWWW' +
            'W.........W.....OOOOWOOOO.....W.........W' +
            'W.WWWWWWWWWWWWW.OOOOWOOOO.WWWWWWWWWWWWW.W' +
            'W.......................................W' +
            'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    breadth: 41
};


angular
        .module('pacman')
        .value('gameboard', gameboard);