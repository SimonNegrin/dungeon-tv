<script lang="ts">
  import Avatar from "./Avatar.svelte"
  import { gameState } from "./state.svelte"
</script>

{#each gameState.players as player}
  <Avatar
    actor={player.actor}
    highlight={gameState.currentPlayer?.playerId === player.playerId}
  />
{/each}

{#each gameState.monsters as moster}
  <Avatar actor={moster} />
{/each}
