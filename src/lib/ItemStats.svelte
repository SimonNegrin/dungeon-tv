<script lang="ts">
  import type { Item } from "./types"

  let {
    item,
  }: {
    item: Item
  } = $props()

  let stats = $derived(updateStats(item))

  function updateStats(item: Item): string[] {
    const stats: string[] = []
    if (typeof item.attack === "number") {
      stats.push(`${modifier(item.attack)} ataque`)
    }
    if (typeof item.defence === "number") {
      stats.push(`${modifier(item.defence)} defensa`)
    }
    if (typeof item.damage === "number") {
      stats.push(`${modifier(item.damage)} daño`)
    }
    if (typeof item.initiative === "number") {
      stats.push(`${modifier(item.initiative)} iniciativa`)
    }
    if (typeof item.range === "number") {
      stats.push(`${modifier(item.range)} alcance`)
    }
    if (item.magic) {
      stats.push("Ataque mágico")
    }
    if (item.ethereal) {
      stats.push("Inmunidad física")
    }
    if (typeof item.turns === "number") {
      stats.push(`${item.turns} turnos`)
    }
    if (typeof item.uses === "number") {
      stats.push(`${item.turns} usos`)
    }
    return stats
  }

  function modifier(n: number): string {
    if (n > 0) {
      return `+${n}`
    }
    return String(n)
  }
</script>

<ul class="item-stats">
  {#each stats as stat}
    <li class="stat">{stat}</li>
  {/each}
</ul>

<style>
  .item-stats {
    padding-left: 10px;
    margin: 5px 0;
  }
</style>
