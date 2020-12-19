import { Direction, Player } from "@multi-snake/game";
import { Server, Socket } from "socket.io"
import { movePlayerDirection, startGame, stopGame } from "./game"
import express from 'express'
import packageJson from 'package.json'
import cors from 'cors'

const app = express()
const port = parseInt(process.env.PORT ?? '4000')

app.use(cors())
app.get('/', (_, res) => {
  res.send(`Running version ${packageJson.version}`)
})

app.listen(port, () => console.log(`App running on port ${port}.`))

const io = new Server(port, { cors: { origin: '*' } });

type PlayerList = {
  [key: string]: Player['id']
}

let players: PlayerList = {}

io.on("connection", (socket: Socket) => {
  console.log(`connect ${socket.id}`);

  if (Object.keys(players).length > 2) {
    return // max player limit reached
  }

  players[socket.id] = socket.id

  if (Object.keys(players).length == 2) {
    const [player1, player2] = Object.keys(players)
    // Start game
    startGame(io, [player1, player2])
  }
  socket.on('move-player', (playerId: Player['id'], direction: Direction) => {
    console.log('playerId', playerId)
    movePlayerDirection(playerId, direction)
  })

  socket.on("disconnect", () => {
    if (players[socket.id]) {
      delete players[socket.id]
    }
    stopGame()
    console.log(`player ${socket.id} disconnected`);
  });
});