"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 //let board = []; // array of rows, each row is array of cells  (board[y][x])

class Game {
  constructor(y, x, p1, p2){
    //this.height this.width
    this.y = y;
    this.x = x;
    this.p1 = p1;
    this.p2 = p2;
    this.currPlayer = p1;
    this.board = [];
    this.makeBoard();
    this.makeHtmlBoard();
    this.winner = false;
  }

  makeBoard() {
    for (let y = 0; y < this.y; y++) {
      this.board.push(Array.from({ length: this.x }));
    }
  }

  // /** makeHtmlBoard: make HTML table and row of column tops. */

 makeHtmlBoard() {
  const board = document.getElementById('board');

  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', this.handleClick.bind(this));

  for (let x = 0; x < this.x; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  board.append(top);

  // make main part of board
  for (let y = 0; y < this.y; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.x; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
}

// /** findSpotForCol: given column x, return top empty y (null if filled) */

findSpotForCol(x) {
  for (let y = this.y - 1; y >= 0; y--) {
    if (!this.board[y][x]) {
      return y;
    }
  }
  return null;
}

// /** placeInTable: update DOM to place piece into HTML table of board */

placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`${this.currPlayer.playerNumber}`);
  piece.style.backgroundColor = this.currPlayer.pieceColor;
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

// /** handleClick: handle click of column top to play piece */

handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // check for winner
  if(this.winner) return;

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer;
  this.placeInTable(y, x);

  // check for win
 if (this.checkForWin()) {
  this.winner = true;
  //document.getElementById('column-top').removeEventListener('click');
  return this.endGame(`Player ${this.currPlayer.playerNumber} won!`);
 }

  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return this.endGame('Tie!');
  }

  // switch players
  this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
}

// /** endGame: announce game end */

endGame(msg) {
  alert(msg);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

checkForWin() {

  const _win = cells => {
     return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.y &&
        x >= 0 &&
        x < this.x &&
        this.board[y][x] === this.currPlayer
     )};

  // (use alternative above)
  // function _win(cells) {
  //   // make arrow function

  //   // Check four cells to see if they're all color of current player
  //   //  - cells: list of four (y, x) cells
  //   //  - returns true if all are legal coordinates & all match currPlayer

  //   return cells.every(
  //     ([y, x]) =>
  //       y >= 0 &&
  //       y < this.y &&
  //       x >= 0 &&
  //       x < this.x &&
  //       this.board[y][x] === this.currPlayer
  //   );
  // }

  for (let y = 0; y < this.y; y++) {
    for (let x = 0; x < this.x; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

}

class Player {
  constructor(pieceColor, x) {
    this.pieceColor = pieceColor;
    this.playerNumber = `${x}`;
  }
}

const form = document.getElementById("form");
form.addEventListener("submit", function(event) {
  event.preventDefault();

  const playerOne = document.getElementById("player1").value;
  const playerTwo = document.getElementById("player2").value;

  const p1 = new Player(playerOne, 1);
  const p2 = new Player(playerTwo, 2);

  document.getElementById("board").innerHTML = '';
  new Game(6,7,p1,p2);

});