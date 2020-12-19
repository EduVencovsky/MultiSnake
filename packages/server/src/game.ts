import { Server } from "socket.io"
import { createPlayer } from "./player"
import { getRandomInt } from "./utils"
import { Board, BoardPosition, Direction, GameSettings, GameStatus, Player } from '@multi-snake/game'
const defaultSettings = {
  gameTick: 100,
  boardX: 20,
  boardY: 20,
  defaultFruitsCount: 1
}

export class Game {
  gameSettings: GameSettings
  players: Player[]

  constructor(players: Player[], settings: GameSettings | undefined) {
    this.players = players
    this.gameSettings = settings ? { ...defaultSettings, ...settings } : defaultSettings
  }

}

const gameTick = 100
const boardX = 20
const boardY = 20
const defaultFruitsCount = 1

const printPlayer = (player: Player) => {
  for (const s of player.snake) {
    currentBoard[s[0]][s[1]] = {
      ...currentBoard[s[0]][s[1]],
      player,
      empty: false,
      fruit: false,
    }
  }
}
const printFruit = (fruits: BoardPosition[]) => {
  for (const s of fruits) {
    currentBoard[s[0]][s[1]] = {
      ...currentBoard[s[0]][s[1]],
      player: null,
      empty: false,
      fruit: true,
    }
  }
}

export const getNewBoard = (): Board =>
  new Array(boardX).fill('')
    .map((_, x) => new Array(boardY).fill('')
      .map((__, y) => ({ player: null, fruit: false, empty: true, position: [x, y] }))
    )

const getPlayerNextPosition = (player: Player): BoardPosition => {
  const currentDirection = player.direction
  const snakeHead = player.snake[player.snake.length - 1]
  let x = snakeHead[0]
  let y = snakeHead[1]
  if (currentDirection === 'left') {
    x = snakeHead[0] - 1 < 0 ? boardX - 1 : snakeHead[0] - 1
  } else if (currentDirection === 'up') {
    y = snakeHead[1] - 1 < 0 ? boardY - 1 : snakeHead[1] - 1
  } else if (currentDirection === 'right') {
    x = snakeHead[0] + 1 > boardX - 1 ? 0 : snakeHead[0] + 1
  } else if (currentDirection === 'down') {
    y = snakeHead[1] + 1 > boardY - 1 ? 0 : snakeHead[1] + 1
  }
  return [x, y]
}

const movePlayer = (player: Player, removeTail: boolean = true) => {
  if (removeTail) {
    player.snake.shift()
  }
  const nextPosition = getPlayerNextPosition(player)
  player.snake.push(nextPosition)
  return player
}

const getRandomFruits = (newFruitsCount: number) => {
  const emptyTiles = currentBoard.flat()
    .filter(tile =>
      !currentPlayers.some(player => player.snake.some(s => isSamePosition(s, tile.position))) &&
      !currentFruits.some(f => isSamePosition(f, tile.position)))

  const fruitTiles: BoardPosition[] = []
  for (let i = 0; i < newFruitsCount; i++) {
    const randomInt = getRandomInt(0, emptyTiles.length - 1)
    fruitTiles.push(emptyTiles[randomInt].position)
  }
  return fruitTiles
}

const initBoard = () => {
  currentBoard = getNewBoard()
  const [player1, player2] = currentPlayers
  currentWinner = null
  // Set players initial position  
  // TODO: set initial position without knowing the size of the board (make some math)
  player1.snake = [[0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]]
  player2.snake = [[boardX - 1, 7], [boardX - 1, 6], [boardX - 1, 5], [boardX - 1, 6], [boardX - 1, 7], [boardX - 1, 8]]
  printPlayer(player1)
  printPlayer(player2)
  currentFruits = getRandomFruits(defaultFruitsCount)
  printFruit(currentFruits)
}

const isOpositeDirection = (direction1: Direction, direction2: Direction) =>
  (direction1 === 'down' && direction2 === 'up') ||
  (direction1 === 'up' && direction2 === 'down') ||
  (direction1 === 'right' && direction2 === 'left') ||
  (direction1 === 'left' && direction2 === 'right')

const isSamePosition = (position1: BoardPosition, position2: BoardPosition) =>
  position1[0] === position2[0] && position1[1] === position2[1]

const gameLogic = () => {
  currentBoard = getNewBoard()
  const [player1, player2] = currentPlayers
  const player1NextPosition = getPlayerNextPosition(player1)
  const player2NextPosition = getPlayerNextPosition(player2)
  if (isSamePosition(player1NextPosition, player2NextPosition)) {
    // Both players will end up in the same spot
    // DRAW
    console.log('isSamePosition', player1NextPosition, player2NextPosition)
    currentWinner = 'draw'
    stopGame()
  }

  let player1Lost = player2.snake.some(x => isSamePosition(x, player1NextPosition))
  let player2Lost = player1.snake.some(x => isSamePosition(x, player2NextPosition))
  if (player2Lost && player1Lost) {
    console.log('player1Lost', player2.snake, player1NextPosition)
    console.log('player2Lost', player1.snake, player2NextPosition)
    currentWinner = 'draw'
    stopGame()
  }
  else if (player1Lost) {
    console.log('player1Lost', player2.snake, player1NextPosition)
    currentWinner = player2.id
    stopGame()
  }
  else if (player2Lost) {
    console.log('player2Lost', player1.snake, player2NextPosition)
    currentWinner = player1.id
    stopGame()
  }

  for (let player of currentPlayers) {
    let playerNextPosition = getPlayerNextPosition(player)
    let willEatFruit = false
    for (let fruit of currentFruits) {
      if (isSamePosition(playerNextPosition, fruit)) {
        willEatFruit = true
        currentFruits = currentFruits.filter(x => !isSamePosition(x, fruit))
        currentFruits.push(getRandomFruits(1)[0])
        break
      }
    }
    player = movePlayer(player, !willEatFruit)
  }
  printPlayer(player1)
  printPlayer(player2)
  printFruit(currentFruits)
}

let gameEnded = true
let currentWinner: Player['id'] | 'draw' | null = null
let currentBoard = getNewBoard()
let currentPlayers: [player1: Player, player2: Player]
let currentFruits: BoardPosition[] = []
let gameInterval: NodeJS.Timeout

export const startGame = (io: Server, players: [Player['id'], Player['id']]) => {
  currentPlayers = [createPlayer(players[0]), createPlayer(players[1])]
  gameEnded = false
  initBoard()

  gameInterval = setInterval(() => {
    gameLogic()
    const gameStatus: GameStatus = {
      // board: currentBoard,   
      boardX,
      boardY,
      fruits: currentFruits,
      players: currentPlayers,
      winner: currentWinner
    }
    
    for (const player of players) {
      io.to(player).emit('game-status', gameStatus)
    }
    if (gameEnded) {
      clearInterval(gameInterval)
    }
  }, gameTick)
}

export const movePlayerDirection = (playerId: Player['id'], direction: Direction) => {
  let player = currentPlayers.find(x => x.id === playerId)
  if (player?.snake) {
    if (!isOpositeDirection(direction, player.direction)) {
      player.direction = direction
    }
  }
}

export const stopGame = () => {
  gameEnded = true
}
