// IIFE for GameBoard
const GameBoard = (function() {
    // This is a factory for creating a single GameBoard instance
    function GameBoard() {
        this.board = [
            ['-', '-', '-'],
            ['-', '-', '-'],
            ['-', '-', '-']
        ];
    }

    GameBoard.prototype.displayBoard = function() {
        for (let row of this.board) {
            console.log(row.join(' | '));
            console.log('-----------');
        }
    };

    GameBoard.prototype.makeMove = function(player) {
        let row, col;
        while (true) {
            row = parseInt(prompt(`${player.name}, enter the row (0, 1, 2):`));
            col = parseInt(prompt(`${player.name}, enter the column (0, 1, 2):`));
            if (row >= 0 && row < 3 && col >= 0 && col < 3) {
                if (this.board[row][col] === '-') {
                    this.board[row][col] = player.symbol;
                    return true;
                } else {
                    console.log('Cell already occupied. Try again.');
                }
            } else {
                console.log('Invalid input. Please enter row and column between 0 and 2.');
            }
        }
    };

    GameBoard.prototype.checkWinner = function(player) {
        const symbol = player.symbol;
        const winningCombinations = [
            // horizontal
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            // vertical
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            // diagonal
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
        for (let combination of winningCombinations) {
            if (combination.every(([row, col]) => this.board[row][col] === symbol)) {
                return true;
            }
        }
        return false;
    };

    GameBoard.prototype.isBoardFull = function() {
        return this.board.every(row => row.every(cell => cell !== '-'));
    };

    return new GameBoard(); // Returns a single instance of GameBoard
})();

// IIFE for Game
const Game = (function() {
    // Main game function
    function Game(player1, player2) {
        this.board = GameBoard; // Use the single instance of GameBoard
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
    }

    Game.prototype.switchPlayer = function() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    };

    Game.prototype.play = function() {
        while (true) {
            this.board.displayBoard();
            console.log(`It's the turn for ${this.currentPlayer.symbol} player`);
            this.board.makeMove(this.currentPlayer);

            if (this.board.checkWinner(this.currentPlayer)) {
                this.board.displayBoard();
                console.log(`${this.currentPlayer.name} wins!`);
                this.currentPlayer.incrementScore();
                break;
            }
            if (this.board.isBoardFull()) {
                console.log("It's a tie.");
                break;
            }
            this.switchPlayer();
        }
    };

    return Game; // Returns the Game constructor
})();

// Player class remains globally available since multiple instances may be needed
class Player {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
        this.score = 0;
    }
    incrementScore() {
        this.score++;
    }
}

// Starting the game (you may want to encapsulate this logic too)
const player1 = new Player("Alice", "O");
const player2 = new Player("Bob", "X");
const game = new Game(player1, player2);
game.play();

