const $switchBot = document.querySelector('.switch-bot')
const $switchPlayer2 = document.querySelector('.switch-player-2')
const $botName = document.querySelector('.bot-name')

const $battlefield = document.querySelector('.battlefield')
const $fields = $battlefield.querySelectorAll('.row .field')

const $rows = document.querySelectorAll('.battlefield .row')
const $containerHistoryMove = document.querySelector('.container-history-move')

const $alertsGame = document.querySelector('.scoreboard p')
const $namePlayer1 = document.querySelector('.player-1-name input')
const $namePlayer2 = document.querySelector('.player-2-name input')
const $winnerName = document.querySelector('.scoreboard .nameWinner span')

const $pointsPlayer1 = document.querySelector('.player-1-points span')
const $pointsPlayer2 = document.querySelector('.player-2-points span')

const $buttonStartGame = document.querySelector('.button-start-game')
const $buttonRestartGame = document.querySelector('.restart-button')

const DRAW_GAME = 'D'
const TIME_OFF_RESET_FIELDS = 1500
const TIME_OFF_RESET_HISTORY_MOVE = 1500
const TIME_OFF_RESET_ALERTS = 1600
const TIME_STOP_GAME = 1500
const TIME_FULL_FIELD = 1000

let P1_CODE = 1
let P2_CODE = -1
let EMPTY_CODE = 0

let pointsPlayer1 = 0
let pointsPlayer2 = 0

let gameTable = createTable()

let moveHistory = []

let currentPlayer = P1_CODE
let lastStartPlayer = P1_CODE

let permissionPlay = false

for (let i = 0; i < $rows.length; i++) {
    const $row = $rows[i]
    const $fields = $row.querySelectorAll('.field')

    for (let j = 0; j < $fields.length; j++) {
        const $field = $fields[j];

        $field.addEventListener('click', function () {

            if (permissionPlay) {
                play(i, j)
            } else {
                alertNoPermissionPlay('Para iniciar, clique em Jogar')
            }
        })
    }
}

$buttonStartGame.addEventListener('click', function (event) {
    // event.preventDefault()

    permissionPlay = true
})

// $buttonRestartGame.addEventListener('click', function(){

// })


function alertNoPermissionPlay(text) {
    $alertsGame.textContent = text

    setTimeout(() => {
        $alertsGame.textContent = 'Placar'
    }, TIME_OFF_RESET_ALERTS);
}

function stopGameForAMoment() {
    permissionPlay = false

    setTimeout(() => {
        permissionPlay = true
    }, TIME_STOP_GAME);
}

function createTable() {
    return [
        [EMPTY_CODE, EMPTY_CODE, EMPTY_CODE],
        [EMPTY_CODE, EMPTY_CODE, EMPTY_CODE],
        [EMPTY_CODE, EMPTY_CODE, EMPTY_CODE]
    ]
}

function play(i, j) {
    if (gameTable[i][j] == EMPTY_CODE) {
        gameTable[i][j] = currentPlayer

        const winner = verifyWinner()

        const move = {
            player: currentPlayer,
            position: {
                i: i,
                j: j
            },
            table: copyTable(gameTable)
        }

        moveHistory.push(move)
        printMoveHistory(move.player, move.position)
        printTable(gameTable)

        if (winner) {
            // Alguém ganhou ou empatou
            if (winner == DRAW_GAME) {
                $winnerName.textContent = 'Empatou'

                givePoint(winner)
                printPoints()
                clearBattlerfield()
                clearFieldWinnerName()
                clearFieldHistoryMove()

                nextPlayerStart()
                resetVariables()
                stopGameForAMoment()

            } else {
                // Alguém ganhou

                // Marcar na tela o ganhador:
                // Deixar vermelho as peças do vencedor na posição que ganhou
                // Imprimir o nome do vencedor
                // Acrescentar 1 ponto para o vencedor
                // Imprimir o cenário da partida toda no campo direito

                givePoint(winner)
                printPoints()
                printWinnerName(winner)
                clearBattlerfield()
                clearFieldWinnerName()
                clearFieldHistoryMove()

                nextPlayerStart()

                resetVariables()

                stopGameForAMoment()
            }
        } else {
            // Ninguém ganhou ainda. Ou seja, jogo continua
            // Troca o current player
            if (currentPlayer == P1_CODE) {
                currentPlayer = P2_CODE
            } else {
                currentPlayer = P1_CODE
            }
        }
    } else {
        // aviso de que o campo está cheio
        warningFullField(i, j)
        alertNoPermissionPlay('O campo está cheio')
    }
}

function warningFullField(i, j) {
    const $fields = $rows[i].querySelectorAll('.row .field')

    $fields[j].classList.add('color-full-field')

    setTimeout(() => {
        $fields[j].classList.remove('color-full-field')
    }, TIME_FULL_FIELD);
}

function nextPlayerStart() {
    if (lastStartPlayer == P1_CODE) {
        currentPlayer = P2_CODE
        lastStartPlayer = P2_CODE
    } else if (lastStartPlayer == P2_CODE) {
        currentPlayer = P1_CODE
        lastStartPlayer = P1_CODE
    }
}

function resetVariables() {
    P1_CODE = 1
    P2_CODE = -1
    EMPTY_CODE = 0
    moveHistory = []
    gameTable = createTable()
}

function clearFieldHistoryMove() {

    const $historiesMoveRemove = document.querySelectorAll('.history-move')

    setTimeout(() => {
        $historiesMoveRemove.forEach(function ($historyMoveRemove) {
            $containerHistoryMove.removeChild($historyMoveRemove)
        });
    }, TIME_OFF_RESET_HISTORY_MOVE);
}

function clearBattlerfield() {
    setTimeout(() => {

        for (const $field of $fields) {
            $field.textContent = ''
        }
    }, TIME_OFF_RESET_FIELDS);
}

function clearFieldWinnerName() {
    setTimeout(() => {
        $winnerName.textContent = 'Jogue'
    }, TIME_OFF_RESET_FIELDS);
}

function givePoint(winner) {
    if (winner == P1_CODE) pointsPlayer1++
    if (winner == P2_CODE) pointsPlayer2++
}

function printWinnerName(winner) {
    $winnerName.textContent = getPlayerName(winner) + ' Ganhou'
}

function printPoints() {
    $pointsPlayer1.textContent = pointsPlayer1
    $pointsPlayer2.textContent = pointsPlayer2
}

function printTable(table) {

    $rows.forEach(function ($row, i) {
        const $fields = $row.querySelectorAll('.field')

        $fields.forEach(function ($field, j) {

            if (table[i][j] == P1_CODE) {
                $field.textContent = 'X'
            } else if (table[i][j] == P2_CODE) {
                $field.textContent = 'O'
            } else {
                $field.textContent = ''
            }
        })
    })
}

function printMoveHistory(currentPlayer, position) {

    const divHistoryMoveCreate = document.createElement('div')
    divHistoryMoveCreate.classList.add('history-move')
    $containerHistoryMove.appendChild(divHistoryMoveCreate)

    const divPieceLastMoveCreate = document.createElement('div')
    divPieceLastMoveCreate.classList.add('piece-last-move')
    divHistoryMoveCreate.appendChild(divPieceLastMoveCreate)

    const spanPieceLastMoveCreate = document.createElement('span')
    divPieceLastMoveCreate.appendChild(spanPieceLastMoveCreate)

    const divCreate = document.createElement('div')
    divHistoryMoveCreate.appendChild(divCreate)

    const divPlayerNameLastMoveCreate = document.createElement('div')
    divPlayerNameLastMoveCreate.classList.add('player-name-last-move')
    divCreate.appendChild(divPlayerNameLastMoveCreate)

    const spanPlayerNameLastMoveCreate = document.createElement('span')
    divPlayerNameLastMoveCreate.appendChild(spanPlayerNameLastMoveCreate)

    const divPositionLastMoveCreate = document.createElement('div')
    divPositionLastMoveCreate.classList.add('position-last-mome')
    divCreate.appendChild(divPositionLastMoveCreate)

    const spanPositionLastMoveCreate = document.createElement('span')
    divPositionLastMoveCreate.appendChild(spanPositionLastMoveCreate)

    const textPlayerNameLastMove = document.createTextNode(getPlayerName(currentPlayer))
    const textPositionLastMove = document.createTextNode(getPositionText(position))
    let textPieceLastMove = document.createTextNode('')

    if (currentPlayer == P1_CODE) {
        textPieceLastMove = document.createTextNode('X')
    } else {
        textPieceLastMove = document.createTextNode('O')
    }

    spanPlayerNameLastMoveCreate.appendChild(textPlayerNameLastMove)
    spanPieceLastMoveCreate.appendChild(textPieceLastMove)
    spanPositionLastMoveCreate.appendChild(textPositionLastMove)

}

function getPlayerName(currentPlayer) {
    const player1Name = $namePlayer1.value
    const player2Name = $namePlayer2.value

    if (currentPlayer == P1_CODE && player1Name == '') {
        return 'Jogador 1'
    } else if (currentPlayer == P2_CODE && player2Name == '') {
        return 'Jogador 2'
    } else if (currentPlayer == P1_CODE) {
        return player1Name
    } else if (currentPlayer == P2_CODE) {
        return player2Name
    } else return 'Empatou'
}

function getPositionText(position) {
    const texts = ['Primeiro', 'Segundo', 'Terceiro', 'Quarto', 'Quinto', 'Sexto', 'Sétimo', 'Oitavo', 'Nono']

    const indice = position.i * 3 + position.j

    return texts[indice] + ' quadrado'
}

function copyTable(table) {
    const tableCopy = []

    for (let i = 0; i < 3; i++) {
        tableCopy[i] = []
        for (let j = 0; j < 3; j++) {
            tableCopy[i][j] = table[i][j]
        }
    }
    return tableCopy
}

function verifyWinner() {
    const rowWinner = verifyRowWinner()
    if (rowWinner) return rowWinner

    const columnWinner = verifyColumnWinner()
    if (columnWinner) return columnWinner

    const diagonalWinner = verifyDiagonalWinner()
    if (diagonalWinner) return diagonalWinner

    if (verifyDrawGame()) {
        return DRAW_GAME
    }
    return false
}

function verifyRowWinner() {
    for (let i = 0; i < 3; i++) {
        const sum = gameTable[i][0] + gameTable[i][1] + gameTable[i][2]

        if (Math.abs(sum) == 3) {
            colorPiecesWinner('row', i)
            return gameTable[i][0]
        }
    }
    return false
}

function verifyColumnWinner() {
    for (let j = 0; j < 3; j++) {
        const sum = gameTable[0][j] + gameTable[1][j] + gameTable[2][j]

        if (Math.abs(sum) == 3) {
            colorPiecesWinner('column', j)
            return gameTable[0][j]
        }
    }
    return false
}

function verifyDiagonalWinner() {
    const sum1 = gameTable[0][0] + gameTable[1][1] + gameTable[2][2]
    const sum2 = gameTable[0][2] + gameTable[1][1] + gameTable[2][0]

    if (Math.abs(sum1) == 3) {
        colorPiecesWinner('diagonal1')
        return gameTable[1][1]
    }

    if (Math.abs(sum2) == 3) {
        colorPiecesWinner('diagonal2')
        return gameTable[1][1]
    }
    return false
}

function colorPiecesWinner(type, index) {

    if (type == 'row') {
        for (let i = 0; i < 3; i++) {
            const $field = $fields[index * 3 + i]

            $field.classList.add('color-winner')

            setTimeout(() => {
                $field.classList.remove('color-winner')
            }, TIME_OFF_RESET_FIELDS)
        }

    } else if (type == 'column') {
        for (let i = 0; i < 3; i++) {
            const $field = $fields[i * 3 + index]

            $field.classList.add('color-winner')

            setTimeout(() => {
                $field.classList.remove('color-winner')
            }, TIME_OFF_RESET_FIELDS)
        }

    } else if (type == 'diagonal1') {
        for (let i = 0; i < 3; i++) {
            const $field = $fields[i * 3 + i]

            $field.classList.add('color-winner')

            setTimeout(() => {
                $field.classList.remove('color-winner')
            }, TIME_OFF_RESET_FIELDS)
        }

    } else if (type == 'diagonal2') {
        for (let i = 0; i < 3; i++) {
            const $field = $fields[i * 3 + (2 - i)]

            $field.classList.add('color-winner')

            setTimeout(() => {
                $field.classList.remove('color-winner')
            }, TIME_OFF_RESET_FIELDS)
        }
    }
}

function verifyDrawGame() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameTable[i][j] == EMPTY_CODE) {
                return false
            }
        }
    }
    return true
}

// $switchBot.addEventListener('click', function(){
//     $switchPlayer2.classList.toggle('active-bot')
//     $botName.classList.toggle('active-bot')
// })
