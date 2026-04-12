<script lang="ts">
  import type { IProjectile } from "./types"

  let {
    projectile,
  }: {
    projectile: IProjectile
  } = $props()

  let angle = $derived(
    projectile.target.position.sub(projectile.from.position).angle(),
  )
</script>

<div class="projectile-arrow">
  <div class="arrow" style:transform="rotate({angle}rad)"></div>
</div>

<style>
  .projectile-arrow {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .arrow {
    width: 18px;
    height: 1px;
    background-color: #fff;
  }
</style>
