<script lang="ts">
  import Player from "../../src copy/lib/Player.svelte"
  import { gameState } from "./state.svelte"
</script>

{#each gameState.players as player}
  <Player {player} />
{/each}
