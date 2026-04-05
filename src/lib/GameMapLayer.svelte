<script lang="ts">
  import type { Layer } from "./types"
  import GameMapTile from "./GameMapTile.svelte"

  let {
    layer,
    zIndex,
  }: {
    layer: Layer
    zIndex: number
  } = $props()
</script>

<div class="layer" data-name={layer.name} style:z-index={zIndex}>
  {#each layer.tiles as tile (tile.position.toString())}
    <GameMapTile {tile} />
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
