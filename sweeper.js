var game = {
  bombsOnBoard: 0,
  flagsAvaliable: 16,
  gridSize: 100
}



// Function to generate the sweeper board
function buildSweeperGrid() {

  var gameArea = document.getElementById('game');
  gameArea.innerHTML = "";

  console.log('---------------[ GENERATING GRID ]---------------');

  for (var i = 0; i < Math.sqrt(game.gridSize); i++) {
    var row = document.createElement('div');
    row.classList.add('row');
    row.classList.add('flex');
    console.log('ROW ' + i + ":");
    for (var j = 0; j < Math.sqrt(game.gridSize); j++) {
      var cell = document.createElement('div');
      cell.id = `cell-${j}-${i}`;
      cell.setAttribute('row', i);
      cell.setAttribute('cell', j);
      cell.classList.add('w-16');
      cell.classList.add('h-16');
      cell.classList.add('cell');
      cell.classList.add('border');
      cell.classList.add('border-black');
      cell.classList.add('m-0');
      row.appendChild(cell);

      console.log(' - Cell ' + j);
    }
    gameArea.appendChild(row);
  }
  console.log('---------------[ GENERATED GRID ]---------------');

}

// Function to plant the bombs randomly
function plantBombs() {
  console.log('---------------[ PLANTING BOMBS ]---------------');
  var cells = document.getElementsByClassName('cell');
  while (game.bombsOnBoard < game.flagsAvaliable) {
    var cell = cells[[Math.floor(Math.random()*cells.length)]];
    if (cell.getAttribute('isBomb') !== "true") {
      cell.setAttribute('isBomb', 'true');
      game.bombsOnBoard++;

      console.log('Planted Bomb at ' + cell.id);
    }
  }
  console.log('---------------[ PLANTED BOMBS ]---------------');

}


function updateFlagsIndicator() {
  document.getElementById('flags').innerText = game.flagsAvaliable;
  if (game.flagsAvaliable <= 0) {
    document.getElementById('flags').classList.add('text-red-500');
  } else {
    document.getElementById('flags').classList.remove('text-red-500');
  }
}


// Show all bombs
function showBombs() {
  var cells = document.querySelectorAll('.cell[isBomb="true"]');
  for (var i = 0; i < cells.length; i++) {
    cells[i].style.backgroundImage = 'url("./bomb.jpg")'
  }
}

// End the game
function killGame() {
  console.warn("GAME OVER!");
  showBombs();
}


// Get cells around a cell
function getSurroundingCells(cell) {

// NW N NE
// W  +  E
// SW S SE

  var cells = {};
  var missingElement = document.createElement("div");

  // West
  if (parseInt(cell.getAttribute('cell')) > 0) {
    cells.w = document.querySelector(`.cell[cell="${parseInt(cell.getAttribute('cell'))-1}"][row="${cell.getAttribute('row')}"]`);
  } else {
    cells.w = missingElement;
  }
  // East
  if (parseInt(cell.getAttribute('cell')) < Math.sqrt(game.gridSize)) {
    cells.e = document.querySelector(`.cell[cell="${parseInt(cell.getAttribute('cell'))+1}"][row="${cell.getAttribute('row')}"]`);
  } else {
    cells.e = missingElement;
  }

  // North
  if (parseInt(cell.getAttribute('row')) > 0) {
    cells.n = document.querySelector(`.cell[row="${parseInt(cell.getAttribute('row'))-1}"][cell="${cell.getAttribute('cell')}"]`);
  } else {
    cells.n = missingElement;
  }
  // South
  if (parseInt(cell.getAttribute('row')) < Math.sqrt(game.gridSize)) {
    cells.s = document.querySelector(`.cell[row="${parseInt(cell.getAttribute('row'))+1}"][cell="${cell.getAttribute('cell')}"]`);
  } else {
    cells.s = missingElement;
  }

  // North East
  if (parseInt(cell.getAttribute('row')) > 0 && parseInt(cell.getAttribute('cell')) < Math.sqrt(game.gridSize)) {
    cells.ne = document.querySelector(`.cell[row="${parseInt(cell.getAttribute('row'))-1}"][cell="${parseInt(cell.getAttribute('cell'))+1}"]`);
  } else {
    cells.ne = missingElement;
  }

  // North West
  if (parseInt(cell.getAttribute('row')) < Math.sqrt(game.gridSize) && parseInt(cell.getAttribute('cell')) < Math.sqrt(game.gridSize)) {
    cells.nw = document.querySelector(`.cell[row="${parseInt(cell.getAttribute('row'))-1}"][cell="${parseInt(cell.getAttribute('cell'))-1}"]`);
  } else {
    cells.nw = missingElement;
  }

  // South East
  if (parseInt(cell.getAttribute('row')) < Math.sqrt(game.gridSize) && parseInt(cell.getAttribute('cell')) < Math.sqrt(game.gridSize)) {
    cells.se = document.querySelector(`.cell[row="${parseInt(cell.getAttribute('row'))+1}"][cell="${parseInt(cell.getAttribute('cell'))+1}"]`);
  } else {
    cells.se = missingElement;
  }

  // South West
  if (parseInt(cell.getAttribute('row')) < Math.sqrt(game.gridSize) && parseInt(cell.getAttribute('cell')) > 0) {
    cells.sw = document.querySelector(`.cell[row="${parseInt(cell.getAttribute('row'))+1}"][cell="${parseInt(cell.getAttribute('cell'))-1}"]`);
  } else {
    cells.sw = missingElement;
  }

  return cells;
}

function isBomb(cell) {
  if (cell != null) {
    if (cell.getAttribute("isBomb") === "true") {
      return true;
    }
  }
  return false;
}


function isValidCell(cell) {
  if (cell != null) {
    if (cell.hasAttribute('cell')) {
      return true;
    }
  }
  return false;
}

function isClear(cell) {
  if (cell != null) {
    if (cell.getAttribute('isClear') === "true") {
      return true;
    }
  }
  return false;
}


function getSurroundingBombsAndCells(cell) {
  var clearCells = [];
  var bombs = [];
  var n = getSurroundingCells(cell).n;
  var s = getSurroundingCells(cell).s;
  var e = getSurroundingCells(cell).e;
  var w = getSurroundingCells(cell).w;

  var ne = getSurroundingCells(cell).ne;
  var nw = getSurroundingCells(cell).nw;
  var se = getSurroundingCells(cell).se;
  var sw = getSurroundingCells(cell).sw;



  if (isBomb(n)) {
    bombs.push(n);
  } else if (isValidCell(n)) {
    clearCells.push(n);
  }
  if (isBomb(s)) {
    bombs.push(s);
  } else if (isValidCell(s)) {
    clearCells.push(s);
  }
  if (isBomb(e)) {
    bombs.push(e);
  } else if (isValidCell(e)) {
    clearCells.push(e);
  }
  if (isBomb(w)) {
    bombs.push(w);
  } else if (isValidCell(w)) {
    clearCells.push(w);
  }

  if (isBomb(ne)) {
    bombs.push(ne);
  } else if (isValidCell(ne)) {
    clearCells.push(ne);
  }
  if (isBomb(nw)) {
    bombs.push(nw);
  } else if (isValidCell(nw)) {
    clearCells.push(nw);
  }
  if (isBomb(se)) {
    bombs.push(se);
  } else if (isValidCell(se)) {
    clearCells.push(se);
  }
  if (isBomb(sw)) {
    bombs.push(sw);
  } else if (isValidCell(sw)) {
    clearCells.push(sw);
  }

  cell.innerHTML = bombs.length;
  cell.style.backgroundColor = "#aaaaaa";

  switch (bombs.length) {
    case 1:
      cell.style.color = "blue";
      break;
    case 2:
      cell.style.color = "green";
      break;
    case 3:
      cell.style.color = "red";
      break;
    case 4:
      cell.style.color = "darkblue";
      break;
    case 5:
      cell.style.color = "darkred";
      break;
    case 6:
      cell.style.color = "steelblue";
      break;
    case 7:
      cell.style.color = "purple";
      break;
    case 7:
      cell.style.color = "gray";
      break;
    default:
      cell.style.color = "#aaaaaa";

  }


  var response = {
    bombCount: bombs.length,
    bombs: bombs,
    clearCells: clearCells,
    clearCellCount: clearCells.length
  }
  return response;
}

function triggerCell(cell) {
  if (!isClear(cell) && cell.getAttribute('flagged') !== "true") {
    cell.setAttribute('isClear', "true");
    var bombsAndCells = getSurroundingBombsAndCells(cell);
    if (bombsAndCells.bombCount === 0) {
      // No bombs beside it
      for (var i = 0; i < bombsAndCells.clearCells.length; i++) {
        triggerCell(bombsAndCells.clearCells[i]);
      }
    }
  }
}


// Add listeners
function addClickListeners() {
  var cells = document.getElementsByClassName('cell');
  for (var i = 0; i < cells.length; i++) {
    // Single click (Place flag)
    cells[i].addEventListener('click', e => {
      if (e.target.getAttribute('isClear') !== "true") {
          if (e.target.getAttribute('flagged') === "true") {
          e.target.removeAttribute('flagged');
          game.flagsAvaliable++;
        } else {
          if (game.flagsAvaliable > 0) {
            e.target.setAttribute('flagged', 'true');
            game.flagsAvaliable--;
          }
        }
        updateFlagsIndicator();
      }

    });

    // Right Click (Activate Cell)
    cells[i].addEventListener('contextmenu', event => {
      event.preventDefault();
      if (isBomb(event.target)) {
        killGame();
      } else {
        // It's not a bomb they clicked on
        if (event.target.getAttribute('flagged') !== "true") {
          triggerCell(event.target);
        }
      }
    });
  }
}




// Set up the game
function setupGame() {
  buildSweeperGrid();
  plantBombs();
  addClickListeners();
  updateFlagsIndicator();
}
setupGame();
