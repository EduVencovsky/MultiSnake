import { Player } from "@multi-snake/game";

export const createPlayer: (id: Player['id']) => Player = id => ({
  id,
  direction: 'down',
  nextDirection: 'down',
  snake: [[0, 0], [0, 1], [0, 2]],
})