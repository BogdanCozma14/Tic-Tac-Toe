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
// const player1 = new Player("Alice", "O");
// const player2 = new Player("Bob", "X");
// const game = new Game(player1, player2);
// game.play();
document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.querySelector('#play-btn');
    const player1Input = document.querySelector('#player1');
    const player2Input = document.querySelector('#player2');
    const gameboardContainer = document.querySelector('.gameboard-container');
    const playerForm = document.querySelector('.player-form');
    const tiles = document.querySelectorAll('.tile');
    let game;
    playButton.addEventListener("click", () => {
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();
        // validating both the names
        if (player1Name === "" || player2Name === "") {
            alert('please enter names for both players');
            return;
        }
        playerForm.style.display = 'none';
        const welcomeHeader = document.querySelector(".welcoming");
        welcomeHeader.style.display = 'none';
        gameboardContainer.style.visibility = 'visible'; // make the gameboard visible
        const player1 = new Player(player1Name, "O");
        const player2 = new Player(player2Name, "X");
        game = new Game(player1, player2);
        // verify that the name of players are taken correctly from the form
        console.log(`name of player 1: ${player1.name} with symbol ${player1.symbol}`);
        console.log(`name of player 2: ${player2.name} with symbol ${player2.symbol}`);
        initializeTileListeners(game, tiles);
    });
    function initializeTileListeners(game, tiles) {
        let currentPlayer = game.currentPlayer;

        tiles.forEach((tile, index) => {
            tile.addEventListener('click', () => {
                if(tile.textContent === "") {
                    tile.textContent = currentPlayer.symbol;
                    game.board.board[Math.floor(index/3)][index % 3] = currentPlayer.symbol;
                    if(game.board.checkWinner(currentPlayer)) {
                        setTimeout(() => {
                            alert(`${currentPlayer.name} wins!`);
                        }, 100);
                        return;
                    }
                    if(game.board.isBoardFull()) {
                        setTimeout(() => {
                            alert("It's a tie!");
                        }, 100);
                        return;
                    }
                    game.switchPlayer();
                    currentPlayer = game.currentPlayer;
                }
            });
        });
    }
})