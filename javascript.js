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
        alert(`${playerName} wins`);
        break;
      } else if (timesPlayed === 8) {
        alert("Game is tied");
        break;
      }
    }
  };

  const getWinnerInfo = () => {
    return winner;
  };

  const checkInput = () => {
    return correctInput;
  };

  const getBoardContent = () => {
    return board;
  };

  return { getChoice, checkWinner, getWinnerInfo, checkInput, getBoardContent };
})();

// Create the player objects

function createPlayer(name, marker) {
  return { name, marker };
}
const user1 = prompt("Hey what's your name?", "player1");
const user2 = prompt("Hey what about yours?", "player2");
const player1 = createPlayer(user1, "X");
const player2 = createPlayer(user2, "O");

// Work with the closures
const choices = gameBoard.getChoice;
const checkWinner = gameBoard.checkWinner;
const gameWinnerInfo = gameBoard.getWinnerInfo;
const checkInput = gameBoard.checkInput;

// Switch player turns
// function switchTurn(positionChoice) {
//   let justPlayed = false;
//   for (let i = 0; i <= 8; i++) {
//     if (justPlayed === false && gameWinnerInfo() === false) {
//       do {
//         choices(
//           player1.marker,
//           positionChoice
//         );
//         checkWinners(player1.name, player1.marker, i);
//         justPlayed = true;
//       } while (checkInput() === false);
//     } else if (justPlayed === true && gameWinnerInfo() === false) {
//       do {
//         choices(
//           player2.marker,
//           positionChoice
//         );
//         checkWinners(player2.name, player2.marker, i);
//         justPlayed = false;
//       } while (checkInput() === false);
//     }
//   }
// };

//Write a function that gets called when a square gets selected
//It needs to take the position of the square and use it to send it to the fn that will pass the player marker with the position to the board array
//Then the fn updateDOM will get called to print the new marker

// If an occupied square gets selected alert the user, and do nothing, waiting for another choice

const switchTurn = (function () {
  let justPlayed = false;
  let timesPlayed = 0;
  return function (position) {
    if (gameBoard.checkInput() && justPlayed === false) {
      choices(player1.marker, position);
      updateDOM();
      checkWinner(player1.name, player1.marker, timesPlayed);
      justPlayed = true;
      timesPlayed++;
      console.log(timesPlayed);
    } else if (gameBoard.checkInput() && justPlayed) {
      choices(player2.marker, position);
      updateDOM();
      checkWinner(player2.name, player2.marker, timesPlayed);
      justPlayed = false;
      timesPlayed++;
      console.log(timesPlayed);
    }
  };
})();

const divs = document.querySelectorAll(".game-grid div");
function updateDOM() {
  const body = document.querySelector("body");
  for (let i = 0; i <= 8; i++) {
    divs[i].textContent = gameBoard.getBoardContent()[i];
  }
}

const gridContainer = document.querySelector(".game-grid");

gridContainer.addEventListener("click", eventHandler);

function eventHandler(event) {
  if (event.target.matches(".square1")) {
    console.log(event.target);
    switchTurn(0);
  } else if (event.target.matches(".square2")) {
    switchTurn(1);
  } else if (event.target.matches(".square3")) {
    switchTurn(2);
  } else if (event.target.matches(".square4")) {
    switchTurn(3);
  } else if (event.target.matches(".square5")) {
    switchTurn(4);
  } else if (event.target.matches(".square6")) {
    switchTurn(5);
  } else if (event.target.matches(".square7")) {
    switchTurn(6);
  } else if (event.target.matches(".square8")) {
    switchTurn(7);
  } else if (event.target.matches(".square9")) {
    switchTurn(8);
  }
}
