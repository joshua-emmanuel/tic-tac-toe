function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push('');
    }
  }

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push('');
      }
    }
  };

  const getBoard = () => board;

  const makeMove = (row, column, player) => {
    const token = player.token;

    let rightMove = true;

    if (board[row][column] === '') {
      rightMove = true;
      board[row][column] = token;
    } else {
      rightMove = false;
      console.log('Cell is not empty. Please mark another cell');
    }

    return { rightMove };
  };

  return { getBoard, resetBoard, makeMove };
}

function Player(name, token) {
  return {
    name,
    token,
  };
}

function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player 2'
) {
  const board = Gameboard();

  const playerOne = Player(playerOneName, 'X');
  const playerTwo = Player(playerTwoName, 'O');

  let currentPlayer = playerOne;

  const getCurrentPlayer = () => currentPlayer;

  const switchCurrentPlayer = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };

  const checkHorizontalMatch = (board) => {
    for (let i = 0; i < 3; i++) {
      if (board[i][0] !== '') {
        if (board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
          return true;
        }
      }
    }
  };

  const checkVerticalMatch = (board) => {
    for (let i = 0; i < 3; i++) {
      if (board[0][i] !== '') {
        if (board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
          return true;
        }
      }
    }
  };

  const checkDiagonalMatch = (board) => {
    if (board[0][0] !== '') {
      if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return true;
      }
    }

    if (board[0][2] !== '') {
      if (board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        return true;
      }
    }
  };

  const checkWin = () => {
    const boardArray = board.getBoard();

    const horizontalMatch = checkHorizontalMatch(boardArray);
    const verticalMatch = checkVerticalMatch(boardArray);
    const diagonalMatch = checkDiagonalMatch(boardArray);

    if (horizontalMatch || verticalMatch || diagonalMatch) return true;
  };

  const checkTie = () => {
    const boardArray = board.getBoard();

    const tieCheckerArray = [];
    boardArray.forEach((row) => {
      row.forEach((cell) => {
        tieCheckerArray.push(cell);
      });
    });

    const isTie = tieCheckerArray.every((cell) => cell !== '');
    return isTie;
  };

  const playRound = (row, column) => {
    const player = currentPlayer;

    console.log(
      `${player.name} is playing ${player.token} in row ${row} column ${column}`
    );
    const makeMove = board.makeMove(row, column, player);

    if (makeMove.rightMove === true) {
      const winner = checkWin();
      if (!winner) switchCurrentPlayer();
    }
  };

  const resetGame = () => {
    board.resetBoard();
    currentPlayer = playerOne;
  };

  return {
    playRound,
    getBoard: board.getBoard,
    getCurrentPlayer,
    resetGame,
    checkWin,
    checkTie,
  };
}

function ScreenController() {
  const game = GameController();
  const gameBoard = game.getBoard();
  const boardDiv = document.getElementById('board');

  const createCell = (row, column) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');

    cell.dataset.row = row;
    cell.dataset.column = column;

    return cell;
  };

  const renderBoard = () => {
    boardDiv.innerHTML = '';
    for (let row = 0; row < gameBoard.length; row++) {
      for (let column = 0; column < gameBoard[row].length; column++) {
        const cell = createCell(row, column);
        cell.textContent = gameBoard[row][column];
        boardDiv.appendChild(cell);
      }
    }
  };

  boardDiv.addEventListener('click', (event) => {
    if (!event.target.closest('.cell')) return;
    const clickedCell = event.target;
    const row = parseInt(clickedCell.dataset.row);
    const column = parseInt(clickedCell.dataset.column);

    game.playRound(row, column);

    const isAWinningMove = game.checkWin();
    const isTie = game.checkTie();
    if (isAWinningMove) {
      setTimeout(() => {
        alert(`Winner is ${game.getCurrentPlayer().name}.`);
        game.resetGame();
        renderBoard();
      }, 300);
    } else if (isTie) {
      setTimeout(() => {
        alert(`Game ended in a tie.`);
        game.resetGame();
        renderBoard();
      }, 300);
    }

    renderBoard();
  });

  renderBoard();
}

ScreenController();
