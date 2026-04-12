<script lang="ts">
  import Projectile from "./Projectile.svelte"
  import { gameState } from "./state.svelte"
</script>

{#each gameState.projectiles as projectile (projectile.id)}
  <Projectile {projectile} />
{/each}
