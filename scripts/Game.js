/**
 * Summary. A class that implements the Game of Life. Conway's game of life by default
 *
 * Description. (use period)
 *
 * @file   This files runs a game of life.
 */

const DEFAULT_RULES  = {
    live: [2,3],
    reproduce: [3]
}


/**
 * Summary. Implements the Game of Life
 *
 * Description. Accepts a board, then can handle the logic for evolving that
 *              board according to the Game of Life rules. 
 * 
 *              By default, those rules are:
 *                  1) Any dead cell adjacent to exactly 3 live cells becomes alive
 *                  2) Any live cell adjacent to 2 or 3 live cells survives
 *                  3) Every other live cell dies
 * 
 *              The values of those rules can be adjusted.
 *
 * @access     public
 *
 *
 * @param {[[boolean]]}   board  The new board for the game of life
 *
 */

class Game {

    #board
    #rules = {}
    #hasChanged = false
    
    constructor(board, rules = DEFAULT_RULES){

        // test that the board is a 2d array of booleans 
        this.setBoard(board);
        
        this.setRules(rules);

    }


    /**
     * Summary. Assign a board array
     *
     * Description. Sets a deep copy of the parameter as the board. Throws an exception
     *              if the board isn't a 2d array of booleans
     *
     * @access     public
     *
     *
     * @param {[[boolean]]}   board  The new board for the game of life
     *
     */
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

    /**
     * Summary. Returns the values from an array that are valid for a game of
     *          life rules sets
     *
     * Description. Accepts an object with the "live" and "reproduce" properties
     *                  to set the game of life's rules. Will throw exceptions if 
     *                  the live or reproduce properties aren't set
     *
     * @access     private
     *
     *
     * @param {object}   rules  The new rules for the game of life
     *
     */
    #getValidRulesValues(values){

        let validValues = [];
        for(const ruleValue of values){
            if(typeof ruleValue !== "number" && ruleValue !== Math.floor(ruleValue)){
                console.warn("Rule values must be integers, ", ruleValue, " ignored")
            }
            else if(ruleValue < 0 || ruleValue > 8){
                console.warn("A rule value of ", ruleValue, " ignored");
            } 
            else {
                validValues.push(ruleValue);
            }
        }
        return validValues;
    }

    /**
     * Summary. set the rules for the game of life
     *
     * Description. Accepts an object with the "live" and "reproduce" properties
     *                  to set the game of life's rules. Will throw exceptions if 
     *                  the live or reproduce properties aren't set
     *
     * @access     public
     *
     *
     * @param {object}   rules  The new rules for the game of life
     *
     */
    setRules(rules){
        if(rules === undefined){
            throw("Rules must be defined")
        }

        if(rules.live === undefined || rules.reproduce === undefined){
            throw ('Rules must include a "live" and a "reproduce" property')
        }

        this.#rules.live = this.#getValidRulesValues(rules.live)
        this.#rules.reproduce = this.#getValidRulesValues(rules.reproduce)

        console.log(this.#rules)

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
     * Description. Checks each cell, returning false as soon as a live cell is found.
     *
     * @access     private
     *
     *
     * @return {Boolean} True if every cell is dead, false otherwise
     */
    IsExtinct () {
        for (const row of this.#board){
            for (const cellIsAlive of row) {
                if(cellIsAlive) return false;
            }
        }
        return true;
    }

    /**
     *
     * Summary. Returns true if the table changed in the most recent evolution. 
     *          False otherwise, including when checked before any evolutions have been made.
     *
     *
     * @access     private
     *
     * @return {Boolean} A boolean representing whether the board has changed
     */
    hasChanged () {
        return this.#hasChanged;
    }
    
    /**
     *
     * Summary. Advance the state of the game of life by 1 turn
     *
     * Description. Using the rules set for this game, the cells are updated. 
     *              Cells will either die, reproduce, or stay the same.
     *
     * @access     public
     *
     */
    Evolve () {

        // start tracking wether this evolution has changed the board

        this.#hasChanged = false;

        // create an array to store counts of each cell's neighbours
        let neighbourCounts =  this.#GetNeighbourCounts();

        // update the board
        this.#board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                // if a live cell doesn't have the right number of neighbours, it dies
                if(cell && !this.#rules.live.includes(neighbourCounts[rowIndex][colIndex])) {
                    this.#board[rowIndex][colIndex] = false;
                    this.#hasChanged = true;

                } else if(!cell && this.#rules.reproduce.includes(neighbourCounts[rowIndex][colIndex])){
                    this.#board[rowIndex][colIndex] = true; 
                    this.#hasChanged = true;
                }
            })
        });
    }

    /**
     *
     * Summary. Returns the state of this game as html
     *
     * Description. Live cells are represented with "+", 
     *              dead with "-", and rows are separated 
     *              with "<br />""
     *
     * @access     public
     *
     * @return {String} A string representing the state of the board
     *                      with some html tags
     */
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