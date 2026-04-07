import { gameState } from "../state.svelte"
import type { StatType, Character, Actor, GameState } from "../types"
import { monsterDeathSound } from "./audio"

export function getRandomFromArray<T>(items: T[]): T {
  const index = Math.floor(items.length * Math.random())
  return items[index]
}

export function calcStat(stat: StatType, character: Character): number {
  let value = character.stats[stat]
  ;[...character.traits, ...character.items].forEach((item) => {
    item.statModifiers?.forEach((item) => {
      if (item.stat === stat) {
        value += item.value
      }
    })
  })
  return value
}

export function createDice(faces: number): () => number {
  return () => {
    return 1 + Math.floor(faces * Math.random())
  }
}

export function killActor(actor: Actor): void {
  switch (actor.type) {
    case "monster":
      gameState.monsters = gameState.monsters.filter((m) => {
        return m !== actor
      })
      break
    case "player":
      gameState.players = gameState.players.filter((m) => {
        return m !== actor
      })
      break
  }

  monsterDeathSound()
}
