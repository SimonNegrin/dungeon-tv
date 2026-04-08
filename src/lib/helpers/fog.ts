import { createVisionSystem } from "./common"
import { gameState } from "../state.svelte"
import type { Layer, Stage } from "../types"
import Vec2 from "../Vec2"

export function clearFogAt(position: Vec2): boolean {
  if (!gameState.stage) {
    return false
  }

  const visionSystem = createVisionSystem()

  const doors: Layer | undefined = gameState.stage.layers.find((layer) => {
    return layer.name === "doors"
  })
  if (doors) {
    doors.tiles.forEach((tile) => {
      if (tile.attributes.type === "door" && !tile.attributes.isOpen) {
        visionSystem.addWall(tile.position)
      }
    })
  }

  const visibleTiles = visionSystem.getVisibleTiles(position)
  const previousFog = gameState.fog.length

  gameState.fog = gameState.fog.filter((position) => {
    return !visibleTiles.has(position.toString())
  })

  return gameState.fog.length < previousFog
}

export function createFogPositions(stage: Stage): Vec2[] {
  const positions: Vec2[] = []
  for (let y = 0; y < stage.mapWidth; y++) {
    for (let x = 0; x < stage.mapHeight; x++) {
      positions.push(new Vec2(x, y))
    }
  }
  return positions
}
