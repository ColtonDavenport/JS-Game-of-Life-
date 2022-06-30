/**
 * 
 * Game of Life
 * 
 * 
 * Summary - A demonstration of the Game of Life
 * 
 *  
 * 
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

    #CountOrthagonalNeighbours(row, col){
        let count = 0;

        /*Up*/    if(row > 0 && this.#board[row-1][col]) count++;
        /*Down*/  if(row + 1 < this.#board.length && this.#board[row+1][col]) count++;
        /*left*/  if(col > 0 && this.#board[row][col - 1]) count++;
        /*right*/ if(this.#board[row][col + 1]) count++;
        
        return count;
    }


    #CountDiagonalNeighbours(row, col){
        let count = 0;

        /*Up & Left*/    if(row > 0 && this.#board[row-1][col-1]) count++;
        /*Up & Right*/   if(row > 0 && this.#board[row-1][col+1]) count++;
        /*Down & Left*/  if(row + 1 < this.#board.length && this.#board[row+1][col-1]) count++;
        /*Down & Right*/ if(row + 1 < this.#board.length&& this.#board[row+1][col+1]) count++;
        
        return count;
    }

    CountNeighbours(row, col) {
        
        return this.#CountDiagonalNeighbours(row, col) + this.#CountOrthagonalNeighbours(row,col);
    }

    GetNeighbourCounts() {
        let neighbourCounts = [];

        this.#board.map((row, rowIndex) => {
            let newRow = [];
            row.map((cell, colIndex) => {
                newRow.push(this.CountNeighbours(rowIndex, colIndex))
            })
            neighbourCounts.push(newRow)
        })

        console.log(neighbourCounts);
        return neighbourCounts;
    }

    Evolve () {
        // create an array to store counts of each cell's neighbours
        let neighbourCounts =  this.GetNeighbourCounts();
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