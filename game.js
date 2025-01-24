// Initialize the game board
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // X starts first
let gameOver = false;

// Get elements
const boardDiv = document.getElementById('board');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

// Function to render the board
function renderBoard() {
    boardDiv.innerHTML = ''; // Clear the current board
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = board[i];
        cell.addEventListener('click', () => makeMove(i));
        if (board[i] !== '') {
            cell.classList.add('taken');
        }
        boardDiv.appendChild(cell);
    }
}

// Function to handle a player move
function makeMove(index) {
    if (board[index] !== '' || gameOver || currentPlayer === 'O') return; // Don't allow move if cell is already taken, game is over, or it's the AI's turn
    board[index] = currentPlayer;
    renderBoard();
    checkWinner();
    if (!gameOver) {
        currentPlayer = 'O'; // Switch to AI (O) after player move
        setTimeout(aiMove, 500); // AI makes a move after a short delay
    }
}

// Function to check for a winner
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            gameOver = true;
            statusDiv.textContent = `${board[a]} wins!`;
            return;
        }
    }

    if (!board.includes('')) {
        gameOver = true;
        statusDiv.textContent = 'It\'s a draw!';
    }

    if (!gameOver) {
        statusDiv.textContent = `${currentPlayer}'s turn`;
    }
}

// Minimax Algorithm
function minimax(board, depth, isMaximizing) {
    const scores = {
        'X': -1,  // Minimize for 'X'
        'O': 1,   // Maximize for 'O'
        'draw': 0
    };

    // Check if the game has ended
    const winner = checkWinnerWithBoard(board);
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';  // Make the move
                best = Math.max(best, minimax(board, depth + 1, false)); // Minimize the opponent's score
                board[i] = ''; // Undo the move
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';  // Make the move
                best = Math.min(best, minimax(board, depth + 1, true)); // Maximize AI's score
                board[i] = ''; // Undo the move
            }
        }
        return best;
    }
}

// Function to find the best move for AI
function findBestMove() {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O'; // AI's move
            let moveVal = minimax(board, 0, false); // Call minimax to get the move value
            board[i] = ''; // Undo the move

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

// AI move logic (using Minimax)
function aiMove() {
    if (gameOver) return;

    const bestMove = findBestMove();
    board[bestMove] = 'O';  // Make AI's move
    renderBoard();
    checkWinner();
    if (!gameOver) {
        currentPlayer = 'X'; // Switch back to player after AI move
    }
}

// Helper function to check the winner based on the current board
function checkWinnerWithBoard(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return 'X' or 'O' as the winner
        }
    }

    if (!board.includes('')) {
        return 'draw';  // If no more moves, it's a draw
    }

    return null;  // Game is not over
}

// Reset the game
resetBtn.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameOver = false;
    statusDiv.textContent = `${currentPlayer}'s turn`;
    renderBoard();
});

// Initial rendering of the board
renderBoard();