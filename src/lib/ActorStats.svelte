<script lang="ts">
  import HealthBar from "./HealthBar.svelte"
  import SpriteActor from "./sprites/SpriteActor.svelte"
  import type { Actor } from "./types"

  let {
    actor,
  }: {
    actor: Actor
  } = $props()
</script>

<div class="character-stats" class:dead={!actor.isAlive}>
  <div>
    <SpriteActor {actor} />
  </div>
  <div class="info">
    <div class="name">{actor.name}</div>
    <HealthBar character={actor} />
    <!-- <div class="initiative">Ini: {actor.initiativeLeft}</div>
    <div class="attack">Ata: {actor.stats.attack}</div>
    <div class="defence">Def: {actor.stats.defence}</div> -->

    <table class="stats">
      <tbody>
        <tr>
          <td>I</td>
          <td>{actor.initiativeLeft}</td>
          <td>S</td>
          <td>{actor.stats.health}</td>
        </tr>
        <tr>
          <td>A</td>
          <td>{actor.stats.attack}</td>
          <td>D</td>
          <td>{actor.stats.damage}</td>
        </tr>
        <tr>
          <td>D</td>
          <td>{actor.stats.defence}</td>
          <td>P</td>
          <td>{actor.stats.aim}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<style>
  .character-stats {
    position: relative;
    display: flex;
    gap: 4px;
    padding: 4px;
    height: 100%;
    background-color: antiquewhite;
    border: 2px solid brown;
    border-radius: 4px;

    &.dead {
      filter: grayscale(1) brightness(0.5);
    }
  }
  .info {
    flex: 1 0 0;
  }

  .stats {
    width: 100%;
    margin-top: 4px;

    td:nth-child(odd) {
      width: 6px;
      padding-left: 2px;
      border-left: 2px solid brown;
    }
  }
</style>
