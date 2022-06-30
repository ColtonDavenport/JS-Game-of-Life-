/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @file   This files runs a game of life.
 * @author AuthorName.
 * @since  x.x.x
 */

class Game {

    #board

    #rules = {
        live: [2,3],
        reproduce: [3]
    }

    constructor(board){
        this.#board = board;
        
    }

    /**
     * Count Cell Neighbours
     * 
     * Summary. Returns a count of how many live cells are adjacent to the given coordinates
     *
     * Description. Checks orthagonally and diagonally adjacent cells in the board. 
     *              Returns a count of how many cells are living.
     *
     * @access     private
     *
     *
     * @param {number}   row  The index of the cell's row in the board.
     * @param {number}   col  The index of the cell's column in the board.
     *
     * @return {number} a count of the living cells adjacent to the cell at (row, col) on the board.
     */
    #CountCellNeighbours(row, col) {

        let count = 0;

        // Check the orthagonal neighbours

        /*Up*/    if(row > 0 && this.#board[row-1][col]) count++;
        /*Down*/  if(row + 1 < this.#board.length && this.#board[row+1][col]) count++;
        /*left*/  if(col > 0 && this.#board[row][col - 1]) count++;
        /*right*/ if(this.#board[row][col + 1]) count++;


        // Check the Diagonal Neighbours

        /*Up & Left*/    if(row > 0 && this.#board[row-1][col-1]) count++;
        /*Up & Right*/   if(row > 0 && this.#board[row-1][col+1]) count++;
        /*Down & Left*/  if(row + 1 < this.#board.length && this.#board[row+1][col-1]) count++;
        /*Down & Right*/ if(row + 1 < this.#board.length && this.#board[row+1][col+1]) count++;

        return count;
    }

    /**
     *
     * Summary. Returns a count of every cell's live neighbours
     *
     * Description. 
     *
     * @access     private
     *
     *
     * @return {[[number]]} An array the same shape as the gameboard
     */
    #GetNeighbourCounts() {

        // create a two dimensional array of how many neighbours each cell has
        let neighbourCounts = this.#board.map((row, rowIndex) => {
            return row.map((cell, colIndex) => {
                return this.#CountCellNeighbours(rowIndex, colIndex)
            })
        })

        return neighbourCounts;
    }
    

    Evolve () {
        // create an array to store counts of each cell's neighbours
        let neighbourCounts =  this.#GetNeighbourCounts();
    }

    toHTML(){
        let string = "";
        this.#board.forEach((row, index) => {
            row.forEach( cell => {
                string += cell ? "+ " : "- ";
            });
            //string += "\n";
            string += "<br />"
        });
        return string;
    }

}

export default Game;