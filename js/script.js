const $switchBot = document.querySelector('.switch-bot')
const $switchPlayer2 = document.querySelector('.switch-player-2')
const $botName = document.querySelector('.bot-name')
// const $battlefield = document.querySelectorAll('.field')

const $rows = document.querySelectorAll('.battlefield .row')
const $historyMoveArray = document.querySelectorAll('.history-move')

const P1_CODE = 1
const P2_CODE = -1
const EMPTY_CODE = 0

const DRAW_GAME = 'D'

const gameTable = createTable()

const moveHistory = []

let currentPlayer = P1_CODE
let lastStartPlayer = P1_CODE

for (let i = 0; i < $rows.length; i++) {
	const $row = $rows[i]
	const $fields = $row.querySelectorAll('.field')

	for (let j = 0; j < $fields.length; j++) {
		const $field = $fields[j];

		$field.addEventListener('click', function () {
			play(i, j)
		})
	}
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
		printMoveHistory()
		printTable(gameTable)

		if (winner) {
			// Alguém ganhou ou empate
		} else {
			// Ninguém ganhou ainda. Ou seja, jogo continua
			// Guarda o movimento no histórico de jogadas
			

			console.log(`Player ${currentPlayer}`)
			console.log(moveHistory)

			if (currentPlayer == P1_CODE) {
				currentPlayer = P2_CODE
			} else {
				currentPlayer = P1_CODE
			}

		}
	} else {
		// aviso de que o campo está cheio
	}
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

function printMoveHistory() {
	$historyMoveArray.forEach(function ($historyMove, i) {
		const $lable = $historyMove.querySelector('.piece-last-move span')
		const $player = $historyMove.querySelector('.player-name-last-move span')
		const $position = $historyMove.querySelector('.position-last-mome span')

		const move = moveHistory[i]

		if (move) {
			if (move.player == P1_CODE) {
				$lable.textContent = 'X'
				$player.textContent = 'Jogador 1'
			} else {
				$lable.textContent = 'O'
				$player.textContent = 'Jogador 2'
			}

			$position.textContent = getPositionText(move.position)
		}
	})
}

function  getPositionText(position) {
	const indice = position.i*3 + position.j

	const texts = ['Primeiro', 'Segundo', 'Terceiro', 'Quarto', 'Quinto', 'Sexto', 'Sétimo', 'Oitavo', 'Novo']

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
			return gameTable[i][0]
		}
	}

	return false
}

function verifyColumnWinner() {
	for (let j = 0; j < 3; j++) {
		const sum = gameTable[0][j] + gameTable[1][j] + gameTable[2][j]

		if (Math.abs(sum) == 3) {
			return gameTable[0][j]
		}
	}

	return false
}

function verifyDiagonalWinner() {
	const sum1 = gameTable[0][0] + gameTable[1][1] + gameTable[2][2]
	const sum2 = gameTable[0][2] + gameTable[1][1] + gameTable[2][0]

	if (Math.abs(sum1) == 3 || Math.abs(sum2) == 3) {
		return gameTable[1][1]
	}

	return false
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

