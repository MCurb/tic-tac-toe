// Get the players choice and put it in the board array
function GameBoard() {
  let board = [];
  board.length = 9;
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
  const getChoice = (playerMarker, position) => {
    if (board[position] === undefined) {
      board[position] = playerMarker;
    } else {
      console.log("Something's wrong");
      return;
    }

    console.log(board);
  };

  const checkWinner = (playerName, playerMarker) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (
        board[a] === playerMarker &&
        board[b] === playerMarker &&
        board[c] === playerMarker
      )
        console.log(`${playerName} wins`);
    }
  };

  return { getChoice, checkWinner };
}

// Create the player objects

function createPlayer(name, marker) {
  return { name, marker };
}

const user1 = prompt("Hey what's your name?", "player1");
const user2 = prompt("Hey what about yours?", "player2");
const player1 = createPlayer(user1, "X");
const player2 = createPlayer(user2, "O");

// Work with the closure
const game = GameBoard();
const choices = game.getChoice;
const checkWinners = game.checkWinner;

// Switch player turns
function switchTurn() {
  let justPlayed = false;
  for (let i = 0; i <= 8; i++) {
    if (justPlayed === false) {
      choices(
        player1.marker,
        prompt(`${player1.name} choose a position`, "0-8")
      );
      checkWinners(player1.name, player1.marker);
      justPlayed = true;
    } else if (justPlayed === true) {
      choices(
        player2.marker,
        prompt(`${player2.name} choose a position`, "0-8")
      );
      checkWinners(player2.name, player2.marker);
      justPlayed = false;
    }
  }
}

switchTurn();
