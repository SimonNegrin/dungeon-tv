import { Tween, tweened } from "svelte/motion"
import {
  ATTACK_TIME,
  getCharacterPathTo,
  INITIATIVE_ATTACK,
  INITIATIVE_STEP,
  STEP_TIME,
  waitTime,
} from "./common"
import { gameState } from "./state.svelte"
import type { Monster, Player } from "./types"
import Vec2 from "./Vec2"
import { toStore } from "svelte/store"
import { attackSword, walkSound } from "./audio"
import { linear } from "svelte/easing"

interface AttackPlan {
  monster: Monster
  target: Player
  path: Vec2[]
}

export default class MonstersController {
  private monstersPool: Monster[] = []

  async execute(): Promise<void> {
    this.restoreMonstersInitiative()

    // Create a monsters pool
    // The monsters will be extracted from the pool each time
    // they are used to attack or move
    // Once the pool is empty the turn of the monsters
    // will have finished
    this.monstersPool = gameState.monsters.slice(0)

    let monsterPath: AttackPlan | undefined
    // 1. Get a monster that can see a player and can attack
    while ((monsterPath = await this.getAttackMonsterPath())) {
      await this.executeAttackPlan(monsterPath)
    }
    // Divide them in two groups
    // Those that can attack and those that not
    // Attack with monsters that can do it
    // Move the rest to get best positions
  }

  // Return a monster that can see a player
  // and is close enough to attack
  private async getAttackMonsterPath(): Promise<AttackPlan | undefined> {
    for (let i = 0; i < this.monstersPool.length; i++) {
      const monster = this.monstersPool[i]
      for (const target of gameState.players) {
        const path = await getCharacterPathTo(monster, target.position)

        if (!path) {
          continue
        }

        const initiativeNeeded = path.length + INITIATIVE_ATTACK

        if (initiativeNeeded > monster.initiativeLeft) {
          continue
        }

        // Remove the monster from the pool
        this.monstersPool.splice(i, 1)

        return { monster, target, path }
      }
    }
  }

  private async executeAttackPlan(attackPlan: AttackPlan): Promise<void> {
    const nextToPath = attackPlan.path.slice(0, -1)

    await this.moveAlongPath(attackPlan.monster, nextToPath)

    while (attackPlan.monster.initiativeLeft >= INITIATIVE_ATTACK) {
      await this.attack(attackPlan.monster, attackPlan.target)
    }
  }

  private async attack(monster: Monster, player: Player): Promise<void> {
    monster.initiativeLeft -= INITIATIVE_ATTACK

    const displacement = player.position.sub(monster.position).multiply(0.5)

    const tween = new Tween(monster.position, {
      duration: Math.floor(ATTACK_TIME / 2),
      interpolate: (a) => {
        return (t: number): Vec2 => {
          return a.add(displacement.multiply(t))
        }
      },
    })

    const store = toStore(() => tween.current)

    store.subscribe((pos) => {
      monster.position = pos
    })

    const prevPosition = monster.position.clone()

    await tween.set(monster.position.add(displacement))
    attackSword()
    await tween.set(prevPosition)
    await waitTime(200)

    // Restore the previous position
    monster.position = prevPosition
  }

  private async moveAlongPath(monster: Monster, path: Vec2[]): Promise<void> {
    for (const step of path) {
      monster.position = step
      await waitTime(STEP_TIME)
      walkSound()
      monster.initiativeLeft -= INITIATIVE_STEP
    }
  }

  private restoreMonstersInitiative(): void {
    gameState.monsters.forEach((monster) => {
      monster.initiativeLeft = monster.stats.initiative
    })
  }
}
