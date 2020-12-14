
export type Tile = {
  position: BoardPosition
  player: Player | null
  fruit: boolean
  empty: boolean
}

export type BoardPosition = [x: number, y: number]

export type Fruit = BoardPosition

export type Board = Tile[][]

export interface GameStatus {
  // board: Board
  boardX: number
  boardY: number
  players: [player1: Player, player2: Player]
  fruits: Fruit[]
  winner: Player['id'] | 'draw' | null
}

export interface GameSettings {
  gameTick: number
  boardX: number
  boardY: number
  defaultFruitsCount: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export type Player = {
  id: string
  direction: Direction
  snake: BoardPosition[]
}