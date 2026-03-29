<script lang="ts">
  import Sprite from "./Sprite.svelte"

  let {
    id,
    scale = 1,
  }: {
    id: string
    scale?: number
  } = $props()
</script>

<Sprite path="items/{id}" {scale} />
