<script lang="ts">
  import Stage from "./lib/Stage.svelte"
  import AspectRatio from "./lib/AspectRatio.svelte"
</script>

<main>
  <AspectRatio ratio={16 / 9}>
    <div class="game-container">
      <div class="screen-container">
        <Stage name="Stage_1" />
      </div>
      <div class="game-info"></div>
    </div>
  </AspectRatio>
</main>

<style>
  main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--main-background-color);
  }
  .game-container {
    width: 100%;
    height: 100%;
    display: flex;
    padding: 25px;
    gap: 24px;
  }
  .screen-container {
    aspect-ratio: 16/12;
    flex-shrink: 0;
  }
  .game-info {
    min-width: 0;
    flex-shrink: 1;
    flex-grow: 1;
  }
</style>
