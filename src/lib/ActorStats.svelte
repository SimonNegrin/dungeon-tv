<script lang="ts">
  import HealthBar from "./HealthBar.svelte"
  import { TURN_PLAYERS } from "./helpers/game"
  import SpriteActor from "./sprites/SpriteActor.svelte"
  import SpriteItem from "./sprites/SpriteItem.svelte"
  import { gameState } from "./state.svelte"
  import type { Actor } from "./types"

  let {
    actor,
  }: {
    actor: Actor
  } = $props()
</script>

<div
  class="character-stats"
  class:dead={!actor.isAlive}
  class:current-player={gameState.turn === TURN_PLAYERS &&
    actor.id === gameState.currentPlayer!.playerId}
>
  <div>
    <SpriteActor {actor} />
  </div>
  <div class="info">
    <div class="name">{actor.name}</div>
    <HealthBar character={actor} />

    <div class="stats">
      <div class="stat movement">
        <div class="sprite">
          <SpriteItem name="leather boots" />
        </div>
        <div class="level">{actor.currentStats.movement}</div>
      </div>
      <div class="stat actions">
        <div class="sprite">
          <SpriteItem name="leather gloves" />
        </div>
        <div class="level">{actor.currentStats.actions}</div>
      </div>
      <div class="stat attack">
        <div class="sprite">
          <SpriteItem name="short sword" />
        </div>
        <div class="level">{actor.currentStats.attack}</div>
      </div>
      <div class="stat defence">
        <div class="sprite">
          <SpriteItem name="buckler" />
        </div>
        <div class="level">{actor.currentStats.defence}</div>
      </div>
      {#if actor.currentStats.aim > 0}
        <div class="stat aim">
          <div class="sprite">
            <SpriteItem name="arrows" />
          </div>
          <div class="level">{actor.currentStats.aim}</div>
        </div>
      {/if}
      {#if actor.currentStats.magic > 0}
        <div class="stat magic">
          <div class="sprite">
            <SpriteItem name="wide-brimmed hat" />
          </div>
          <div class="level">{actor.currentStats.magic}</div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .character-stats {
    --normal-background-color: rgb(45, 48, 64);
    --normal-background-color-2: rgb(59, 62, 83);
    --normal-border-color: rgb(68, 72, 95);
    --current-player-background-color: rgb(176, 76, 51);
    --current-player-background-color-2: rgb(188, 91, 67);
    --current-player-border-color: rgb(201, 99, 74);

    --background-color: var(--normal-background-color);
    --background-color-2: var(--normal-background-color-2);
    --border-color: var(--normal-border-color);

    position: relative;
    display: flex;
    gap: 4px;
    padding: 4px;
    height: 100%;
    background-color: var(--background-color);
    border: 2px outset var(--border-color);
    transition-duration: 200ms;

    &.dead {
      filter: grayscale(1) brightness(0.5);
    }

    &.current-player {
      --background-color: var(--current-player-background-color);
      --background-color-2: var(--current-player-background-color-2);
      --border-color: var(--current-player-border-color);
    }
  }
  .info {
    flex: 1 0 0;
  }

  .name {
    color: #cdd4e0;
  }

  .stats {
    margin-top: 4px;
    display: grid;
    gap: 2px;
    grid-template-areas:
      "movement actions"
      "attack defence"
      "aim magic";
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 28px);
  }

  .stat {
    display: flex;
    align-items: center;
    background-color: var(--background-color-2);
    border: 2px inset var(--border-color);
    color: #cdd4e0;

    &.movement {
      grid-area: movement;
    }
    &.actions {
      grid-area: actions;
    }
    &.attack {
      grid-area: attack;
    }
    &.defence {
      grid-area: defence;
    }
    &.aim {
      grid-area: aim;
    }
    &.magic {
      grid-area: magic;
    }
  }

  .level {
    flex-grow: 1;
    text-align: center;
  }
</style>
