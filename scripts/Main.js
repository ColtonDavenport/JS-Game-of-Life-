/**
 * Summary. Handles a game of Life
 */

import Game from "./Game.js"

/**
 * Summary. Replaces the target element inner html with the game state
 *
 * Description. Selects an HTML element and replaces its inner html with the 
 *              state of the game
 *
 * @access     private
 *
 *
 * @param {Game}   game  The game of life to print
 * @param {String}   boardElementID  String for the target element's ID
 *
 */
const PrintBoard = (game, boardElementID) => {
    let tempBoard = document.getElementById(boardElementID);
    if(tempBoard === null){
        console.log("No element of ID ", boardElementID, " to print");
    }
    else{
        tempBoard.innerHTML = game.toHTML();   
    }
}

/**
 * Summary. Regularly evolves a game of life and updates an html element with the state 
 *
 * Description. Accepts a game of life to 
 *
 * @access     private
 *
 *
 * @param {Game}   game  The game of life to print
 * @param {String}   boardElementID  String for the target element's ID
 *
 */
const RunGameUntilExtinction = (game, boardElementID, timeout = 1000) => {
    
    if( timeout <= 0) {
        throw("Error - Tick Rate must be positive")
    }

    let intervalID = setInterval(()=>{

        game.Evolve();
        if(game.hasChanged()){
            PrintBoard(game, boardElementID)
        } else {
            clearInterval(intervalID);
        }
    }, timeout)

}

const Main = () => {

    let board = [
        [false, false, true, true],
        [false, false, true, false],
        [false, true, true, false],
        [false, false, true, false],
    ]

    let game = new Game(board);

    PrintBoard(game, "TempBoard")
    RunGameUntilExtinction(game, "TempBoard")
}

Main();