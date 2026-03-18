<script lang="ts" module>
  import { loadSpritesheet } from "./common"
  import type { Position, RogueTileAttributes, Tile } from "./types"

  const roguesSpritesheet = await loadSpritesheet<RogueTileAttributes>("Rogues")
</script>

<script lang="ts">
  let {
    name,
    position,
  }: {
    name: string
    position: Position
  } = $props()

  let tile = $derived(getRogueTile(name))

  function getRogueTile(name: string): Tile<RogueTileAttributes> {
    const layer = roguesSpritesheet.layers[0]
    const tile = layer.tiles.find((tile) => {
      return tile.attributes?.name === name
    })
    if (!tile) {
      throw new Error(`Rogue tile "${name}" not found`)
    }
    return tile
  }
</script>

<div
  class="rogue"
  style:width="{roguesSpritesheet.tileSize}px"
  style:height="{roguesSpritesheet.tileSize}px"
  style:left="{position.x * roguesSpritesheet.tileSize}px"
  style:top="{position.y * roguesSpritesheet.tileSize}px"
>
  <img
    class="sprite"
    src="/Rogues/spritesheet.png"
    style:left="{tile.spriteX * -roguesSpritesheet.tileSize}px"
    style:top="{tile.spriteY * -roguesSpritesheet.tileSize}px"
    alt=""
  />
</div>

<style>
  .rogue {
    position: absolute;
    overflow: hidden;
  }
  .sprite {
    image-rendering: pixelated;
  }
</style>
