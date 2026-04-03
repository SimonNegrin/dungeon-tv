import type { Layer, MapTile, Point, Room, Stage } from "./types"
import roomsSource from "../assets/rooms.json"
import Vec2 from "./Vec2"
import type { TileName } from "./Tile.svelte"

export function createStage(): Stage {
  const stageCreator = new StageCreator(createRooms(roomsSource))
  return stageCreator.create()
}

function createRooms(source: typeof roomsSource): Room[] {
  const toVec2 = (p: { x: number; y: number }) => new Vec2(p.x, p.y)
  return source.map((data) => {
    return {
      doors: data.doors.map(toVec2),
      walls: data.walls.map(toVec2),
      floor: data.floor.map(toVec2),
      spawn: data.spawn ? toVec2(data.spawn) : undefined,
    }
  })
}

class StageCreator {
  private stage = this.createStage()
  private selectedRooms: Room[] = []

  constructor(private rooms: Room[]) {}

  create(): Stage {
    this.addSpawn()
    this.setSize()
    this.selectedRoomsToStage()
    return this.stage
  }

  private addSpawn(): void {
    const room = this.rooms.find((room) => {
      return room.spawn !== undefined
    })
    if (!room) {
      throw new Error(`Spawn room not found`)
    }

    const left = Math.min(...room.walls.map((p) => p.x))
    const top = Math.min(...room.walls.map((p) => p.y))

    this.moveRoom(room, new Vec2(left * -1, top * -1))
    this.selectedRooms.push(room)
    this.stage.spawn = new Vec2(room.spawn!.x, room.spawn!.y)
  }

  private moveRoom(room: Room, by: Vec2): void {
    room.doors = room.doors.map((v) => v.add(by))
    room.walls = room.walls.map((v) => v.add(by))
    room.floor = room.floor.map((v) => v.add(by))
    if (room.spawn) {
      room.spawn = room.spawn.add(by)
    }
  }

  private setSize(): void {
    let left = Infinity
    let right = -Infinity
    let top = Infinity
    let bottom = -Infinity
    this.selectedRooms.forEach((room) => {
      left = Math.min(left, ...room.walls.map((p) => p.x))
      right = Math.max(right, ...room.walls.map((p) => p.x))
      top = Math.min(top, ...room.walls.map((p) => p.y))
      bottom = Math.max(bottom, ...room.walls.map((p) => p.y))
    })
    this.stage.width = right - left + 1
    this.stage.height = bottom - top + 1
  }

  private selectedRoomsToStage(): void {
    this.selectedRooms.forEach((room) => {
      this.addToLayer(
        room.floor,
        this.stage.layers.floor,
        "blank floor (dark grey)",
      )
      this.addToLayer(
        room.walls,
        this.stage.layers.walls,
        "stone brick wall (top)",
      )
      this.addToLayer(room.doors, this.stage.layers.doors, "door 1")

      if (room.spawn) {
        this.addToLayer([room.spawn], this.stage.layers.spawn, "staircase up")
      }
    })
  }

  private addToLayer(points: Point[], layer: Layer, tileName: TileName): void {
    points.forEach((point) => {
      const tile: MapTile = {
        name: tileName,
        position: new Vec2(point.x, point.y),
      }
      layer.tiles.push(tile)
    })
  }

  private createStage(): Stage {
    const floor = this.createEmptyLayer(false)
    const walls = this.createEmptyLayer(true)
    const doors = this.createEmptyLayer(true)
    const spawn = this.createEmptyLayer(true)

    return {
      width: 0,
      height: 0,
      spawn: new Vec2(0, 0),
      layers: {
        floor,
        walls,
        doors,
        spawn,
      },
      fog: [],
    }
  }

  private createEmptyLayer(collider: boolean): Layer {
    return {
      tiles: [],
      tilesMap: {},
      collider,
    }
  }
}
