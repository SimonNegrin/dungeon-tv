<script lang="ts">
  import { TILE_SIZE } from "../helpers/common"

  let {
    spritesheet,
    pos,
    invert = false,
  }: {
    spritesheet: string
    pos: number[]
    invert?: boolean
  } = $props()
</script>

<div class="sprite" class:invert>
  <img
    style:left="{pos[0] * -TILE_SIZE}px"
    style:top="{pos[1] * -TILE_SIZE}px"
    src={spritesheet}
    alt=""
  />
</div>

<style>
  .sprite {
    position: relative;
    width: var(--tile-size);
    height: var(--tile-size);
    overflow: hidden;

    &.invert {
      transform: scaleX(-1);
    }
  }
  img {
    position: absolute;
    image-rendering: pixelated;
  }
</style>
