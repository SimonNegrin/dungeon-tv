<script lang="ts">
  import { loadSpritesheet } from "./common"
  import Rogue from "./Rogue.svelte"
  import type { Grid, MapTileAttributes, Player, Spritesheet } from "./types"
  import Vec2 from "./Vec2"
  import { grid } from "./state"
  import CrtScreen from "./CrtScreen.svelte"
  import AspectRatio from "./AspectRatio.svelte"

  let {
    name,
  }: {
    name: string
  } = $props()

  let stagePromise = $derived(loadSpritesheet<MapTileAttributes>(name))
  let spritesheet = $derived(`/${name}/spritesheet.png`)
  let showPlayers = $state(false)
  let stageContainerWidth = $state(0)
  let stageScale = $derived(stageContainerWidth / 512)
  let players = $state<Player[]>([
    {
      name: "Ladelbar",
      position: new Vec2(2, 2),
      origin: new Vec2(2, 2),
      steps: 8,
    },
  ])

  $effect(() => {
    stagePromise.then((stage) => {
      $grid = createGrid(stage)
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

<AspectRatio ratio={16 / 12}>
  <div class="stage-container" bind:clientWidth={stageContainerWidth}>
    {#await stagePromise then stage}
      <div
        class="stage"
        style="transform: scale({stageScale});"
        style:--tile-size="{stage.tileSize}px"
        style:--map-width={stage.mapWidth}
        style:--map-height={stage.mapHeight}
      >
        <CrtScreen>
          <div class="layers">
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
              <!-- {#each grid as line, y}
        {#each line as cell, x}
          <div
            class="cell"
            class:wall={cell === 1}
            style:left="{x * stage.tileSize}px"
            style:top="{y * stage.tileSize}px"
          ></div>
        {/each}
      {/each} -->

              {#if showPlayers}
                {#each players as _, index}
                  <Rogue bind:player={players[index]} />
                {/each}
              {/if}
            </div>
          </div>
        </CrtScreen>
      </div>
    {/await}
  </div>
</AspectRatio>

<style>
  .stage-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .stage {
    position: relative;
    overflow: hidden;
    aspect-ratio: calc(var(--map-width) / var(--map-height));
    width: calc(var(--map-width) * var(--tile-size));
    height: calc(var(--map-height) * var(--tile-size));
    transition: filter 0.3s ease;

    &:active::before {
      display: none;
    }
  }

  .layers {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
