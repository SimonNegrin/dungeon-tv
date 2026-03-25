import type { Character, GameState, Stage } from "./types"
import { loadSpritesheet } from "./common"
import Vec2 from "./Vec2"

const ladelbar: Character = {
  spritePath: "rogues/ladelbar",
  name: "Ladelbar",
  position: new Vec2(2, 2),
  initiative: 8,
  totalHealth: 6,
  health: 6,
  attack: 3,
  damage: 1,
  defence: 2,
  traits: [],
  items: [
    {
      id: "ethereal_necklace",
      name: "Colgante etéreo",
      desc: "Tiene un brillo fantasmal",
      spriteId: "crystal_necklace",
      ethereal: true,
    },
  ],
}

const krom: Character = {
  spritePath: "rogues/krom",
  name: "Krom",
  position: new Vec2(3, 2),
  initiative: 8,
  totalHealth: 8,
  health: 8,
  attack: 2,
  damage: 1,
  defence: 3,
  traits: [],
  items: [],
}

export const gameState = $state<GameState>({
  stage: null,
  playerIndex: 0,
  currentPlayer: ladelbar,
  initiativeLeft: ladelbar.initiative,
  initiativeRequired: 0,
  openInventory: null,
  cursorPosition: ladelbar.position,
  cursorPath: [],
  freezePath: false,
  players: [ladelbar, krom],
})

export async function loadStage(name: string): Promise<void> {
  const stage: Stage = await loadSpritesheet(name)
  gameState.stage = stage
  gameState.playerIndex = 0
  gameState.currentPlayer = gameState.players[gameState.playerIndex]
}
