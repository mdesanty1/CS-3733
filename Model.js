import { config_4x4, config_5x5, config_6x6 } from "./config";

// someone needs to know about these configurations. Perhaps we should!
const configs = [ config_5x5, config_4x4, config_6x6 ]

//gives you row and column location
export class Square {
    constructor(row, column) {
        this.row = row
        this.column = column
        this.color = 'white'
    }

    //returns ninjase location
    location() {
        return (this.row, this.column)
    }
}

class Direction {
    constructor (deltar, deltac) {
        this.deltar = deltar
        this.deltac = deltac
    }
}

//puts row and column values to the object depending on direction
export const UP = new Direction(-1, 0)
export const DOWN = new Direction(1, 0)
export const LEFT = new Direction(0, -1)
export const RIGHT = new Direction(0, 1)

export class Board {
    constructor (size) {
        this.size = size

        this.grid = Array.from(Array(size), () => new Array(size));

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                this.grid[r][c] = new Square(r,c)
            }
        }

	// how you access a square by its [row][column] location
        // this.grid[2][4]
    }

    isWon() {
        //check if there are any colors on the board
        //nested for loop that iterates through the whole board
        for(let r = 0; r < this.size - 1; r++){
            for(let c = 0; c < this.size - 1; c++){
                if(this.grid[r][c].color != 'white'){
                    return false
                }
            }

        }
        return true
    }
    //given a row and column, place ninjase in a certain spot
    placeNinja(row, col){
        this.ninjaRow = row
        this.ninjaCol = col
    }
}

export default class Model {    
    // 'which' is an integer 0..1..2 which selects configuration you can use.
    constructor(which) {
       this.initialize(which)
    }
    initialize(which) {
        this.which = which
        this.config = configs[which]
        this.size = Number(this.config.numColumns)
        this.board = new Board(this.size)
        //initialize number of moves to zero at the start
        this.numMoves = 0
        //initialize score to zero at start
        this.score = 0
        //determines the number of blocks (2x1) of colors to push
        this.numColors = 0
        //determines number of blocks (1x1) of colors to push
        this.numColorsCount = 0

        for (let info of this.config.initial) {
            let r = Number(info.row) - 1
            let c = info.column.charCodeAt(0) - 65
            console.log(info)
            this.board.grid[r][c].color = info.color
        }

        let nr = Number(this.config.ninjaRow) - 1
        //need to determine how to get ninjase column
        let nc = this.config.ninjaColumn.charCodeAt(0) - 65
        this.board.placeNinja(nr, nc)
    }
    moveNinjase(direction) {
        //MUST FIRST CHECK IF IT IS A VALID MOVE FOR NINJASE
            //helper function
        var canMove = this.isValid(direction)

        //only set move if ninjase can make that move
        if(canMove){
            //push determines if ninjase and the colors can move
            this.push(direction)
        }
        //if not a valid move, just keep ninjase where it is and keep ninjaCol and ninjaRow set to what they already are
    }

    //method to push the blocks
    //takes in the direction ONLY IF VALID MOVE FROM NINJASE
    //updates the display of the board and the location of the block
    push(direction) {
        
        //UP & DOWN
        //If delta r is not zero, ninjase is moving up or down
        if(direction.deltar != 0) {
            //start at the row above ninjase's row
                for(let currRow = this.board.ninjaRow + direction.deltar; currRow <= this.board.size-1 && currRow >= 0; currRow--){
                    //moving up
                    //must check right above ninja and to the right
                    if(direction.deltar < 0 && this.board.grid[currRow][this.board.ninjaCol].color != 'white'){
                        this.numColors += 1
                        this.numColorsCount += 1
                        if(this.board.grid[currRow][this.board.ninjaCol + 1].color != 'white'){
                            this.numColorsCount += 1 
                        }
                    }
                    //moving down (take into account row + 2)
                    //must check right above ninja and to the right
                    if(direction.deltar > 0 && this.board.grid[currRow + 1][this.board.ninjaCol].color != 'white'){
                        if(this.board.grid[currRow + 1][this.board.ninjaCol + 1].color != 'white'){
                            this.numColorsCount += 1
                        }
                    }
                }
                //determine if this is a valid move for the colored blocks to move
                let isValidPush = this.pushOff(this.numColors, direction)
                if(isValidPush){
                    //set current col to the one to the left or right of where ninjase is
                    let currRow = this.board.ninjaRow + direction.deltar
    
                    //run loop to reset colors until the number of non-white blocks that were surrounding ninjase runs out
                    while(this.numColorsCount > 0 && (currRow < this.board.size - 1 && currRow >= 0)){
                        //reset colors
                        //moving up
                        if(direction.deltar < 0){
                            if(this.board.grid[currRow + direction.deltar][this.board.ninjaCol].color != this.board.grid[currRow][this.board.ninjaRow].color){
                                this.board.grid[currRow + direction.deltar][this.board.ninjaCol].color = this.board.grid[currRow][this.board.ninjaRow].color
                                if(this.numColors== 1){
                                    this.updateScore(1)
                                }
                            }
                            if(this.board.grid[currRow + direction.deltar ][this.board.ninjaCol + 1].color != this.board.grid[currRow][this.board.ninjaCol + 1].color){
                                this.board.grid[currRow + direction.deltar ][this.board.ninjaCol + 1].color = this.board.grid[currRow][this.board.ninjaCol + 1].color
                                if(this.numColors == 1){
                                    this.updateScore(1)
                                }
                            }
                        }
                        //moving right
                        if(direction.deltac > 0){
                            if(this.board.grid[currRow + direction.deltar][this.board.ninjaCol].color != this.board.grid[currRow + 1][this.board.ninjaCol].color){
                                this.board.grid[currRow + direction.deltar][this.board.ninjaCol].color = this.board.grid[currRow + 1][this.board.ninjaCol].color
                                if(this.numColors == 1){
                                    this.updateScore(1)
                                }
                            }
                            if(this.board.grid[currRow + direction.deltar][this.board.ninjaCol + 1].color != this.board.grid[currRow + 1][this.board.ninjaCol+1].color){
                                this.board.grid[currRow + direction.deltar][this.board.ninjaCol + 1].color = this.board.grid[currRow + 1][this.board.ninjaCol+1].color
                                if(this.numColors == 1){
                                    this.updateScore(1)
                                }
                            }
                        }
                        //subtract from counter
                        this.numColorsCount = this.numColorsCount - 1
                        currRow = currRow + 1
                    }
                    //reset ninjase location
                    this.board.ninjaCol = this.board.ninjaCol + direction.deltac
                    this.board.ninjaRow = this.board.ninjaRow + direction.deltar
                    this.updateMoveCount(1)
                }
            //reset color counts
            this.numColors = 0
            this.numColorsCount = 0
        }

        //LEFT & RIGHT
        if(direction.deltac != 0) {
            //look left or right to determine the number of colored tiles next to each other
            //start at ninjase col +/- 1 and move to col 0 or last col
            for (let currCol = this.board.ninjaCol + direction.deltac; currCol <= this.board.size -1 && currCol >= 0; currCol--){
                //determine if it is colored
                //if it is not white, add to counter
                //Moving left
                console.log(this.board.grid[this.board.ninjaRow][currCol + direction.deltac])
                if(direction.deltac < 1 && this.board.grid[this.board.ninjaRow][currCol].color != 'white'){
                    this.numColors += 1
                    this.numColorsCount += 1
                }
                //Moving right (have to take into account col + 2)
                if(direction.deltac > 0 && this.board.grid[this.board.ninjaRow][currCol + 1].color != 'white'){
                    this.numColors += 1
                    this.numColorsCount += 1
                }
            }
            //determine if it is valid to push the colored blocks
            let isValidPush = this.pushOff(this.numColors, direction)
            if(isValidPush){
                //set current col to the one to the left or right of where ninjase is
                let currCol = this.board.ninjaCol + direction.deltac 
                //loop through until the number of non white blocks runs out
                while(this.numColors > 0 && (currCol < this.board.size - 1 && currCol >= 0)){
                    //reset colors
                    //moving left
                    if(direction.deltac < 0){
                        if(this.board.grid[this.board.ninjaRow][currCol + direction.deltac].color != this.board.grid[this.board.ninjaRow][currCol].color){
                            this.board.grid[this.board.ninjaRow][currCol + direction.deltac].color = this.board.grid[this.board.ninjaRow][currCol].color
                            if(this.numColors == 1){
                                this.updateScore(1)
                            }
                        }
                        if(this.board.grid[this.board.ninjaRow +1 ][currCol + direction.deltac].color != this.board.grid[this.board.ninjaRow+1][currCol].color){
                            this.board.grid[this.board.ninjaRow +1 ][currCol + direction.deltac].color = this.board.grid[this.board.ninjaRow+1][currCol].color
                            if(this.numColors == 1){
                                this.updateScore(1)
                            }
                        }
                    }
                    //moving right
                    if(direction.deltac > 0){
                        if(this.board.grid[this.board.ninjaRow][currCol + direction.deltac].color != this.board.grid[this.board.ninjaRow][currCol+1].color){
                            this.board.grid[this.board.ninjaRow][currCol + direction.deltac].color = this.board.grid[this.board.ninjaRow][currCol+1].color
                            if(this.numColors == 1){
                                this.updateScore(1)
                            }
                        }
                        if(this.board.grid[this.board.ninjaRow+1][currCol + direction.deltac].color != this.board.grid[this.board.ninjaRow+1][currCol+1].color){
                            this.board.grid[this.board.ninjaRow+1][currCol + direction.deltac].color = this.board.grid[this.board.ninjaRow+1][currCol+1].color
                            if(this.numColors == 1){
                                this.updateScore(1)
                            }
                        }
                    }
                    //subtract from counter
                    this.numColors = this.numColors - 1
                    currCol = currCol + 1
                }
                this.board.ninjaCol = this.board.ninjaCol + direction.deltac
                this.board.ninjaRow = this.board.ninjaRow + direction.deltar
                //update move count by 2 (blocks come in pairs of 2) because we have determined it is a valid move
                this.updateMoveCount(1)
            }
            //if it is not a valid push, don't do anything
            this.numColors = 0
            this.numColorsCount = 0
        }

    }

    //Determines if there is a block of 4 to remove and removes it from the board
    //also increases game score by 4
    removeBlock(){
        //check if there is a block of 4
        //nested for loop
        //from current(moving left to right), check (row, col) (row, col+1) (row+1, col) (row+1, col+1)
        //only go from r and c 0 to 3 (as to not go off the board)
        for(let r = 0; r <= this.board.size - 2; r ++){
            for(let c = 0; c <= this.board.size - 2; c++){
                //block you are at is not white, check surrounding blocks of 4
                if(this.board.grid[r][c].color != 'white'){
                    if(this.board.grid[r][c+1].color != 'white'){
                        if(this.board.grid[r+1][c].color != 'white'){
                            if(this.board.grid[r+1][c+1].color != 'white'){
                                //set the colors to white
                                this.board.grid[r][c].color = 'white'
                                this.board.grid[r][c+1].color = 'white'
                                this.board.grid[r+1][c].color = 'white'
                                this.board.grid[r+1][c+1].color = 'white'
                                this.updateScore(4)
                                this.updateMoveCount(1)
                            }
                        }
                    }
                }
            }
        }
        return this.board.isWon()

    }

    pushOff (numColors, direction) {
        //Moving upwards (deltar is -1)
        if (direction.deltar < 0){
            if(this.board.ninjaRow - this.numColors < 1 || this.board.ninjaRow + this.numColors < 1){
                return false
            }
        }
        //moving downwards
        else if(direction.deltar > 0){
            if(this.board.ninjaRow + this.numColors > this.board.size-1 || this.board.ninjaRow + this.numColors + 1 > this.board.size-1){
                return false
            }
        }
        //moving left
        else if (direction.deltac < 0){
            if(this.board.ninjaCol - this.numColors < 1 || this.board.ninjaCol + this.numColors < 1){
                return false
            }
        }
        //moving right
        else if (direction.deltac > 0){
            if(this.board.ninjaCol + this.numColors > this.board.size-1 || this.board.ninjaCol + this.numColors + 1 > this.board.size - 1){
                return false
            }
        }
            return true
    }

    //determines if the move will push ninjase off the board
    isValid(direction) {
        //UP or down -> if out of bounds return false
        console.log(this.board.ninjaCol, this.board.ninjaRow, direction.deltac, direction.deltar)
        console.log(this.board.ninjaCol + direction.deltac, this.board.ninjaRow + direction.deltar)

        //moving up or down
        if(this.board.ninjaRow + direction.deltar < 0 || (this.board.ninjaRow + direction.deltar >= this.board.size-1)){
            return false
        }
        //moving left or right
        else if(this.board.ninjaCol + direction.deltac < 0 || (this.board.ninjaCol + direction.deltac >= this.board.size - 1)){
            return false
        }
        else{
            return true
        }
    }

    //function to update move count
    //takes in the number of moves to increment by
    updateMoveCount(delta){
        this.numMoves += delta
    }
    //returns the current number of moves
    numberOfMoves(){
        return this.numMoves
    }
    //updates game score
    updateScore(delta) {
        this.score += delta
    }
    //returns game score
    currScore() {
        return this.score
    }
}
