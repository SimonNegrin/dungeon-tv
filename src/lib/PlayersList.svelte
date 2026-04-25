<script lang="ts">
  import ActorStats from "./ActorStats.svelte"
  import { gameState } from "./state.svelte"

  let {
    side,
  }: {
    side: "left" | "right"
  } = $props()

  let players = $derived(
    gameState.players.slice(...(side === "left" ? [0, 3] : [3])),
  )
</script>

<div class="players-list">
  {#each players as player}
    <div
      class="player"
      class:left={side === "left"}
      class:right={side === "right"}
    >
      <ActorStats actor={player.actor} />
    </div>
  {/each}
</div>

<style>
  .players-list {
    position: relative;
    z-index: 110;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 4px;
    height: 100%;
  }
  .player {
    height: 33%;
    transition-duration: 400ms;
  }
</style>
