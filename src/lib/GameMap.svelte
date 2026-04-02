<script lang="ts">
  import { TILE_SIZE } from "./constants"
  import { gameState } from "./state.svelte"
  import Tile, { type TileName } from "./Tile.svelte"
  import type { Position } from "./types"
  import Vec2 from "./Vec2"

  const floorTile = cheeslike(
    "blank floor (dark grey)",
    "blank floor (dark purple)",
  )

  let offset: Position = $state({ x: 0, y: 0 })

  function onkeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowRight":
        offset.x += 1
        break
      case "ArrowLeft":
        offset.x -= 1
        break
      case "ArrowUp":
        offset.y -= 1
        break
      case "ArrowDown":
        offset.y += 1
        break
    }
  }

  function cheeslike(a: TileName, b: TileName): (pos: Vec2) => TileName {
    const tiles: TileName[] = [a, b]
    return (pos: Vec2): TileName => {
      const index = (pos.x + pos.y) % 2
      return tiles[index]
    }
  }

  function wallTileName(pos: Vec2): TileName {
    const bottom = pos.add(new Vec2(0, 1))
    if (gameState.stage.walls.map[bottom.toString()]) {
      return "stone brick wall (top)"
    }
    if (Math.random() < 0.1) {
      return "stone brick wall (side 2)"
    }
    return "stone brick wall (side 1)"
  }
</script>

<svelte:window {onkeydown} />

<div class="game-map">
  <div
    class="map"
    style:left="{offset.x * -TILE_SIZE}px"
    style:top="{offset.y * -TILE_SIZE}px"
  >
    {#each gameState.stage.floor.tiles as position}
      <Tile {position} name={floorTile(position)} />
    {/each}

    {#each gameState.stage.walls.tiles as position}
      <Tile {position} name={wallTileName(position)} />
    {/each}
  </div>
</div>

<style>
  .game-map {
    width: 100%;
    height: 100%;
    position: relative;
    outline: 2px solid yellow;
    overflow: hidden;
  }
  .map {
    position: absolute;
    width: 0;
    height: 0;
    transition-duration: 200ms;
  }
</style>
