import type { StatType, Character } from "../types"

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
