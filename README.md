<a href="https://github.com/gbelwariar"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://camo.githubusercontent.com/82b228a3648bf44fc1163ef44c62fcc60081495e/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f7265645f6161303030302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_red_aa0000.png"></a>
# Pacman
The [classical arcade game](https://en.wikipedia.org/wiki/Pac-Man) with some interesting tweaks and secret cheat codes!

## How to play the game 

Download the repository - [Pacman](https://github.com/gbelwariar/Pacman) and execute the HTML file - **pacman.html** (*TypeRacer/public_html/pacman.html*) through the local host using any browser, preferably Google Chrome.

## Screenshots (when played in Chrome Browser)

<kbd>![Pacman](/screenshots/screenshot.GIF?raw=true "Pacman")<kbd>

## Languages/Frameworks Used - 

1) JavaScript  
2) AngularJS (1.x)
3) HTML
4) CSS

## Phases of the Projects

**1. Requirements** - It is preferred to use Google Chrome as the game is laggy in Mozilla Firefox (See [this](https://github.com/gbelwariar/Pacman/issues/1) issue). An internet connection is not required.<br/>
**2. Design** - The gameboard is divided into small blocks which in combination gives the view of a full board. The images of the building blocks of the game can be found [here](https://github.com/gbelwariar/Pacman/tree/master/public_html/images). A listener is installed in the application to listen to the keyboard activities of the player. The enemies movements are asynchronous whereas the movement of the user, aka the pac-man, is synchronous. For even a singe movement of an enemy/user, the whole HTML is re-computed multiple times, thus leading to a substantial overhead. 
**3. Implementation** - Refer to the "**Languages/Frameworks Used**" section above to know the technologies used in this project.<br/>
**4. Testing** - To be added soon.<br/>
**5. Maintenance** - Any suggestions to improve the projects are welcome on gbelwariar@gmail.com or can be directly sent as a PR.<br/>
