import { getCharacterPathTo, getTileTypeAt, waitTime } from "./common"
import { gameState } from "./state.svelte"
import type { AttsChest } from "./types"

export default class PlayerAction {
  async execute(): Promise<void> {
    if (!gameState.stage) {
      return
    }
    // Si el cursor está sobre un cofre y la posición del cofre es adjacente recta
    // al jugador actual se abre el cofre
    if (await this.interactChest()) {
      return
    }

    await this.playerMove()
  }

  private async interactChest(): Promise<boolean> {
    const chest = getTileTypeAt("chest", gameState.cursorPosition)

    if (!chest) {
      return false
    }

    if (!gameState.currentPlayer.position.isRectAdjacent(chest.position)) {
      return false
    }

    gameState.openInventory = chest.attributes as AttsChest

    return true
  }

  private async playerMove(): Promise<boolean> {
    const path = await getCharacterPathTo(
      gameState.stage!,
      gameState.currentPlayer,
      gameState.cursorPosition,
    )

    if (!path) {
      return false
    }

    for (const step of path.slice(1)) {
      gameState.currentPlayer.position = step
      await waitTime(200)
      gameState.cursorPath = gameState.cursorPath.slice(1)
    }

    return true
  }
}
