import EasyStar from "easystarjs"
import type { Character, Grid, Spritesheet } from "./types"
import Vec2 from "./Vec2"
import { get } from "svelte/store"
import { players, stage } from "./state"

export const TILE_FLOOR = 0
export const TILE_BLOCK = 1

/**
 * Carga los datos del mapa de un stage desde su archivo JSON
 * @param spritesheetName - Nombre del stage a cargar (ej: "Stage_1")
 * @returns Promise con los datos del mapa del juego
 * @throws Error si no se puede cargar el archivo del mapa
 */
export async function loadSpritesheet<T>(
  spritesheetName: string,
): Promise<Spritesheet<T>> {
  const response = await fetch(`/${spritesheetName}/map.json`)

  if (!response.ok) {
    throw new Error(`No se pudo cargar el stage: ${spritesheetName}`)
  }

  const spritesheet: Spritesheet<T> = await response.json()

  spritesheet.spritesheetUrl = `/${spritesheetName}/spritesheet.png`

  spritesheet.layers.forEach((layer) => {
    layer.tiles.forEach((tile) => {
      const id = Number(tile.id)
      tile.spriteX = id % 8
      tile.spriteY = Math.floor(id / 8)
    })
  })
  return spritesheet
}

export function getCharacterPathTo(
  character: Character,
  target: Vec2,
): Promise<Vec2[] | null> {
  return new Promise((resolve) => {
    const grid = createGrid(character)
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

export function calcCharacterDistanceBetween(
  character: Character,
  a: Vec2,
  b: Vec2,
): Promise<number | null> {
  return new Promise((resolve) => {
    const grid = createGrid(character)
    if (!grid) {
      return resolve(null)
    }
    const easystar = new EasyStar.js()
    easystar.disableDiagonals()
    easystar.setGrid(grid)
    easystar.setAcceptableTiles(0)
    easystar.findPath(a.x, a.y, b.x, b.y, (path) => {
      if (!Array.isArray(path)) {
        return resolve(null)
      }
      const distance = Math.max(0, path.length - 1)
      resolve(distance)
    })
    easystar.calculate()
  })
}

export function isEthereal(character: Character): boolean {
  if (!character.items) {
    return false
  }
  return character.items.some((item) => {
    return item.ethereal === true
  })
}

// Creates a ad-hoc grid for the given character
export function createGrid(character: Character): Grid | null {
  const currentStage = get(stage)
  if (!currentStage) {
    return null
  }

  const grid: Grid = []
  for (let y = 0; y < currentStage.mapHeight; y++) {
    const line: (typeof TILE_FLOOR)[] = Array(currentStage.mapWidth).fill(
      TILE_FLOOR,
    )
    grid.push(line)
  }

  // TODO: Block all tiles occupied by characters

  // If the character is ethereal it can move to any tile
  if (isEthereal(character)) {
    return grid
  }

  // Block all tiles from the collider layers
  currentStage.layers.forEach((layer) => {
    if (!layer.collider) return
    layer.tiles.forEach((tile) => {
      if (!tile.attributes?.door) {
        grid[tile.y][tile.x] = TILE_BLOCK
      }
    })
  })

  return grid
}
