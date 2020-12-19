import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

import { Manager } from "socket.io-client";
import { GameTile, Player, Tile } from './components/GameTile';
import { useKeyPress } from './hooks/useKeyPress';
import { SERVER_WS_URI } from './utils';

type Board = Tile[][]

export type BoardPosition = [x: number, y: number]

type Fruit = BoardPosition

interface GameStatus {
  // board: Board
  boardX: number
  boardY: number
  players: [player1: Player, player2: Player]
  fruits: Fruit[]
  winner: Player['id'] | 'draw' | null
}

export const getNewBoard = (boardX: number, boardY: number): Board =>
  new Array(boardX).fill('')
    .map((_, x) => new Array(boardY).fill('')
      .map((__, y) => ({ player: null, fruit: false, empty: true, position: [x, y] }))
    )


const printPlayers = (board: Board, players: Player[]) => {
  for (const player of players) {
    for (const s of player.snake) {
      board[s[0]][s[1]] = {
        ...board[s[0]][s[1]],
        player,
        empty: false,
        fruit: false,
      }
    }
  }
  return board
}
const printFruits = (board: Board, fruits: BoardPosition[]) => {
  for (const s of fruits) {
    board[s[0]][s[1]] = {
      ...board[s[0]][s[1]],
      player: null,
      empty: false,
      fruit: true,
    }
  }
  return board
}


const manager = new Manager(SERVER_WS_URI);
const socketConnection = manager.socket("/");

function App() {
  const [board, setBoard] = useState<Board>()
  const [youWin, setYouWin] = useState<'win' | 'lose' | 'draw' | null>(null)
  const socket = useRef(socketConnection)

  useEffect(() => {
    socket.current.io.on("connect", () => {
      console.log(`connect ${socket.current.id}`);
    });
    socket.current.io.on("error", (error: any) => {
      console.error(error)
      // socket.current.close()
      // set user disconnected and show some error
    });
  }, [])

  useEffect(() => {
    socket.current.on("game-status", (game: GameStatus) => {
      if (game.winner !== null && typeof (game.winner) === 'string') {
        setYouWin(game.winner === 'draw' ? 'draw' : (game.winner === socket.current.id ? 'win' : 'lose'))
      }
      let board = getNewBoard(game.boardX, game.boardY)
      board = printPlayers(board, game.players)
      board = printFruits(board, game.fruits)
      setBoard(board)
    });
  }, [])

  const onArrowLeft = useCallback((e: KeyboardEvent) => {
    socket.current.emit('move-player', socket.current.id, 'left')
  }, [])
  const onArrowRight = useCallback((e: KeyboardEvent) => {
    socket.current.emit('move-player', socket.current.id, 'right')
  }, [])
  const onArrowUp = useCallback((e: KeyboardEvent) => {
    socket.current.emit('move-player', socket.current.id, 'up')
  }, [])
  const onArrowDown = useCallback((e: KeyboardEvent) => {
    socket.current.emit('move-player', socket.current.id, 'down')
  }, [])

  useKeyPress('ArrowLeft', onArrowLeft)
  useKeyPress('ArrowRight', onArrowRight)
  useKeyPress('ArrowUp', onArrowUp)
  useKeyPress('ArrowDown', onArrowDown)

  return (
    <div className="App">
      <header className="App-header">
        <div>Welcome</div>
        <div>
          {youWin !== null && (
            youWin === 'draw' ? 'Draw' : (youWin === 'win' ? 'You Win' : 'You Lose')
          )}
        </div>
        <div style={{ display: 'flex' }}>
          {board && (
            board.map((x, i) =>
              <div key={i}>
                {x.map((y, j) => (
                  <GameTile tile={y} playerId={socket.current.id} key={j}>
                  </GameTile>
                ))}
              </div>
            )
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
