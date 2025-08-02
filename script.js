const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const modeSelection = document.getElementById("modeSelection");

const tapSound = document.getElementById("tapSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameMode = "";
let gameActive = false;

function startGame(mode) {
  gameMode = mode;
  board = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  modeSelection.style.display = "none";
  statusElement.textContent = `Player ${currentPlayer}'s Turn`;
  renderBoard();
}

function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.textContent = cell;
    div.addEventListener("click", () => handleCellClick(index));
    boardElement.appendChild(div);
  });
}

function handleCellClick(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  tapSound.currentTime = 0;
  tapSound.play();
  renderBoard();

  if (checkWin()) {
    statusElement.textContent = currentPlayer === "O" && gameMode === '1' ? `Computer Wins!` : `Player ${currentPlayer} Wins!`;
    winSound.play();
    gameActive = false;
    return;
  } else if (board.every(cell => cell !== "")) {
    statusElement.textContent = "It's a Draw!";
    drawSound.play();
    gameActive = false;
    return;
  }

  if (gameMode === '1' && currentPlayer === 'X') {
    currentPlayer = 'O';
    statusElement.textContent = `Computer's Turn`;
    setTimeout(computerMove, 500);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function computerMove() {
  let emptyCells = board.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  if (emptyCells.length === 0 || !gameActive) return;

  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = "O";
  tapSound.currentTime = 0;
  tapSound.play();
  renderBoard();

  if (checkWin()) {
    statusElement.textContent = "Computer Wins!";
    winSound.play();
    gameActive = false;
  } else if (board.every(cell => cell !== "")) {
    statusElement.textContent = "It's a Draw!";
    drawSound.play();
    gameActive = false;
  } else {
    currentPlayer = "X";
    statusElement.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function checkWin() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winPatterns.some(pattern => {
    const [a,b,c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function restartGame() {
  gameActive = false;
  board = Array(9).fill("");
  currentPlayer = "X";
  modeSelection.style.display = "block";
  statusElement.textContent = "Choose Game Mode";
  boardElement.innerHTML = "";
}
