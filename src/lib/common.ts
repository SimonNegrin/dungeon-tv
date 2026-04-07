import type {
  Actor,
  Character,
  Inventory,
  Tile,
  TileType,
  TileTypeMap,
} from "./types"
import Vec2 from "./Vec2"
import { gameState } from "./state.svelte"
import { penClickSound } from "./helpers/audio"
import VisionSystem from "./VisionSystem"

export const LAYER_WALLS = "walls"

export const STEP_TIME = 200
export const ATTACK_TIME = 200
export const TILE_SIZE = 32
export const TILE_FLOOR = 0
export const TILE_BLOCK = 1
export const VIEW_DISTANCE = 6
export const INVENTORY_SLOTS = 3

// Size of the game map in tiles
// Set a odd number to be able to keep centered
// the player sprite
export const VIEWPORT_SIZE = 13

export const INITIATIVE_DOOR = 2
export const INITIATIVE_CHEST = 2
export const INITIATIVE_ATTACK = 2
export const INITIATIVE_STEP = 1

export function createVisionSystem(): VisionSystem {
  if (!gameState.stage) {
    throw new Error("VisionSystem can't be created if there is no stage")
  }

  const visionSystem = new VisionSystem(
    gameState.stage!.mapWidth,
    gameState.stage!.mapHeight,
    VIEW_DISTANCE,
  )

  const walls = gameState.stage.layers.find((layer) => {
    return layer.name === LAYER_WALLS
  })

  if (walls) {
    walls.tiles.forEach((tile) => {
      visionSystem.addWall(tile.position)
    })
  }

  return visionSystem
}

export function getAllActors(): Actor[] {
  return [...gameState.players, ...gameState.monsters]
}

export function getActorAtPosition(pos: Vec2): Actor | undefined {
  return getAllActors().find((character) => character.position.isEqual(pos))
}

export function getTileTypeAt<K extends TileType>(
  tileType: K,
  position: Vec2,
): Tile<TileTypeMap[K]> | null

export function getTileTypeAt(tileType: TileType, position: Vec2): Tile | null {
  for (const layer of gameState.stage!.layers) {
    for (const tile of layer.tiles) {
      if (
        tile.attributes.type === tileType &&
        tile.position.isEqual(position)
      ) {
        return tile
      }
    }
  }
  return null
}

export function waitTime(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function isEthereal(character: Character): boolean {
  return [...character.traits, ...character.items].some((item) => {
    return item.metadata?.ethereal === true
  })
}

export function removeItemByName(character: Character, itemName: string): void {
  character.items = character.items.filter((item) => {
    return item.name !== itemName
  })
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

export function moveInventoryItem(
  index: number,
  from: Inventory,
  to: Inventory,
): void {
  if (to.items.length >= INVENTORY_SLOTS) {
    return
  }
  const [item] = from.items.splice(index, 1)
  to.items.push(item)
  penClickSound()
}
