<script lang="ts">
  import { setContext } from "svelte"
  import { loadSpritesheet } from "./common"
  import Rogue from "./Rogue.svelte"
  import type { Grid, MapTileAttributes, Player, Spritesheet } from "./types"
  import Vec2 from "./Vec2"

  let {
    name,
  }: {
    name: string
  } = $props()

  let stagePromise = $derived(loadSpritesheet<MapTileAttributes>(name))
  let spritesheet = $derived(`/${name}/spritesheet.png`)
  let grid: Grid = $state([])
  let showPlayers = $state(false)
  let players = $state<Player[]>([
    {
      name: "Krom",
      position: new Vec2(1, 1),
      origin: new Vec2(1, 1),
    },
  ])

  setContext("getGrid", () => grid)

  $effect(() => {
    stagePromise.then((stage) => {
      grid = createGrid(stage)
      showPlayers = true
    })
  })

  function createGrid(stage: Spritesheet<MapTileAttributes>): Grid {
    const lines: Grid = []
    for (let y = 0; y < stage.mapHeight; y++) {
      const line: number[] = Array(stage.mapWidth).fill(0)
      lines.push(line)
    }

    stage.layers.forEach((layer) => {
      if (!layer.collider) return
      layer.tiles.forEach((tile) => {
        if (!tile.attributes?.door) {
          lines[tile.y][tile.x] = 1
        }
      })
    })

    return lines
  }
</script>

{#await stagePromise then stage}
  <div
    class="stage"
    style:--tile-size="{stage.tileSize}px"
    style:--map-width={stage.mapWidth}
    style:--map-height={stage.mapHeight}
  >
    {#each stage.layers as layer, index}
      <div
        class="layer"
        data-name={layer.name}
        style:z-index={stage.layers.length - index}
      >
        {#each layer.tiles as tile}
          <div
            class="tile"
            style:left="{tile.x * stage.tileSize}px"
            style:top="{tile.y * stage.tileSize}px"
          >
            <img
              class="spritesheet"
              src={spritesheet}
              style:left="{tile.spriteX * -stage.tileSize}px"
              style:top="{tile.spriteY * -stage.tileSize}px"
              alt=""
            />
          </div>
        {/each}
      </div>
    {/each}

    <div class="gameboard">
      {#each grid as line, y}
        {#each line as cell, x}
          <div
            class="cell"
            class:wall={cell === 1}
            style:left="{x * stage.tileSize}px"
            style:top="{y * stage.tileSize}px"
          ></div>
        {/each}
      {/each}

      {#if showPlayers}
        {#each players as _, index}
          <Rogue bind:player={players[index]} />
        {/each}
      {/if}
    </div>
  </div>
{/await}

<style>
  .stage {
    position: relative;
    transform: scale(2.2);
    background-color: rgb(40, 40, 40);
    width: calc(var(--map-width) * var(--tile-size));
    height: calc(var(--map-height) * var(--tile-size));
  }
  .layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .gameboard {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .tile {
    position: absolute;
    overflow: hidden;
    width: var(--tile-size);
    height: var(--tile-size);
  }
  .spritesheet {
    position: absolute;
    image-rendering: pixelated;
  }
  .cell {
    position: absolute;
    width: var(--tile-size);
    height: var(--tile-size);

    &.wall {
      border: 1px solid rgb(255, 131, 240);
    }
  }
</style>
