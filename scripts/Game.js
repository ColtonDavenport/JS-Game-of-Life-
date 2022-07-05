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
class Position {
    constructor(row, column){
        this.row = row;
        this.column = column;
    }
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

    #board;
    #neighbourCounts;
    #rules = {};
    #hasChanged = false;
    
    constructor(board, rules = DEFAULT_RULES){

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

        // a new board counts as a new start, so should appear as if no changes have been made
        this.#hasChanged = false;

        // deep copy the new board to the board property
        // at the same time, create the neighbour counts board, but don't fill it
        this.#board = [];
        for(const row of board){
            let newBoardRow = [];
            for (const cell of row){
                newBoardRow.push(cell);    

            }
            this.#board.push(newBoardRow);
        }

        // set the ititial state of the Neighbour Counts
        this.#setAllNeighbourCounts();
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
    }


    
    /**
     * Summary. Updates the neighbour count of a cell at the given position
     *
     * Description. Checks first that the position exists, then applies the adjustment
     *
     * @access     private
     *
     * @param {number}   rowIdx  The index of the cell's row in the board.
     * @param {number}   colIdx  The index of the cell's column in the board.
     * @param {number}   change  the value that this cell should be adjusted by.
     * 
     */
    #updateExistingCell(rowIdx, colIdx, change) {
        if(this.#neighbourCounts[rowIdx][colIdx] !== undefined){
            this.#neighbourCounts[rowIdx][colIdx] += change;
        }
    }

    /**
     * Summary. Updates the counts of each cell neigbouring the given position
     *
     * Description. Adds "change" to every cell adjacent to (rowIdx, colIdx).
     *
     * @access     private
     *
     * @param {number}   rowIdx  The index of the cell's row in the board.
     * @param {number}   colIdx  The index of the cell's column in the board.
     * @param {number}   adjustment  the value that each neigbouring cell should be adjusted by.
     * 
     */
    #adjustCountsOfNeigbhours(rowIdx, colIdx, adjustment){

        // Only check upwards if this isn't the top row
        if(rowIdx > 0){
            /*Up*/          this.#updateExistingCell(rowIdx-1, colIdx,   adjustment);
            /*Up & Left*/   this.#updateExistingCell(rowIdx-1, colIdx-1, adjustment);
            /*Up & Right*/  this.#updateExistingCell(rowIdx-1, colIdx+1, adjustment);
        }
        
        // Only check downwards if this isn't the bottom row
        if(rowIdx + 1 < this.#board.length) {
            /*Down*/         this.#updateExistingCell(rowIdx+1, colIdx,   adjustment);
            /*Down & Left*/  this.#updateExistingCell(rowIdx+1,colIdx-1, adjustment);
            /*Down & Right*/ this.#updateExistingCell(rowIdx+1,colIdx+1, adjustment);

        }
        
        /*left*/  if(colIdx > 0) this.#updateExistingCell(rowIdx,   colIdx-1, adjustment);
        /*right*/ this.#updateExistingCell(rowIdx,colIdx+1, adjustment);
        
    }

    /**
     *
     * Summary. Refreshes the neighbour count array
     *
     * Description. Sets every count to zero, then increments the counts of
     *              neighbours based on the living cells
     *
     * @access     private
     *
     */
    #setAllNeighbourCounts() {
        // rebuild the count array based on the current board
        this.#neighbourCounts = [];

        for(const row of this.#board){
            this.#neighbourCounts.push(new Array(row.length).fill(0));
        }
        // run through each cell of the board. if it is living, add 1 to its neighbours
        for(let r = 0; r < this.#board.length; r++){
            for(let c = 0; c < this.#board[r].length; c++){
                if(this.#board[r][c]){
                this.#adjustCountsOfNeigbhours(r, c, 1);
                }
            }
        }
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
     *          False otherwise.
     *
     * Description. Returns false if the board was just set, rather than evolved
     *
     * @access     private
     *
     * @return {Boolean} A boolean representing whether the board has changed
     */
    hasChanged () {
        return this.#hasChanged;
    }
    
    /**
     *  Summary. Updates the board based on the neighbour counts and rules. Returns an array
     *              of the positions that have been changed
     * 
     *  Description. Checks every cell against the set rules. If any cells are changed,
     *                  will set hasChanged to true
     * 
     * @return {[Position]} An array of positions where the board has changed
     * 
     */

    #UpdateBoard () {

        // create an array to store the position of changes
        let changeIndexes = [];

        // update the board
        this.#board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if(cell && !this.#rules.live.includes(this.#neighbourCounts[rowIndex][colIndex])) {
                    // the current cell is alive, but doesn't have enough neigbours to survive
                    
                    // kill the cell and log the change
                    this.#board[rowIndex][colIndex] = false;
                    changeIndexes.push(new Position(rowIndex, colIndex));

                } else if(!cell && this.#rules.reproduce.includes(this.#neighbourCounts[rowIndex][colIndex])){
                    // the current cell is dead, but can reproduce

                    // set the cell to living and log the change
                    this.#board[rowIndex][colIndex] = true; 
                    changeIndexes.push(new Position(rowIndex, colIndex));
                }
            })
        });

        // update whether any changes have been made
        this.#hasChanged = changeIndexes.length > 0;

        return changeIndexes;
    }

     /**
     *  Summary. Updates the neighbour counts based on an array of positions.
     * 
     *  Description. Checks each position that has changed. If at that position is a
     *                  living cell, each neighbour will increment its count. Else, 
     *                  each neighbour will decrement its count.
     * 
     */
    #UpdateNeighbourCounts (changeIndexes) {
        // update the neighbour counts based on whether a cell was born or died
        for(const changePosition of changeIndexes){
            if(this.#board[changePosition.row][changePosition.column]){
                this.#adjustCountsOfNeigbhours(changePosition.row, changePosition.column, 1)
            }else {
                this.#adjustCountsOfNeigbhours(changePosition.row, changePosition.column, -1)
            }
        }
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
        let changeIndexes = this.#UpdateBoard();
        this.#UpdateNeighbourCounts(changeIndexes)
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