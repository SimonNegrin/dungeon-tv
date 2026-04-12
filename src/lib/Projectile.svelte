<script lang="ts">
  import type { TransitionConfig } from "svelte/transition"
  import type { IProjectile } from "./types"
  import { TILE_SIZE } from "./helpers/common"

  let {
    projectile,
  }: {
    projectile: IProjectile
  } = $props()

  let Component = $derived(projectile.bullet)

  function animation(
    node: HTMLElement,
    projectile: IProjectile,
  ): TransitionConfig {
    const distance = projectile.from.position.distanceTo(
      projectile.target.position,
    )

    const diff = projectile.target.position.sub(projectile.from.position)

    return {
      duration: distance * 150,
      tick: (t: number) => {
        const pos = projectile.from.position.add(diff.multiply(t))
        node.style.left = `${TILE_SIZE * pos.x}px`
        node.style.top = `${TILE_SIZE * pos.y}px`
      },
    }
  }
</script>

<div
  class="projectile"
  in:animation={projectile}
  style:left="{TILE_SIZE * projectile.from.position.x}px"
  style:top="{TILE_SIZE * projectile.from.position.y}px"
  onintroend={() => projectile.resolve()}
>
  <Component {projectile} />
</div>

<style>
  .projectile {
    position: absolute;
    z-index: 5;
    width: var(--tile-size);
    height: var(--tile-size);
  }
</style>
