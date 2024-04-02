class Board {
    squares;

    constructor(){
        let squares = [];
        let main_row = [Rook,Knight,Bishop,Queen,King,Bishop,Knight,Rook];
        // let main_row = [undefined,undefined,undefined,King];
        for (let x = 0; x < dimension; x++){
            let row = [];
            let color = x === 0 || x === 1 ? "light" : "dark";
            for (let y = 0; y < dimension; y++) {
                let piece_type, piece_color = undefined;
                if (x === 0 || x === dimension - 1){
                    piece_type = main_row[y];
                    piece_color = color;
                } else if (x === 1 || x === dimension - 2){
                    piece_type = Pawn;
                    piece_color = color;
                }
                let square = new Square(x , y, undefined, piece_type, piece_color);
                row.push(square);
            }
            squares.push(row);
        }
        this.squares = squares;
    }
}

class Square {
    isDark;
    piece;
    piece_type;
    piece_color;
    constructor(posX, posY, piece, piece_type, piece_color){
        this.isDark = posX % 2 == posY % 2;
        if (!piece && piece_type !== undefined){
            this.piece = new piece_type(posX, posY, piece_color);
        }else if (piece){
            this.piece = piece;
        }
    }
}

class Piece {
    posX;
    posY;
    color;
    movedSteps = 0;
    positions;
    constructor(posX, posY, color){
        this.color = color;
        this.posX = posX;
        this.posY = posY;
    }

    setPosition(posX, posY){
        this.posX = posX;
        this.posY = posY;
        this.movedSteps++;
    }

    appendToPositions(x, y){
        let square = board.squares[x][y];
        if (square?.piece?.color===this.color){
            return false;
        }
        this.positions.push(x+"_"+y);
        if (square.piece) {
            return false;
        }
        return true;
    }
}

class Rook extends Piece{
    getClassName(){
        return this.color+"_rook";
    }

    get_possible_moves(){
        this.positions = [];
        let x = this.posX;
        let y = this.posY;
        let occupied = [false,false,false,false];
        for (let i = 1; i < dimension; i++) {
            if (!occupied[0] && x - i >= 0){
                occupied[0] = !this.appendToPositions(x - i, y);
            }
            if (!occupied[1] && x + i < dimension){
                occupied[1] = !this.appendToPositions(x + i, y);
            }
            if (!occupied[2] && y - i >= 0){
                occupied[2] = !this.appendToPositions(x, y - i);
            }
            if (!occupied[3] && y + i < dimension){
                occupied[3] = !this.appendToPositions(x, y + i);
            }
        }
        return this.positions;
    }
}

class Knight extends Piece{
    getClassName(){
        return this.color+"_knight";
    }

    get_possible_moves(){
        this.positions = [];
        for (let x = this.posX - 2; x <= this.posX + 2; x++){
            if (x >= 0 && x < dimension && x !== this.posX){
                for (let y = this.posY - 2; y <= this.posY + 2; y++){
                    if (y >= 0 && y < dimension && y !== this.posY){
                        if (Math.abs(this.posX - x) !== Math.abs(this.posY - y)){
                            this.appendToPositions(x, y);
                        }
                    }
                }
            }
        }
        return this.positions;
    }
}

class Bishop extends Piece{
    getClassName(){
        return this.color+"_bishop";
    }

    get_possible_moves(){
        this.positions = [];
        let x = this.posX;
        let y = this.posY;
        let occupied = [false,false,false,false];
        for (let i = 1; i <= dimension; i++) {
            if (!occupied[0] && y + i < dimension && x + i < dimension){
                occupied[0] = !this.appendToPositions(x + i, y + i);
            }
            if (!occupied[1] && y - i >= 0 && x - i >= 0){
                occupied[1] = !this.appendToPositions(x - i, y - i);
            }
            if (!occupied[2] && x + i < dimension && y - i >= 0){
                occupied[2] = !this.appendToPositions(x + i, y - i);
            }
            if (!occupied[3] && y + i < dimension && x - i >= 0){
                occupied[3] = !this.appendToPositions(x - i, y + i);
            }
        }
        return this.positions;
    }
}

class Queen extends Piece{
    getClassName(){
        return this.color+"_queen";
    }

    get_possible_moves(){
        this.positions = [];
        let x = this.posX;
        let y = this.posY;
        let occupied = [false,false,false,false,false,false,false,false];
        for (let i = 1; i < dimension; i++) {
            if (!occupied[0] && x - i >= 0){
                occupied[0] = !this.appendToPositions(x - i, y);
            }
            if (!occupied[1] && x + i < dimension){
                occupied[1] = !this.appendToPositions(x + i, y);
            }
            if (!occupied[2] && y - i >= 0){
                occupied[2] = !this.appendToPositions(x, y - i);
            }
            if (!occupied[3] && y + i < dimension){
                occupied[3] = !this.appendToPositions(x, y + i);
            }
            if (!occupied[4] && y + i < dimension && x + i < dimension){
                occupied[4] = !this.appendToPositions(x + i, y + i);
            }
            if (!occupied[5] && y - i >= 0 && x - i >= 0){
                occupied[5] = !this.appendToPositions(x - i, y - i);
            }
            if (!occupied[6] && x + i < dimension && y - i >= 0){
                occupied[6] = !this.appendToPositions(x + i, y - i);
            }
            if (!occupied[7] && y + i < dimension && x - i >= 0){
                occupied[7] = !this.appendToPositions(x - i, y + i);
            }
        }
        return this.positions;
    }
}

class King extends Piece{
    getClassName(){
        return this.color+"_king";
    }

    get_possible_moves(){
        this.positions = [];
        let x = this.posX;
        let y = this.posY;
        if (x - 1 >= 0){
            this.appendToPositions(x - 1, y);
        }
        if (x + 1 < dimension){
            this.appendToPositions(x + 1, y);
        }
        if (y - 1 >= 0){
            this.appendToPositions(x, y - 1);
        }
        if (y + 1 < dimension){
            this.appendToPositions(x, y + 1);
        }
        if (y + 1 < dimension && x + 1 < dimension){
            this.appendToPositions(x + 1, y + 1);
        }
        if (y - 1 >= 0 && x - 1 >= 0){
            this.appendToPositions(x - 1, y - 1);
        }
        if (x + 1 < dimension && y - 1 >= 0){
            this.appendToPositions(x + 1, y - 1);
        }
        if (y + 1 < dimension && x - 1 >= 0){
            this.appendToPositions(x - 1, y + 1);
        }
            
        return this.positions;
    }
}

class Pawn extends Piece{
    getClassName(){
        return this.color+"_pawn";
    }

    get_possible_moves() {
        this.positions = [];
        let x = this.posX;
        let y = this.posY;
        let count = this.movedSteps === 0 ? 2 : 1;
        for (let i = 1; i <= count; i++){
            if (this.color === "dark" && x - i >= 0){
                this.appendStraightPosition(x - i, y);
            }else if (this.color === "light" && x + 1 < dimension){
                this.appendStraightPosition(x + i, y);
            }
        }

        if (this.color === "dark" && x - 1 >= 0){
            if (y - 1 >= 0){
                this.appendCrossPosition(x - 1, y - 1);
            }
            if (y + 1 < dimension){
                this.appendCrossPosition(x - 1, y + 1);
            }
        }else if (this.color === "light" && x + 1 < dimension){
            if (y - 1 >= 0){
                this.appendCrossPosition(x + 1, y - 1);
            }
            if (y + 1 < dimension){
                this.appendCrossPosition(x + 1, y + 1);
            }
        }
        return this.positions;
    }

    appendCrossPosition(x, y) {
        let square = board.squares[x][y];
        if (square.piece && square.piece.color !== this.color){
            this.appendToPositions(x, y);
        }
    }

    appendStraightPosition(x,y){
        let square = board.squares[x][y];
        if (!square.piece){
            this.appendToPositions(x, y);
        }
    }
}

function renderSquare(square, posX, posY){
    let squareDiv = document.createElement("div");
    squareDiv.classList.add("square", square.isDark?"dark":"light");
    if (square.piece_type !== undefined && square.piece_color !== undefined){
        squareDiv.classList.add(square.piece_color+"_"+square.piece_type);
    }else if (square.piece){
        squareDiv.classList.add(square.piece.getClassName());
    }
    squareDiv.id = posX+"_"+posY;
    squareDiv.onclick = clickSquare;
    return squareDiv;
}

function renderBoard(isReverse) {
    let boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    let squares = board.squares;
    if (!isReverse){
        for (let x = dimension - 1; x >= 0; x--) {
            let row = squares[x];
            for (let y = 0; y < row.length; y++) {
                boardDiv.append(renderSquare(row[y], x, y));
            }
        }
    }else { 
        for (let x = 0; x < dimension; x++) {
            let row = squares[x];
            for (let y = dimension - 1; y >= 0; y--) {
                boardDiv.append(renderSquare(row[y], x, y));
            }
        }
    }
    
}

function evaluatePossiblePositions(event) {
    let squareDiv = event.target;
    if (previous_click === squareDiv.id){
        previous_click = undefined;
        possible_positions = undefined;
        piece_movable = false;
        squareClicked = false;
        return;
    }
    let [posX, posY] = squareDiv.id.split("_");
    var square = board.squares[Number(posX)][Number(posY)];
    if (square.piece !== undefined){
        squareDiv.classList.add("active");
        previous_click = squareDiv.id;
        squareClicked = true;
        possible_positions = square.piece.get_possible_moves();
        if (possible_positions && possible_positions.length>0){
            piece_movable = true;
            possible_positions.forEach(pos => {
                let [posX,posY] = pos.split("_");
                let pos_square = board.squares[posX][posY];
                let className = pos_square.piece ? "circle-div" : "center-div";
                let highlightDiv = document.createElement("div");
                highlightDiv.classList.add(className);
                document.getElementById(pos).append(highlightDiv);
            });
        }
    }
}

function cancelMove(event) {
    document.getElementById(previous_click).classList.remove("active");
    possible_positions.forEach(pos => {
        let posSquareDiv = document.getElementById(pos).querySelector("div");
        if (posSquareDiv){
            posSquareDiv.remove();
        }
    });
    possible_positions = undefined;
    previous_click = undefined;
    piece_movable = false;
    squareClicked = false;
    return;
}

function movePiece(event) {
    let squareDiv = event.target;
    let current_position = squareDiv.id;
    if (possible_positions.includes(current_position)){
        let [preX, preY] = previous_click.split("_");
        let [posX, posY] = current_position.split("_");
        let temp = board.squares[preX][preY].piece;
        temp.setPosition(Number(posX), Number(posY));
        board.squares[preX][preY] = new Square(Number(preX), Number(preY));
        board.squares[posX][posY] = new Square(Number(posX), Number(posY), temp);
        renderBoard();
    }
    cancelMove();
}

var squareClicked = false;
var previous_click;
var piece_movable = false;
var possible_positions;
function clickSquare(event){
    if (!squareClicked){
        evaluatePossiblePositions(event)
    }else if(piece_movable){
        movePiece(event);
    }
}

function initBoard(){
    board = new Board();
    renderBoard(true);
}

var board;
var dimension = 8;
initBoard();

