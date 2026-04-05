<script lang="ts">
  import spritesheet from "../../assets/spritesheets/rogues.png"
  import rogues from "../../assets/spritesheets/rogues.json"
  import Sprite from "./Sprite.svelte"

  export type RogueName = keyof typeof rogues

  let {
    name,
    invert,
  }: {
    name: RogueName
    invert?: boolean
  } = $props()
</script>

<Sprite pos={rogues[name]} {spritesheet} {invert} />
