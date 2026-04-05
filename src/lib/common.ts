import type { Room, Stage } from "./types"
import roomsSource from "../assets/rooms.json"
import Vec2 from "./Vec2"
import StageCreator from "./StageCreator"

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
