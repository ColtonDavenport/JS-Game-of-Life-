/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @file   This files runs a game of life.
 * @author AuthorName.
 * @since  x.x.x
 */

import Game from "./Game.js"

const Main = () => {

    let board = [
        [false, false, true, false],
        [false, false, true],
        [false, false, true, false],
        [false, false, true, false],
    ]

    let game = new Game(board);

    game.Evolve();

    let tempBoard = document.getElementById("TempBoard");
    tempBoard.innerHTML=game.toHTML();
    
    

}

Main();