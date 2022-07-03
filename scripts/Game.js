/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @file   This files runs a game of life.
 * @author AuthorName.
 * @since  x.x.x
 */

const DEFAULT_RULES  = {
    live: [2,3],
    reproduce: [3]
}


class Game {

    #board
    #boardHasChanged = false;
    #rules = {}

    constructor(board, rules = DEFAULT_RULES){

        // test that the board is a 2d array of booleans 
        this.setBoard(board)
        
        this.setRules(rules);

    }

    setBoard(board){

        // check that the new board is a 2d array of booleans
        try{
            for(const row of board){
                for(const cell of row){
                    if (cell !== true && cell !== false){
                        throw("Board must be a 2 dimensional array of only booleans")
                    }
                }
            }
        }
        catch(err){
            throw(err)
        }

        

        // deep copy the new board to the board property

        this.#board = [];
    
        for(const row of board){
            let newRow = [];
            for (const cell of row){
                newRow.push(cell);    

            }
            this.#board.push(newRow);
        }
    }

    #assignRuleValues(rulesProperty, values){
        for(const ruleValue of values){
            if(typeof ruleValue !== "number" && ruleValue !== Math.floor(ruleValue)){
                throw("Rule values must be integers")
            }
            if(ruleValue>8){
                console.warn("A rule value over 8 will have no affect")
            } 
            else if(ruleValue < 0){
                console.warn("A negative rule value will have no effect")
            } 
            else {
                rulesProperty.push(ruleValue);
            }
        }
    }
    setRules(rules){
        if(rules === undefined){
            throw("Rules must be defined")
        }

        if(rules.live === undefined || rules.reproduce === undefined){
            throw ('Rules must include a "live" and a "reproduce" property')
        }

        this.#rules.live = [];
        this.#assignRuleValues(this.#rules.live, rules.live)

        this.#rules.reproduce = [];
        this.#assignRuleValues(this.#rules.reproduce, rules.reproduce)
    }


    /**
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

    /**
     *
     * Summary. Returns true if every cell on the board is extinct. False otherwise
     *
     * Description. Checks each cell, 
     *
     * @access     private
     *
     *
     * @return {[[number]]} An array the same shape as the gameboard
     */
    IsExtinct () {
        for (const row of this.#board){
            for (const cellIsAlive of row) {
                if(cellIsAlive) return false;
            }
        }
        return true;
    }
    
    hasChanged() {
        return this.#boardHasChanged;
    }

    Evolve () {
        // create an array to store counts of each cell's neighbours
        let neighbourCounts =  this.#GetNeighbourCounts();

        this.#boardHasChanged = false;

        // update the board
        this.#board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                // if a live cell doesn't have the right number of neighbours, it dies
                if(cell && !this.#rules.live.includes(neighbourCounts[rowIndex][colIndex])) {
                    this.#board[rowIndex][colIndex] = false;
                    this.#boardHasChanged = true;

                } else if(!cell && this.#rules.reproduce.includes(neighbourCounts[rowIndex][colIndex])){
                    this.#board[rowIndex][colIndex] = true;
                    this.#boardHasChanged = true;
                }
            })
        });
    }

    this

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