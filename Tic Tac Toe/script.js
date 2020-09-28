const STARTED = 0
const ENDED = 1

const playerSpan = document.getElementById('player') //Stores the player's turn
const gameTable = document.getElementById('game') //Stores the tabe of tic tac toe
const game = {
    state: STARTED,
    turn: 'X',
    move: 0
}

function endgame(winner) {
    if (winner) {
        alert('Game Over | Winner = ' + winner)
    } else {
        alert('Game Over | Draw')
    }
    game.state = ENDED

}
//Function to randomize the starting player
function restartGame() {
    if (Math.random() > 0.5) game.turn = 'O'
    else game.turn = 'X'

    game.state = STARTED
    game.move = 0
    Array.from(document.getElementsByTagName('td')).forEach(cell => { //resets all the td contents to an empty string
        cell.textContent = ''
    })
}

function nextTurn() {
    if (game.state === ENDED) return
    game.move++
        if (game.turn === 'X') game.turn = 'O' //changes the player turn
        else game.turn = 'X'
    if (game.move == 9) { //draw situation
        endgame()
    }

    playerSpan.textContent = game.turn //to display which player's turn it is

}

function isSeqCaptured(arrayOf3Cells) {
    let winningCombo = game.turn + game.turn + game.turn //If game.turn is 'X' therefore winning combo is 'XXX'
    if (arrayOf3Cells.map(i => i.textContent).join('') === winningCombo) {
        endgame(game.turn) //create the string of the td elements
    }
}


function isRowCaptured(row) { //row winning check
    let tableRow = Array.from(gameTable.children[0].children[row - 1].children)
    isSeqCaptured(tableRow)
}

function isColCaptured(col) { //col winning check
    let tableCol = [
        gameTable.children[0].children[0].children[col - 1],
        gameTable.children[0].children[1].children[col - 1],
        gameTable.children[0].children[2].children[col - 1]
    ]
    isSeqCaptured(tableCol)
}

function isDiagCaptured(row, col) { //diag winning check
    if (row !== col && (row + col) !== 4) return //checking if it is  diag or not
    let diag1 = [
        gameTable.children[0].children[0].children[0],
        gameTable.children[0].children[1].children[1],
        gameTable.children[0].children[2].children[2]
    ]
    let diag2 = [
        gameTable.children[0].children[0].children[2],
        gameTable.children[0].children[1].children[1],
        gameTable.children[0].children[2].children[0]
    ]
    isSeqCaptured(diag1)
    isSeqCaptured(diag2)
}

function boxClicked(row, col) {
    if (game.state === ENDED) {
        alert('Game Ended | Restart to play again')
        return
    }
    console.log('box clicked = ', row, col)
    let clickbox = gameTable.children[0].children[row - 1].children[col - 1]
    if (clickbox.textContent === 'X' || clickbox.textContent === 'O') {
        alert('Already filled cell.Try another cell')
        return
    }
    clickbox.textContent = game.turn
    isRowCaptured(row)
    isColCaptured(col)
    isDiagCaptured(row, col)
    nextTurn()
}