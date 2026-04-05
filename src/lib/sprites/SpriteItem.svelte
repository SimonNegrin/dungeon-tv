<script lang="ts">
  import spritesheet from "../../assets/spritesheets/items.png"
  import rogues from "../../assets/spritesheets/items.json"
  import Sprite from "./Sprite.svelte"

  export type ItemName = keyof typeof rogues

  let {
    name,
    invert,
  }: {
    name: ItemName
    invert?: boolean
  } = $props()
</script>

<Sprite pos={rogues[name]} {spritesheet} {invert} />
