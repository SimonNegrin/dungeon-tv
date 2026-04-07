import { attackSword } from "../audio"
import Dice from "../Dice"
import type { Character } from "../types"
import { calcStat } from "./common"

const dice = new Dice(6)

export function physicAttack(from: Character, target: Character): boolean {
  const attack = calcStat("attack", from)
  const defence = calcStat("defence", from)

  const attackRoll = dice.roll()
  const defenceRoll = dice.roll()

  const attackTotal = attack + attackRoll
  const defenceTotal = defence + defenceRoll

  if (defenceTotal >= attackTotal) {
    return false
  }

  damage(from, target)
  attackSword()

  return true
}

function damage(from: Character, target: Character): void {
  const damage = calcStat("damage", from)
  target.stats.health -= damage
}
