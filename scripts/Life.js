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



const RunGameUntilExtinction = (game, boardElementID ) => {
    
    let intervalID = setInterval(()=>{

        game.Evolve();
        let tempBoard = document.getElementById(boardElementID);
        tempBoard.innerHTML+="<br>" + game.toHTML();
        console.log(game.IsExtinct())
        if(game.IsExtinct()){
            clearInterval(intervalID);
        }

    }, 500)

}

const Main = () => {

    let board = [
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false],
    ]

    let game = new Game(board);

    RunGameUntilExtinction(game, "TempBoard")
    

}

Main();