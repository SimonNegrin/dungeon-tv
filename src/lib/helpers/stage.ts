import EasyStar from "easystarjs"
import { TILE_FLOOR, isEthereal, TILE_BLOCK, LAYER_WALLS } from "../common"
import type { Character, Grid, Tile } from "../types"
import Vec2 from "../Vec2"
import { gameState } from "../state.svelte"
import { getAllActors } from "./common"

export function getCharacterPathTo(
  character: Character,
  target: Vec2,
): Promise<Vec2[] | null> {
  return new Promise((resolve) => {
    if (!gameState.stage) {
      return resolve(null)
    }

    const grid = createGrid(character, target)
    if (!grid) {
      return resolve(null)
    }

    const easystar = new EasyStar.js()
    easystar.disableDiagonals()
    easystar.setGrid(grid)
    easystar.setAcceptableTiles(0)
    easystar.findPath(
      character.position.x,
      character.position.y,
      target.x,
      target.y,
      (path) => {
        if (!Array.isArray(path)) {
          return resolve(null)
        }
        resolve(path.map((c) => new Vec2(c.x, c.y)))
      },
    )
    easystar.calculate()
  })
}

// Creates a ad-hoc grid for the given character
// If targetPosition is passed in this position
// will be taken into account as available (not wall or blocked)
export function createGrid(
  character: Character,
  targetPosition?: Vec2,
): Grid | null {
  if (!gameState.stage) {
    return null
  }

  const stage = gameState.stage

  // Create a grid with the dimensions of the stage with
  // all tiles available to be occupied
  const grid: Grid = []
  for (let y = 0; y < stage.mapHeight; y++) {
    const line: (typeof TILE_FLOOR)[] = Array(stage.mapWidth).fill(TILE_FLOOR)
    grid.push(line)
  }

  // If the character is ethereal it can move to any tile
  if (isEthereal(character)) {
    return grid
  }

  // Block all tiles occupied by characters
  // except if they are ethereal or they are in the target position
  getAllActors().forEach((character) => {
    // If the character is in the target position
    // it not will block the path
    if (targetPosition?.isEqual(character.position)) {
      return
    }

    // If the character is ethereal his position is able to be occupied
    if (isEthereal(character)) {
      return
    }

    // The character blocks this position
    grid[character.position.y][character.position.x] = TILE_BLOCK
  })

  // Block all tiles from the collider layers
  stage.layers.forEach((layer) => {
    if (!layer.collider) return
    layer.tiles.forEach((tile) => {
      if (isOpenDoor(tile)) {
        return
      }
      grid[tile.position.y][tile.position.x] = TILE_BLOCK
    })
  })

  return grid
}

export function isOpenDoor(tile: Tile): boolean {
  return tile.attributes.type === "door" && tile.attributes.isOpen
}

export function isInsideGameboard(position: Vec2): boolean {
  if (!gameState.stage) {
    return false
  }
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.x < gameState.stage.mapWidth &&
    position.y < gameState.stage.mapHeight
  )
}

export function isCharacterAtPositon(position: Vec2): boolean {
  // If some player is in the target position
  if (gameState.players.some((player) => player.position.isEqual(position))) {
    return true
  }

  // If some monster is in the target position
  if (gameState.monsters.some((player) => player.position.isEqual(position))) {
    return true
  }

  return false
}

export function isWallAt(position: Vec2): boolean {
  if (!gameState.stage) {
    return false
  }

  const walls = gameState.stage.layers.find((layer) => {
    return layer.name === LAYER_WALLS
  })

  if (!walls) {
    return false
  }

  return walls.tilesMap[position.toString()] !== undefined
}
