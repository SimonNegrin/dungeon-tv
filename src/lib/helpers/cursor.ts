import { gameState } from "../state.svelte"
import Vec2 from "../Vec2"
import { isInsideGameboard } from "./stage"

export function cursorAdd(vec: Vec2): void {
  const newPosition = gameState.cursorPosition.add(vec)
  if (isInsideGameboard(newPosition)) {
    gameState.cursorPosition = newPosition
  }
}

export function moveCursorUp(): void {
  cursorAdd(new Vec2(0, -1))
}

export function moveCursorDown(): void {
  cursorAdd(new Vec2(0, 1))
}

export function moveCursorLeft(): void {
  cursorAdd(new Vec2(-1, 0))
}

export function moveCursorRight(): void {
  cursorAdd(new Vec2(1, 0))
}
