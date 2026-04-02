<script lang="ts">
  import { TILE_SIZE } from "./constants"
  import Tile from "./Tile.svelte"
  import type { Position, Rect } from "./types"

  let {
    rect,
  }: {
    rect: Rect
  } = $props()

  let floor = $derived(rectTiles(rect))

  function rectTiles(rect: Rect): Position[] {
    const positions: Position[] = []
    for (let y = rect.y; y < rect.y + rect.h; y++) {
      for (let x = rect.x; x < rect.x + rect.w; x++) {
        positions.push({ x, y })
      }
    }
    return positions
  }
</script>

<div
  class="room"
  style:left="{rect.x * TILE_SIZE}px"
  style:top="{rect.y * TILE_SIZE}px"
  style:width="{rect.w * TILE_SIZE}px"
  style:height="{rect.h * TILE_SIZE}px"
>
  <!-- {#each floor as position}
    <Tile {position} name="igneous wall (top)" />
  {/each} -->
</div>

<style>
  .room {
    position: absolute;
    outline: 2px solid pink;
  }
</style>
