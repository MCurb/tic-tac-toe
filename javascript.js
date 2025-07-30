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

// Get the players choice and put it in the board array
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

  // Validate users choice
  const getChoice = (playerMarker, position) => {
    if (board[position] === undefined) {
      board[position] = playerMarker;
      correctInput = true;
    } else if (board[position] !== undefined) {
      console.log("Ocuppied Position, Try again");
      correctInput = false;
    } else {
      console.log("Something's wrong");
      return;
    }

    console.log(board);
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

  const getWinnerInfo = () => {
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

  return {
    getChoice,
    checkWinner,
    getWinnerInfo,
    checkInput,
    getBoardContent,
    changeInput,
    getGameStatus,
  };
})();

//Write a function that gets called when a square gets selected
//It needs to take the position of the square and use it to send it to the fn that will pass the player marker with the position to the board array
//Then the fn updateDOM will get called to print the new marker

// If an occupied square gets selected alert the user, and do nothing, waiting for another choice

const switchTurnPlayers = (function () {
  let justPlayed = false;
  let timesPlayed = 0;
  xTurn.classList.add("active-turn");
  return function (position) {
    if (
      gameBoard.checkInput() &&
      justPlayed === false &&
      gameBoard.getWinnerInfo() === false
    ) {
      choices(player1.marker, position);
      if (gameBoard.checkInput()) {
        oTurn.classList.add("active-turn");
        xTurn.classList.remove("active-turn");
        updateDOM();
        timesPlayed++;
        checkWinner(player1.name, player1.marker, timesPlayed);
        justPlayed = true;
        console.log(timesPlayed);
        console.log(gameBoard.checkInput());
        console.log(justPlayed);
      } else {
        gameBoard.changeInput();
      }
    } else if (
      gameBoard.checkInput() &&
      justPlayed &&
      gameBoard.getWinnerInfo() === false
    ) {
      choices(player2.marker, position);
      if (gameBoard.checkInput()) {
        xTurn.classList.add("active-turn");
        oTurn.classList.remove("active-turn");
        updateDOM();
        timesPlayed++;
        checkWinner(player2.name, player2.marker, timesPlayed);
        justPlayed = false;
        console.log(timesPlayed);
        console.log(gameBoard.checkInput());
        console.log(justPlayed);
      } else {
        gameBoard.changeInput();
      }
    }
  };
})();

const switchTurnAi = (function () {
  let justPlayed = false;
  let timesPlayed = 0;
  xTurn.classList.add("active-turn");
  return function (position) {
    if (
      gameBoard.checkInput() &&
      justPlayed === false &&
      gameBoard.getWinnerInfo() === false
    ) {
      choices(human.marker, position);
      if (gameBoard.checkInput()) {
        oTurn.classList.add("active-turn");
        xTurn.classList.remove("active-turn");
        updateDOM();
        timesPlayed++;
        checkWinner(human.name, human.marker, timesPlayed);
        justPlayed = true;
        setTimeout(() => switchTurnAi(Math.floor(Math.random() * 9)), 180);
        console.log(timesPlayed);
        console.log(gameBoard.checkInput());
        console.log(justPlayed);
      } else {
        gameBoard.changeInput();
      }
    } else if (
      gameBoard.checkInput() &&
      justPlayed &&
      gameBoard.getWinnerInfo() === false
    ) {
      choices(cpu.marker, position);
      if (gameBoard.checkInput()) {
        xTurn.classList.add("active-turn");
        oTurn.classList.remove("active-turn");
        updateDOM();
        timesPlayed++;
        checkWinner(cpu.name, cpu.marker, timesPlayed);
        justPlayed = false;
        console.log(timesPlayed);
        console.log(gameBoard.checkInput());
        console.log(justPlayed);
      } else if (gameStatus() === false && gameBoard.checkInput() === false) {
        gameBoard.changeInput();
        setTimeout(() => switchTurnAi(Math.floor(Math.random() * 9)), 180);
      }
    }
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

const choices = gameBoard.getChoice;
const checkWinner = gameBoard.checkWinner;
const gameWinnerInfo = gameBoard.getWinnerInfo;
const checkInput = gameBoard.checkInput;
const gameStatus = gameBoard.getGameStatus;

/* ================================
4. DOM UPDATE FUNCTIONS
================================ */

function updateDOM() {
  for (let i = 0; i <= 8; i++) {
    divs[i].textContent = gameBoard.getBoardContent()[i];
  }
}

/* ================================
   5. EVENT HANDLERS
================================ */

function clickedBtnHandler(event) {
  if (event.target.closest(".ai-btn")) {
    gridContainer.removeEventListener("click", playersEventHandler);
    gridContainer.addEventListener("click", aiEventHandler);

    playerBtn.classList.remove("active-game");
    aiBtn.classList.add("active-game");
  } else if (event.target.closest(".player-btn")) {
    gridContainer.removeEventListener("click", aiEventHandler);
    gridContainer.addEventListener("click", playersEventHandler);

    aiBtn.classList.remove("active-game");
    playerBtn.classList.add("active-game");
  }
}

function playersEventHandler(event) {
  if (event.target.matches(".square1")) {
    switchTurnPlayers(0);
  } else if (event.target.matches(".square2")) {
    switchTurnPlayers(1);
  } else if (event.target.matches(".square3")) {
    switchTurnPlayers(2);
  } else if (event.target.matches(".square4")) {
    switchTurnPlayers(3);
  } else if (event.target.matches(".square5")) {
    switchTurnPlayers(4);
  } else if (event.target.matches(".square6")) {
    switchTurnPlayers(5);
  } else if (event.target.matches(".square7")) {
    switchTurnPlayers(6);
  } else if (event.target.matches(".square8")) {
    switchTurnPlayers(7);
  } else if (event.target.matches(".square9")) {
    switchTurnPlayers(8);
  }
}

function aiEventHandler(event) {
  if (event.target.matches(".square1")) {
    switchTurnAi(0);
  } else if (event.target.matches(".square2")) {
    switchTurnAi(1);
  } else if (event.target.matches(".square3")) {
    switchTurnAi(2);
  } else if (event.target.matches(".square4")) {
    switchTurnAi(3);
  } else if (event.target.matches(".square5")) {
    switchTurnAi(4);
  } else if (event.target.matches(".square6")) {
    switchTurnAi(5);
  } else if (event.target.matches(".square7")) {
    switchTurnAi(6);
  } else if (event.target.matches(".square8")) {
    switchTurnAi(7);
  } else if (event.target.matches(".square9")) {
    switchTurnAi(8);
  }
}

/* ================================
6. EVENT LISTENERS
================================ */

body.addEventListener("click", clickedBtnHandler);


/* ===================================
7. INITIALIZATION
=================================== */



















//Create a function that can create a new grid when called by the two game mode and restart buttons. And that gets called for the first time by one of the game mode btns
