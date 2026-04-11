<script lang="ts">
  import ActorStats from "./ActorStats.svelte"
  import { TURN_PLAYERS } from "./helpers/game"
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
      class="stat"
      class:left={side === "left"}
      class:right={side === "right"}
      class:current-player={gameState.turn === TURN_PLAYERS &&
        gameState.currentPlayer.name === player.name}
    >
      <ActorStats actor={player} />
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
  .stat {
    height: 33%;
    filter: grayscale(1);
    transition-duration: 400ms;

    &.current-player {
      filter: grayscale(0);
    }
  }
</style>
