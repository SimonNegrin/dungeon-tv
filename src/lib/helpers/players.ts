import {
  tiredSound,
  doorUnlockSound,
  doorLockedSound,
  walkSound,
} from "../audio"
import {
  INITIATIVE_CHEST,
  getTileTypeAt,
  INITIATIVE_STEP,
  INITIATIVE_DOOR,
  removeItemByName,
  waitTime,
  STEP_TIME,
} from "../common"
import { gameState } from "../state.svelte"
import type { Player } from "../types"
import { clearFogAt } from "./fog"
import { getCharacterPathTo, isCharacterAtPositon } from "./stage"

export async function currentPlayerAction(): Promise<void> {
  if (await interactPlayer()) {
    return
  }

  if (await interactChest()) {
    return
  }

  if (await interactDoor()) {
    return
  }

  await playerMove()
}

async function interactPlayer(): Promise<boolean> {
  const player = gameState.players.find((player) => {
    return player.position.isEqual(gameState.cursorPosition)
  })

  if (!player) {
    return false
  }

  if (!gameState.currentPlayer.position.isRectAdjacent(player.position)) {
    return false
  }

  // Check if the player has the initiative needed
  // to interact with a chest
  if (gameState.currentPlayer.initiativeLeft < INITIATIVE_CHEST) {
    tiredSound()
    return true
  }

  gameState.currentPlayer.initiativeLeft -= INITIATIVE_CHEST
  gameState.openInventory = player

  return true
}

async function interactChest(): Promise<boolean> {
  const chest = getTileTypeAt("chest", gameState.cursorPosition)

  if (!chest) {
    return false
  }

  if (!gameState.currentPlayer.position.isRectAdjacent(chest.position)) {
    return false
  }

  // Check if the player has the initiative needed
  // to interact with a chest
  if (gameState.currentPlayer.initiativeLeft < INITIATIVE_CHEST) {
    tiredSound()
    return true
  }

  gameState.currentPlayer.initiativeLeft -= INITIATIVE_CHEST
  gameState.openInventory = chest.attributes

  return true
}

async function interactDoor(): Promise<boolean> {
  const currentPlayer = gameState.currentPlayer

  const door = getTileTypeAt("door", gameState.cursorPosition)

  if (!door) {
    return false
  }

  // If door is open no interation is needed
  if (door.attributes.isOpen) {
    return false
  }

  // To interact is needed to be rect adjacent
  if (!currentPlayer.position.isRectAdjacent(door.position)) {
    return false
  }

  // If the door does not need key we open the door inmediatly
  if (!door.attributes.keyName) {
    if (spendInitiative(currentPlayer, INITIATIVE_STEP)) {
      door.attributes.isOpen = true
      doorUnlockSound()
    } else {
      tiredSound()
    }
    return true
  }

  // To open the door the player needs the key
  const { keyName } = door.attributes
  if (currentPlayer.items.some((item) => item.name === keyName)) {
    if (spendInitiative(currentPlayer, INITIATIVE_DOOR)) {
      // Open the door with key
      door.attributes.isOpen = true
      // Remove key from player inventory
      removeItemByName(currentPlayer, keyName)
      gameState.currentPlayer.initiativeLeft -= INITIATIVE_DOOR
      doorUnlockSound()
    } else {
      tiredSound()
    }
    return true
  }

  // The player can't open the door but we return true
  // to indicate the interaction try
  doorLockedSound()
  return true
}

function spendInitiative(player: Player, initiative: number): boolean {
  if (player.initiativeLeft < initiative) {
    return false
  }
  player.initiativeLeft -= initiative
  return true
}

async function playerMove(): Promise<boolean> {
  if (!gameState.stage) {
    return false
  }

  if (isCharacterAtPositon(gameState.cursorPosition)) {
    return false
  }

  const path = await getCharacterPathTo(
    gameState.currentPlayer,
    gameState.cursorPosition,
  )

  if (!path) {
    return false
  }

  for (const step of path.slice(1)) {
    // Check if the player has the initiative needed to walk
    if (gameState.currentPlayer.initiativeLeft < INITIATIVE_STEP) {
      tiredSound()
      break
    }
    gameState.currentPlayer.position = step
    clearFogAt(step)
    walkSound()
    await waitTime(STEP_TIME)
    gameState.cursorPath = gameState.cursorPath.slice(1)
    gameState.currentPlayer.initiativeLeft -= INITIATIVE_STEP
  }

  return true
}
