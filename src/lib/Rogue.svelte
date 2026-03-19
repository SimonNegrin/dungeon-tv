<script lang="ts" module>
  import { loadSpritesheet } from "./common"
  import type { Grid, Player, RogueTileAttributes, Tile } from "./types"
  import EasyStar from "easystarjs"
  import Vec2 from "./Vec2"
  import { grid } from "./state"

  const roguesSpritesheet = await loadSpritesheet<RogueTileAttributes>("Rogues")
</script>

<script lang="ts">
  let {
    player = $bindable(),
  }: {
    player: Player
  } = $props()

  let tile = $derived(getRogueTile(player.name))
  let steps = $state(player.steps)

  function calcDistanceBetween(a: Vec2, b: Vec2): Promise<number> {
    return new Promise((resolve) => {
      if (!$grid) {
        return resolve(0)
      }
      const easystar = new EasyStar.js()
      easystar.disableDiagonals()
      easystar.setGrid($grid)
      easystar.setAcceptableTiles([0])
      easystar.findPath(a.x, a.y, b.x, b.y, (path) => {
        const distance = Math.max(0, path.length - 1)
        resolve(distance)
      })
      easystar.calculate()
    })
  }

  function canWalk(position: Vec2): boolean {
    return $grid?.[position.y][position.x] === 0
  }

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

  async function windowOnkeydown(event: KeyboardEvent): Promise<void> {
    event.preventDefault()

    const movements: Record<string, Vec2> = {
      ArrowRight: new Vec2(1, 0),
      ArrowLeft: new Vec2(-1, 0),
      ArrowDown: new Vec2(0, 1),
      ArrowUp: new Vec2(0, -1),
    }

    const movement = movements[event.key]
    if (!movement) return

    const position = player.position.add(movement)
    if (!canWalk(position)) return

    const distance = await calcDistanceBetween(player.origin, position)
    if (distance > player.steps) return

    steps = player.steps - distance
    player.position = position
  }
</script>

<svelte:window onkeydown={windowOnkeydown} />

<div
  class="rogue"
  style:width="{roguesSpritesheet.tileSize}px"
  style:height="{roguesSpritesheet.tileSize}px"
  style:left="{player.position.x * roguesSpritesheet.tileSize}px"
  style:top="{player.position.y * roguesSpritesheet.tileSize}px"
>
  <div class="steps">{steps}</div>
  <div class="mask">
    <img
      class="sprite"
      src="/Rogues/spritesheet.png"
      style:left="{tile.spriteX * -roguesSpritesheet.tileSize}px"
      style:top="{tile.spriteY * -roguesSpritesheet.tileSize}px"
      alt=""
    />
  </div>
</div>

<style>
  .rogue {
    position: absolute;
    transition-duration: 200ms;
  }
  .steps {
    --size: 12px;
    position: absolute;
    bottom: calc(100% - 0px);
    left: calc(50% - var(--size) / 2);
    width: var(--size);
    height: var(--size);
    font-size: calc(var(--size) * 0.75);
    line-height: var(--size);
    text-align: center;
    border-radius: 100%;
    background-color: red;
    color: white;
  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .sprite {
    position: absolute;
    image-rendering: pixelated;
  }
</style>
