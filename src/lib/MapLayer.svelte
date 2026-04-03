<script lang="ts">
  import type { Layer } from "../../src/lib/types"
  import Tile from "./Tile.svelte"

  let {
    layer,
    zIndex,
  }: {
    layer: Layer
    zIndex: number
  } = $props()
</script>

<div class="layer" style:z-index={zIndex}>
  {#each layer.tiles as tile (tile.position.toString())}
    <Tile position={tile.position} name={tile.name} />
  {/each}
</div>

<style>
  .layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
