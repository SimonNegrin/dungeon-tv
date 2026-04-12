<script lang="ts">
  import { gameState } from "./state.svelte"
  import type { Arrow } from "./types"

  function calcAngle(arrow: Arrow): string {
    const angle = arrow.target.position.sub(arrow.from.position).angle()
    return `${angle}rad`
  }

  function animationDuration(arrow: Arrow): number {
    const distance = arrow.from.position.distanceTo(arrow.target.position)
    return distance * 150
  }
</script>

{#each gameState.arrows as arrow (arrow)}
  <div
    class="arrow"
    style:--fx={arrow.from.position.x}
    style:--fy={arrow.from.position.y}
    style:--tx={arrow.target.position.x}
    style:--ty={arrow.target.position.y}
    style:--r={calcAngle(arrow)}
    style:--duration={animationDuration(arrow)}
    onanimationend={() => arrow.resolve()}
  ></div>
{/each}

<style>
  .arrow {
    position: absolute;
    z-index: 5;
    width: 18px;
    height: 1px;
    background-color: #fff;
    animation-name: shoot;
    animation-duration: calc(1ms * var(--duration));
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-timing-function: linear;
    transform: translateX(-50%) rotateZ(var(--r));
    left: calc(var(--tile-size) * var(--fx) + var(--tile-size) / 2);
    top: calc(var(--tile-size) * var(--fy) + var(--tile-size) / 2);
  }

  @keyframes shoot {
    0% {
      left: calc(var(--tile-size) * var(--fx) + var(--tile-size) / 2);
      top: calc(var(--tile-size) * var(--fy) + var(--tile-size) / 2);
    }
    100% {
      left: calc(var(--tile-size) * var(--tx) + var(--tile-size) / 2);
      top: calc(var(--tile-size) * var(--ty) + var(--tile-size) / 2);
    }
  }
</style>
