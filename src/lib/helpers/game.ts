import { nextSound } from "../audio"
import MonstersController from "../controllers/MonstersController"
import { gameState } from "../state.svelte"

export async function nextPlayer(): Promise<void> {
  const index = (gameState.playerIndex + 1) % gameState.players.length

  if (index === 0) {
    const monstersController = new MonstersController()
    await monstersController.execute()
  }

  const player = gameState.players[index]
  gameState.currentPlayer = player
  gameState.centerActor = player
  gameState.playerIndex = index
  gameState.cursorPosition = player.position
  gameState.openInventory = null
  nextSound()
}
