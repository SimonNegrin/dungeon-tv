import { TILE_SIZE } from "./constants"
import type { Position, Stage } from "./types"
import Vec2 from "./Vec2"

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface StageData {
  rects: Rect[]
  doors: Position[]
}

export async function loadStage(stageName: string): Promise<Stage> {
  const response = await fetch(`/stages/${stageName}.json`)
  const data: StageData = await response.json()
  const left = getLeft(data)
  const right = getRight(data)
  const top = getTop(data)
  const bottom = getBottom(data)
  const width = right - left
  const height = bottom - top
  const offset = new Vec2(left * -1, top * -1)
  const floor = new Map<string, Vec2>()
  const walls = new Map<string, Vec2>()

  data.rects.forEach((rect) => {
    rectTiles(rect).forEach((tile) => {
      tile = tile.add(offset)
      floor.set(tile.toString(), tile)
    })
    rectTiles(rect, 1).forEach((tile) => {
      tile = tile.add(offset)
      walls.set(tile.toString(), tile)
    })
  })

  const fog = [...walls.values()]

  for (const key of floor.keys()) {
    walls.delete(key)
  }

  const stage: Stage = {
    width,
    height,
    floor: [...floor.values()],
    walls: [...walls.values()],
    doors: [],
    spawn: [],
    fog,
  }

  return stage
}
function getLeft(data: StageData): number {
  const left = Math.min(
    ...data.rects.map((rect) => {
      return rect.x
    }),
  )
  return left - 1
}
function getRight(data: StageData): number {
  const right = Math.max(
    ...data.rects.map((rect) => {
      return rect.x
    }),
  )
  return right + 1
}
function getTop(data: StageData): number {
  const top = Math.min(
    ...data.rects.map((rect) => {
      return rect.y
    }),
  )
  return top - 1
}
function getBottom(data: StageData): number {
  const bottom = Math.max(
    ...data.rects.map((rect) => {
      return rect.y
    }),
  )
  return bottom + 1
}

function rectTiles(rect: Rect, n = 0): Vec2[] {
  const positions: Vec2[] = []
  for (let y = rect.y - n; y < rect.y + rect.h + n; y++) {
    for (let x = rect.x - n; x < rect.x + rect.w + n; x++) {
      positions.push(new Vec2(x, y))
    }
  }
  return positions
}
