var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '<img src="img/candy.png"/>'

var gBoard;
var gGamerPos;
var gEmptyCells = [];
var gBallIntervalId;
var gGlueIntervalId;
var gCollectCounter = 0;
var gBallsCounter = 0;
var gIsGlued = false;

var audio = new Audio();
audio.src = 'sounds/QKTA234-pop.mp3';

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
	gCollectCounter = 0;
	gBallIntervalId = setInterval(putRandomBalls, 2000);
	gGlueIntervalId = setInterval(addRemoveGlue, 5000);
	gIsGlued = false;
	var elCounter = document.querySelector('.counter');
	elCounter.innerText = gCollectCounter;
}


function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)
	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };
			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			if (i === 0 && j === 5 || i === 5 && j === 0 || i === 9 && j === 5 || i === 5 && j === 11) {
				cell.type = FLOOR
			}
			// Add created cell to The game board
			board[i][j] = cell;
		}
	}
	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	console.table(board);
	return board;
}


function addRemoveGlue() {
	var randObjCellIdx = Math.floor(Math.random() * (gEmptyCells.length - 1));
	var randObj = gEmptyCells[randObjCellIdx];

	gBoard[randObj.i][randObj.j].gameElement = GLUE;
	renderCell(randObj, GLUE_IMG)

	setTimeout(function () {gIsGlued = false;}, 3000);
}


function putRandomBalls() {
	for (var i = 1; i <= gBoard.length - 2; i++) {
		var currRow = gBoard[i];
		for (var j = 1; j <= currRow.length - 2; j++) {
			var currCell = currRow[j];
			if (currCell.gameElement === null) gEmptyCells.push({ i: i, j: j });
		}
	}

	var randObjCellIdx = Math.floor(Math.random() * (gEmptyCells.length - 1));
	var randObj = gEmptyCells[randObjCellIdx];

	gBoard[randObj.i][randObj.j].gameElement = BALL;
	renderCell(randObj, BALL_IMG)

	gBallsCounter++
}


// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	// console.log('strHTML is:');
	// console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	if (gIsGlued) return;

	var targetCell = gBoard[i][j];
	console.log(targetCell)
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)
		|| iAbsDiff === 9 || jAbsDiff === 11) {

		if (targetCell.gameElement === GLUE) gIsGlued = true;

		if (targetCell.gameElement === BALL) {
			audio.play()
			gCollectCounter++
			var elCounter = document.querySelector('.counter');
			elCounter.innerText = gCollectCounter;
			if (gCollectCounter === gBallsCounter) {
				openModal()
			}
			console.log('Collecting!');
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);


	}
}

function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			if (i === 5 && j === 0) {
				moveTo(i, j + 11)
			}
			else {
				moveTo(i, j - 1);
			}
			break;
		case 'ArrowRight':
			if (i === 5 && j === 11) {
				moveTo(i, j - 11)
			}
			else {
				moveTo(i, j + 1);
			}
			break;
		case 'ArrowUp':
			if (i === 0 && j === 5) {
				moveTo(i + 9, j)
			}
			else {
				moveTo(i - 1, j);
			}
			break;
		case 'ArrowDown':
			if (i === 9 && j === 5) {
				moveTo(i - 9, j)
			}
			else {
				moveTo(i + 1, j);
			}
			break;

	}

}
// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function openModal() {
	clearInterval(gBallIntervalId);
	clearInterval(gGlueIntervalId);

	var elModal = document.querySelector('.modal');
	elModal.style.display = 'block';
}
