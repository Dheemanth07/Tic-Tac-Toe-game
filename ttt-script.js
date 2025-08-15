const start = document.querySelector('.js-start-button');
const restart = document.querySelector('.js-restart-button');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

start.addEventListener('click',()=>{
    console.log('Game started');
    start_game();
});

restart.addEventListener('click',()=>{
    console.log('Game restarted');
    restart_game();
});

const cell = document.querySelectorAll('.cell');
const statusText = document.querySelector('#status');

function start_game() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    statusText.textContent = `Player: ${currentPlayer}'s turn`;

    cell.forEach((cellElement)=>{
        cellElement.textContent = "";
        cellElement.classList.remove('win');
        cellElement.removeEventListener('click', handleCellClick);
        cellElement.addEventListener('click', handleCellClick);
    });

    statusText.textContent = `Player: ${currentPlayer}'s turn`;
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const index = clickedCell.getAttribute('data-index');
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
    saveGameState();
}

function checkResult() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            document.querySelector(`[data-index="${a}"]`).classList.add("win");
            document.querySelector(`[data-index="${b}"]`).classList.add("win");
            document.querySelector(`[data-index="${c}"]`).classList.add("win");

            statusText.textContent = `Player ${board[a]} wins!`;
            gameActive = false;
            return;
        }
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        saveGameState();
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player: ${currentPlayer}'s turn`;
}

function restart_game() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;

    cell.forEach((cellElement) => {
        cellElement.textContent = "";
        cellElement.classList.remove('win');
        cellElement.removeEventListener('click', handleCellClick);
        cellElement.addEventListener('click', handleCellClick);
    });
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    localStorage.removeItem('board');
    localStorage.removeItem('currentPlayer');
    localStorage.removeItem('gameActive');
    saveGameState();
}

function saveGameState() {
    localStorage.setItem('board', JSON.stringify(board));
    localStorage.setItem('currentPlayer', currentPlayer);
    localStorage.setItem('gameActive', gameActive);
    console.log('Game state saved');
}

function loadGameState() {
    const savedBoard = JSON.parse(localStorage.getItem('board'));
    const savedPlayer = localStorage.getItem('currentPlayer');
    const savedActive = localStorage.getItem('gameActive');

    if (savedBoard && savedPlayer && savedActive !== null) {
        board = savedBoard;
        currentPlayer = savedPlayer;
        gameActive = (savedActive === 'true');

        cell.forEach((cellElement, index) => {
            cellElement.textContent = board[index];
            cellElement.classList.remove('win');
            cellElement.removeEventListener('click', handleCellClick);
            cellElement.addEventListener('click', handleCellClick);
        });

        // Optionally, you may want to re-check if there’s a winner or draw here
        statusText.textContent = gameActive ? `Player: ${currentPlayer}'s turn` : 'Game over. Click restart to play again';
    } else {
        start_game();
    }
}
window.onload = loadGameState;