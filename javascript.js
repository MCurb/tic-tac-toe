/* ================================
1. DOM SELECTORS
================================ */

const body = document.querySelector("body");
const winnerMessage = document.createElement("p");
const restartBtn = document.querySelector(".restart-btn");
body.insertBefore(winnerMessage, restartBtn);

const aiBtn = document.querySelector(".ai-btn");
const playerBtn = document.querySelector(".player-btn");

const xTurn = document.querySelector(".turn-x");
const oTurn = document.querySelector(".turn-o");

const gridContainer = document.querySelector(".game-grid");
const divs = document.querySelectorAll(".game-grid div");

/* ================================
2. FACTORY FUNCTIONS / MODULES
================================ */

// Get the players choice, check if valid and put it in the board array
// Check if there's a winner or if game is tied
const gameBoard = (function () {
  let board = [];
  const winningCombos = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal TL to BR
    [2, 4, 6], // diagonal TR to BL
  ];
  let winner = false;
  let correctInput = true;
  let gameTied = false;

  // Validate users choice and push it to the board array
  const updateBoard = (playerMarker, position) => {
    if (board[position] === undefined) {
      board[position] = playerMarker;
      correctInput = true;
    } else if (board[position] !== undefined) {
      correctInput = false;
    }
  };

  // Check if the game is tied or declare a game winner
  const checkWinner = (playerName, playerMarker, timesPlayed) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        board[a] === playerMarker &&
        board[b] === playerMarker &&
        board[c] === playerMarker
      ) {
        winner = true;
        divs[a].classList.add("winner-div");
        divs[b].classList.add("winner-div");
        divs[c].classList.add("winner-div");

        winnerMessage.classList.add("winner-message");
        winnerMessage.textContent = `${playerName} wins!`;
        break;
      } else if (timesPlayed === 9 && combo === winningCombos[7]) {
        winnerMessage.classList.add("tied-message");
        winnerMessage.textContent = "Game is tied!";
        divs.forEach((div) => {
          div.classList.add("draw");
        });
        gameTied = true;
        break;
      }
    }
  };

  const getWinnerStatus = () => {
    return winner;
  };

  const getGameStatus = () => {
    return gameTied;
  };

  const checkInput = () => {
    return correctInput;
  };

  const getBoardContent = () => {
    return board;
  };

  const changeInput = () => {
    correctInput = true;
  };

  const resetBoard = () => {
    board = [];
    winner = false;
    gameTied = false;
    correctInput = true;
  };

  return {
    updateBoard,
    checkWinner,
    getWinnerStatus,
    checkInput,
    getBoardContent,
    changeInput,
    getGameStatus,
    resetBoard,
  };
})();

// This is like the game controller

const switchPlayerTurn = (function () {
  let justPlayed = false;
  let timesPlayed = 0;
  xTurn.classList.add("active-turn");
  const switchTurn = (position) => {
    if (
      gameBoard.checkInput() &&
      justPlayed === false &&
      gameBoard.getWinnerStatus() === false
    ) {
      updateBoard(player1.marker, position);
      if (gameBoard.checkInput()) {
        oTurn.classList.add("active-turn");
        xTurn.classList.remove("active-turn");
        updateDOM();
        timesPlayed++;
        checkWinner(player1.name, player1.marker, timesPlayed);
        justPlayed = true;
      } else {
        gameBoard.changeInput();
      }
    } else if (
      gameBoard.checkInput() &&
      justPlayed &&
      gameBoard.getWinnerStatus() === false
    ) {
      updateBoard(player2.marker, position);
      if (gameBoard.checkInput()) {
        xTurn.classList.add("active-turn");
        oTurn.classList.remove("active-turn");
        updateDOM();
        timesPlayed++;
        checkWinner(player2.name, player2.marker, timesPlayed);
        justPlayed = false;
      } else {
        gameBoard.changeInput();
      }
    }
  };
  const reset = () => {
    justPlayed = false;
    timesPlayed = 0;
  };

  return { switchTurn, reset };
})();

// Game controller for AI game mode
const switchAiTurn = (function () {
  let justPlayed = false;
  let timesPlayed = 0;
  xTurn.classList.add("active-turn");
  const switchTurn = (position) => {
    if (
      gameBoard.checkInput() &&
      justPlayed === false &&
      gameBoard.getWinnerStatus() === false
    ) {
      updateBoard(human.marker, position);
      if (gameBoard.checkInput()) {
        oTurn.classList.add("active-turn");
        xTurn.classList.remove("active-turn");
        updateDOM();
        timesPlayed++;
        checkWinner(human.name, human.marker, timesPlayed);
        justPlayed = true;
        setTimeout(() => switchAiTurns(Math.floor(Math.random() * 9)), 180);
      } else {
        gameBoard.changeInput();
      }
    } else if (
      gameBoard.checkInput() &&
      justPlayed &&
      gameBoard.getWinnerStatus() === false
    ) {
      updateBoard(cpu.marker, position);
      if (gameBoard.checkInput()) {
        xTurn.classList.add("active-turn");
        oTurn.classList.remove("active-turn");
        updateDOM();
        timesPlayed++;
        checkWinner(cpu.name, cpu.marker, timesPlayed);
        justPlayed = false;
      } else if (gameStatus() === false && gameBoard.checkInput() === false) {
        gameBoard.changeInput();
        setTimeout(() => switchAiTurns(Math.floor(Math.random() * 9)), 180);
      }
    }
  };
  const reset = () => {
    justPlayed = false;
    timesPlayed = 0;
  };

  return {
    switchTurn,
    reset,
  };
})();

/* ================================
3. PURE LOGIC FUNCTIONS
================================ */

function createPlayer(name, marker) {
  return { name, marker };
}

// Create the player objects

const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");
const human = createPlayer("Human", "X");
const cpu = createPlayer("AI", "O");

// Work with the closures

const updateBoard = gameBoard.updateBoard;
const checkWinner = gameBoard.checkWinner;
const checkInput = gameBoard.checkInput;
const gameStatus = gameBoard.getGameStatus;
const resetBoard = gameBoard.resetBoard;

const switchPlayersTurn = switchPlayerTurn.switchTurn;
const resetPlayers = switchPlayerTurn.reset;

const switchAiTurns = switchAiTurn.switchTurn;
const resetAi = switchAiTurn.reset;

/* ================================
4. DOM UPDATE FUNCTIONS
================================ */

function updateDOM() {
  for (let i = 0; i <= 8; i++) {
    divs[i].textContent = gameBoard.getBoardContent()[i];
  }
}

function jumpBtns() {
  aiBtn.classList.add("jump");
  setTimeout(() => aiBtn.classList.remove("jump"), 500);
  playerBtn.classList.add("jump");
  setTimeout(() => playerBtn.classList.remove("jump"), 500);
}

// Restart everything
function restartGame() {
  resetBoard();
  updateDOM();
  resetPlayers();
  resetAi();
  divs.forEach((div) => {
    div.classList.remove("winner-div", "draw");
  });
  winnerMessage.classList.remove("winner-message", "tied-message");
  winnerMessage.textContent = "";
  playerBtn.classList.remove("active-mode");
  aiBtn.classList.remove("active-mode");
  xTurn.classList.add("active-turn");
  oTurn.classList.remove("active-turn");
  gridContainer.removeEventListener("click", aiEventHandler);
  gridContainer.removeEventListener("click", playersEventHandler);
  gridContainer.addEventListener("click", selectModeHandler);
}

//Partially restart the game when the mode switches

function resetPlayerMode() {
  resetBoard();
  updateDOM();
  resetPlayers();
  resetAi();
  divs.forEach((div) => {
    div.classList.remove("winner-div", "draw");
  });
  winnerMessage.classList.remove("winner-message", "tied-message");
  winnerMessage.textContent = "";
  playerBtn.classList.remove("active-mode");
  xTurn.classList.add("active-turn");
  oTurn.classList.remove("active-turn");
  gridContainer.removeEventListener("click", playersEventHandler);
}

function resetAiMode() {
  resetBoard();
  updateDOM();
  resetPlayers();
  resetAi();
  divs.forEach((div) => {
    div.classList.remove("winner-div", "draw");
  });
  winnerMessage.classList.remove("winner-message", "tied-message");
  winnerMessage.textContent = "";
  aiBtn.classList.remove("active-mode");
  xTurn.classList.add("active-turn");
  oTurn.classList.remove("active-turn");
  gridContainer.removeEventListener("click", aiEventHandler);
}


// Stop the hover and active effect from getting suck in mobile browsers
const handleTapEffect = (function () {
  divs.forEach((div) => {
    div.addEventListener("touchstart", () => {
      div.classList.add("active-tap");

      setTimeout(() => {
        div.classList.remove("active-tap");
      }, 150);
    });

    div.addEventListener("touchend", () => {
      div.classList.remove("active-tap");
    });

    div.addEventListener("touchcancel", () => {
      div.classList.remove("active-tap");
    });
  });

  restartBtn.addEventListener("touchstart", () => {
    restartBtn.classList.add("restart-clicked");
    
    setTimeout(() => {
      restartBtn.classList.remove("restart-clicked");
    }, 150);
  });

  restartBtn.addEventListener("touchend", () => {
    restartBtn.classList.remove("restart-clicked");
  });

  restartBtn.addEventListener("touchcancel", () => {
    restartBtn.classList.remove("restart-clicked");
  });
})();

/* ================================
   5. EVENT HANDLERS
================================ */

function selectModeHandler(event) {
  if (event.target.matches(".square")) {
    jumpBtns()
  }
}

// Handler for the three buttons: 
function clickedBtnHandler(event) {
  if (event.target.closest(".ai-btn")) {
    resetPlayerMode();
    gridContainer.removeEventListener("click", selectModeHandler);
    gridContainer.removeEventListener("click", playersEventHandler);
    gridContainer.addEventListener("click", aiEventHandler);

    playerBtn.classList.remove("active-mode");
    aiBtn.classList.add("active-mode");
  } else if (event.target.closest(".player-btn")) {
    resetAiMode();
    gridContainer.removeEventListener("click", selectModeHandler);
    gridContainer.removeEventListener("click", aiEventHandler);
    gridContainer.addEventListener("click", playersEventHandler);

    aiBtn.classList.remove("active-mode");
    playerBtn.classList.add("active-mode");
  } else if (event.target.matches(".restart-btn")) {
    restartGame();
  }
}

// Take the square position and call the "Game controller" function

function playersEventHandler(event) {
  if (event.target.matches(".square")) {
    const index = parseInt(event.target.dataset.index, 10)
    switchPlayersTurn(index)
  }
}

function aiEventHandler(event) {
 if (event.target.matches(".square")) {
  const index = parseInt(event.target.dataset.index, 10)
  switchAiTurns(index)
 }
}

/* ================================
6. EVENT LISTENERS
================================ */

body.addEventListener("click", clickedBtnHandler);
gridContainer.addEventListener("click", selectModeHandler);