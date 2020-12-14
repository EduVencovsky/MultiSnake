import React, { useMemo } from 'react'
import styled from '@emotion/styled'

export type Direction = 'up' | 'down' | 'left' | 'right'

export type Player = {
  id: string
  direction: Direction
  snake: BoardPosition[]
}

export type BoardPosition = [x: number, y: number]

export type Tile = {
  player: Player | null
  fruit: boolean
  empty: boolean
}

interface GameTileProps {
  children?: React.ReactNode
  tile: Tile
  playerId: string
}

const fruits = ["🍓", "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒"]

const StyledGameTile = styled.div<GameTileProps>`
  width: 25px;
  height: 25px;
  border: 1px solid white;
  background-color: ${props => props.tile.player ? props.playerId === props.tile.player.id ? 'deepskyblue' : 'white' : 'rgba(0,0,0,0)'};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const GameTile = React.memo(({ children, tile, playerId }: GameTileProps) => {
  const fruit = useMemo(() => fruits[Math.floor(Math.random() * fruits.length)], [])
  
  return (
    <StyledGameTile tile={tile} playerId={playerId}>
      {tile.fruit && fruit}
      {children}
    </StyledGameTile>
  )
})
