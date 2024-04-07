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
            if (this.piece instanceof King){
                king_position[piece_color === "light" ? 0 : 1] = posX+"_"+posY;
            }
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
    setPossiblePositions(positions){ 
        this.positions = positions;
    }

    appendToPositions(x, y, isAttack){
        let square = board.squares[x][y];
        if ((square.piece && square.piece.color===this.color) || (square.piece && square.piece.color!==this.color && square.piece instanceof King && !isAttack)){
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

    get_possible_moves(isAttack){
        this.positions = [];
        let x = this.posX;
        let y = this.posY;
        let occupied = [false,false,false,false];
        for (let i = 1; i < dimension; i++) {
            if (!occupied[0] && x - i >= 0){
                occupied[0] = !this.appendToPositions(x - i, y, isAttack);
            }
            if (!occupied[1] && x + i < dimension){
                occupied[1] = !this.appendToPositions(x + i, y, isAttack);
            }
            if (!occupied[2] && y - i >= 0){
                occupied[2] = !this.appendToPositions(x, y - i, isAttack);
            }
            if (!occupied[3] && y + i < dimension){
                occupied[3] = !this.appendToPositions(x, y + i, isAttack);
            }
        }
        return this.positions;
    }
}

class Knight extends Piece{
    getClassName(){
        return this.color+"_knight";
    }

    get_possible_moves(isAttack){
        this.positions = [];
        for (let x = this.posX - 2; x <= this.posX + 2; x++){
            if (x >= 0 && x < dimension && x !== this.posX){
                for (let y = this.posY - 2; y <= this.posY + 2; y++){
                    if (y >= 0 && y < dimension && y !== this.posY){
                        if (Math.abs(this.posX - x) !== Math.abs(this.posY - y)){
                            this.appendToPositions(x, y, isAttack);
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

    get_possible_moves(isAttack){
        this.positions = [];
        let x = this.posX;
        let y = this.posY;
        let occupied = [false,false,false,false];
        for (let i = 1; i <= dimension; i++) {
            if (!occupied[0] && y + i < dimension && x + i < dimension){
                occupied[0] = !this.appendToPositions(x + i, y + i, isAttack);
            }
            if (!occupied[1] && y - i >= 0 && x - i >= 0){
                occupied[1] = !this.appendToPositions(x - i, y - i, isAttack);
            }
            if (!occupied[2] && x + i < dimension && y - i >= 0){
                occupied[2] = !this.appendToPositions(x + i, y - i, isAttack);
            }
            if (!occupied[3] && y + i < dimension && x - i >= 0){
                occupied[3] = !this.appendToPositions(x - i, y + i, isAttack);
            }
        }
        return this.positions;
    }
}

class Queen extends Piece{
    getClassName(){
        return this.color+"_queen";
    }

    get_possible_moves(isAttack){
        this.positions = [];
        let x = this.posX;
        let y = this.posY;
        let occupied = [false,false,false,false,false,false,false,false];
        for (let i = 1; i < dimension; i++) {
            if (!occupied[0] && x - i >= 0){
                occupied[0] = !this.appendToPositions(x - i, y, isAttack);
            }
            if (!occupied[1] && x + i < dimension){
                occupied[1] = !this.appendToPositions(x + i, y, isAttack);
            }
            if (!occupied[2] && y - i >= 0){
                occupied[2] = !this.appendToPositions(x, y - i, isAttack);
            }
            if (!occupied[3] && y + i < dimension){
                occupied[3] = !this.appendToPositions(x, y + i, isAttack);
            }
            if (!occupied[4] && y + i < dimension && x + i < dimension){
                occupied[4] = !this.appendToPositions(x + i, y + i, isAttack);
            }
            if (!occupied[5] && y - i >= 0 && x - i >= 0){
                occupied[5] = !this.appendToPositions(x - i, y - i, isAttack);
            }
            if (!occupied[6] && x + i < dimension && y - i >= 0){
                occupied[6] = !this.appendToPositions(x + i, y - i, isAttack);
            }
            if (!occupied[7] && y + i < dimension && x - i >= 0){
                occupied[7] = !this.appendToPositions(x - i, y + i, isAttack);
            }
        }
        return this.positions;
    }
}

class King extends Piece{
    valid;
    blocking_directions;
    getClassName(){
        return this.color+"_king";
    }

    isBlockingPosition(x, y){
        let square = board.squares[x][y];
        if (square.piece && square.piece.color === this.color){
            return false;
        }
        if (square.piece){
            return true;
        }
        return x+"_"+y;
    }

    moveFromValidToPositions(){
        let $this = this;
        $this.valid.forEach(function(pos) {
            $this.positions.push(pos);
        })
        $this.valid = [];
    }

    addToValid(x,y){
        this.valid.push(x + "_" + y);
    }

    getBlockingPositions(){
        this.blocking_directions = 0;
        this.positions = [];
        this.valid = [];
        let x = this.posX;
        let y = this.posY;
        for (let i = 1; i < dimension; i++) {
            if (x - i >= 0){
                let isBlocking = this.isBlockingPosition(x - i, y);
                if (isBlocking){
                    this.addToValid(x - i, y);
                }
                if (isBlocking === true){
                    this.moveFromValidToPositions();
                    this.blocking_directions++;
                    break;
                }
                if (!isBlocking || i == dimension - 1){
                    this.valid = [];
                    break;
                }
            }else{
                this.valid = [];
                break;
            }
        }
        for (let i = 1; i < dimension; i++) {
            if (x + i < dimension){
                let isBlocking = this.isBlockingPosition(x + i, y);
                if (isBlocking){
                    this.addToValid(x + i, y);
                }
                if (isBlocking === true){
                    this.moveFromValidToPositions();
                    this.blocking_directions++;
                    break;
                }
                if (!isBlocking || i == dimension - 1){
                    this.valid = [];
                    break;
                }
            }else{
                this.valid = [];
                break;
            }
        }
        for (let i = 1; i < dimension; i++) {
            if (y - i >= 0){
                let isBlocking = this.isBlockingPosition(x, y - i);
                if (isBlocking){
                    this.addToValid(x, y - i);
                }
                if (isBlocking === true){
                    this.moveFromValidToPositions();
                    this.blocking_directions++;
                    break;
                }
                if (!isBlocking || i == dimension - 1){
                    this.valid = [];
                    break;
                }
            }else{
                this.valid = [];
                break;
            }
        }
        for (let i = 1; i < dimension; i++) {
            if (y + i < dimension){
                let isBlocking = this.isBlockingPosition(x, y + i);
                if (isBlocking){
                    this.addToValid(x, y + i);
                }
                if (isBlocking === true){
                    this.moveFromValidToPositions();
                    this.blocking_directions++;
                    break;
                }
                if (!isBlocking || i == dimension - 1){
                    this.valid = [];
                    break;
                }
            }else {
                this.valid = [];
                break;
            }
        }
        for (let i = 1; i < dimension; i++) {
            if (x + i < dimension && y + i < dimension){
                let isBlocking = this.isBlockingPosition(x + i, y + i);
                if (isBlocking){
                    this.addToValid(x + i, y + i);
                }
                if (isBlocking === true){
                    this.moveFromValidToPositions();
                    this.blocking_directions++;
                    break;
                }
                if (!isBlocking || i == dimension - 1){
                    this.valid = [];
                    break;
                }
            }else{
                this.valid = [];
                break;
            }
        }
        for (let i = 1; i < dimension; i++) {
            if (x - i >= 0 && y - i >= 0){
                let isBlocking = this.isBlockingPosition(x - i, y - i);
                if (isBlocking){
                    this.addToValid(x - i, y - i);
                }
                if (isBlocking === true){
                    this.moveFromValidToPositions();
                    this.blocking_directions++;
                    break;
                }
                if (!isBlocking || i == dimension - 1){
                    this.valid = [];
                    break;
                }
            }else{
                this.valid = [];
                break;
            }
        }
        for (let i = 1; i < dimension; i++) {
            if (x + i < dimension && y - i >= 0){
                let isBlocking = this.isBlockingPosition(x + i, y - i);
                if (isBlocking){
                    this.addToValid(x + i, y - i);
                }
                if (isBlocking === true){
                    this.moveFromValidToPositions();
                    this.blocking_directions++;
                    break;
                }
                if (!isBlocking || i == dimension - 1){
                    this.valid = [];
                    break;
                }
            }else{
                this.valid = [];
                break;
            }
        }
        for (let i = 1; i < dimension; i++) {
            if (x - i >= 0 && y + i < dimension){
                let isBlocking = this.isBlockingPosition(x - i, y + i);
                if (isBlocking){
                    this.addToValid(x - i, y + i);
                }
                if (isBlocking === true){
                    this.moveFromValidToPositions();
                    this.blocking_directions++;
                    break;
                }
                if (!isBlocking || i == dimension - 1){
                    this.valid = [];
                    break;
                }
            }else{
                this.valid = [];
                break;
            }
        }
        return this.positions;
    }

    

    get_possible_moves(isAttack){
        this.positions = [];
        let x = this.posX;
        let y = this.posY;
        if (x - 1 >= 0){
            this.appendToPositions(x - 1, y, isAttack);
        }
        if (x + 1 < dimension){
            this.appendToPositions(x + 1, y, isAttack);
        }
        if (y - 1 >= 0){
            this.appendToPositions(x, y - 1, isAttack);
        }
        if (y + 1 < dimension){
            this.appendToPositions(x, y + 1, isAttack);
        }
        if (y + 1 < dimension && x + 1 < dimension){
            this.appendToPositions(x + 1, y + 1, isAttack);
        }
        if (y - 1 >= 0 && x - 1 >= 0){
            this.appendToPositions(x - 1, y - 1, isAttack);
        }
        if (x + 1 < dimension && y - 1 >= 0){
            this.appendToPositions(x + 1, y - 1, isAttack);
        }
        if (y + 1 < dimension && x - 1 >= 0){
            this.appendToPositions(x - 1, y + 1, isAttack);
        }
        return this.positions;
    }
}

class Pawn extends Piece{
    getClassName(){
        return this.color+"_pawn";
    }

    get_possible_moves(isAttack) {
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
                this.appendCrossPosition(x - 1, y - 1, isAttack);
            }
            if (y + 1 < dimension){
                this.appendCrossPosition(x - 1, y + 1, isAttack);
            }
        }else if (this.color === "light" && x + 1 < dimension){
            if (y - 1 >= 0){
                this.appendCrossPosition(x + 1, y - 1, isAttack);
            }
            if (y + 1 < dimension){
                this.appendCrossPosition(x + 1, y + 1, isAttack);
            }
        }
        return this.positions;
    }

    appendCrossPosition(x, y, isAttack) {
        let square = board.squares[x][y];
        if (square.piece && square.piece.color !== this.color){
            this.appendToPositions(x, y, isAttack);
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

function renderBoard(isWhite) {
    let boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    let squares = board.squares;
    if (isWhite){
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

function evaluatePossiblePositions(squareDiv) {
    if (previous_click === squareDiv.id){
        previous_click = undefined;
        possible_positions = undefined;
        piece_movable = false;
        squareClicked = false;
        return;
    }
    let [posX, posY] = squareDiv.id.split("_");
    var square = board.squares[Number(posX)][Number(posY)];
    var current_player = isWhite ? "light": "dark";
    if (square.piece !== undefined && square.piece.color === current_player){
        squareDiv.classList.add("active");
        previous_click = squareDiv.id;
        squareClicked = true;
        if (isChecked){
            possible_positions = square.piece.positions;
        }else{
            possible_positions = square.piece.get_possible_moves();
        }
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

function cancelMove(revertBoard) {
    if (revertBoard){
        document.getElementById(previous_click).classList.remove("active");
        possible_positions.forEach(pos => {
            let posSquareDiv = document.getElementById(pos).querySelector("div");
            if (posSquareDiv){
                posSquareDiv.remove();
            }
        });
    }
    possible_positions = undefined;
    previous_click = undefined;
    piece_movable = false;
    squareClicked = false;
}

function movePiece(current_position) {
    if (possible_positions.includes(current_position)){
        let [preX, preY] = previous_click.split("_");
        let [posX, posY] = current_position.split("_");
        let temp = board.squares[preX][preY].piece;
        temp.setPosition(Number(posX), Number(posY));
        if (temp instanceof King){
            king_position[temp.piece_color === "light" ? 0 : 1] = current_position;
        }
        board.squares[preX][preY] = new Square(Number(preX), Number(preY));
        board.squares[posX][posY] = new Square(Number(posX), Number(posY), temp);
        isWhite = !isWhite;
        isChecked = validateIsChecked();
        resolvePossibleMoves();
        renderBoard(isWhite);
        document.getElementById(previous_click).classList.add("active");
        document.getElementById(current_position).classList.add("active");
        cancelMove();
        return;
    }
    cancelMove(true);
}

function resolvePossibleMoves(){
    let current_color = isWhite ? 'light' : 'dark';
    let kingPosition = king_position[isWhite ? 0 : 1].split("_");
    let blocking_positions = board.squares[kingPosition[0]][kingPosition[1]].piece.getBlockingPositions();
    for (let x = 0; x < dimension; x++){
        for (let y = 0; y < dimension; y++) {
            let piece = board.squares[x][y].piece;
            if (piece && piece.color === current_color){
                let valid_positions = [];
                let attack_positions = piece.get_possible_moves(true);
                attack_positions.forEach(function(position){
                    if (blocking_positions.includes(position)){
                        valid_positions.push(position);
                    }
                });
                piece.positions = valid_positions;
            }else if (piece && piece.color !== current_color){
                let attack_positions = piece.get_possible_moves(true);
                if (attack_positions.includes(kingPosition) && blocking_positions.includes(x+"_"+y)){
                    blocking_positions.push(x+"_"+y);
                    this.blocking_directions++;
                }
            }
        }
    }
}

function validateIsChecked(validate_position){
    let current_color = isWhite ? 'light' : 'dark';
    if (!validate_position){
        validate_position = king_position[isWhite ? 0 : 1];
    }
    for (let x = 0; x < dimension; x++){
        for (let y = 0; y < dimension; y++) {
            let piece = board.squares[x][y].piece
            if (piece && piece.color !== current_color){
                let attack_positions = piece.get_possible_moves(true);
                if (attack_positions.includes(validate_position)){
                    return true;
                }
            }
        }
    }
    return false;
}

var squareClicked = false;
var previous_click;
var piece_movable = false;
var isWhite = true;
var isChecked = false;
var king_position = [];
var possible_positions;
function clickSquare(event){
    let squareDiv = event.target;
    if (!squareClicked){
        evaluatePossiblePositions(squareDiv);
        return;
    }else if (squareClicked){
        let [preX, preY] = previous_click.split("_");
        let [posX, posY] = squareDiv.id.split("_");
        let square = board.squares[Number(posX)][Number(posY)];
        let previous = board.squares[preX][preY].piece;
        if (square.piece !== undefined && square.piece.color === previous.color){
            cancelMove(true);
            evaluatePossiblePositions(squareDiv);
            return;
        }
    }
    
    if(piece_movable){
        movePiece(squareDiv.id);
    }
}

function initBoard(){
    board = new Board();
    renderBoard(isWhite);
}

var board;
var dimension = 8;
initBoard();

