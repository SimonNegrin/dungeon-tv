<script lang="ts" module>
  import spritesheet from "../../assets/spritesheets/monsters.png"
  import monsters from "../../assets/spritesheets/monsters.json"

  export type MonsterSpriteName = keyof typeof monsters

  export function getMonsterSpriteNames(): MonsterSpriteName[] {
    return Object.keys(monsters) as MonsterSpriteName[]
  }
</script>

<script lang="ts">
  import Sprite from "./Sprite.svelte"

  let {
    name,
    invert,
  }: {
    name: MonsterSpriteName
    invert?: boolean
  } = $props()
</script>

<Sprite pos={monsters[name]} {spritesheet} {invert} />
