<script lang="ts">
  import { onMount, type Snippet } from "svelte"

  let {
    ratio,
    children,
  }: {
    ratio: number
    children: Snippet
  } = $props()

  let rootEl: HTMLDivElement
  let isMount = $state(false)
  let contentWidth = $state(0)
  let contentHeight = $state(0)

  onMount(() => {
    if (isMount) return
    const resizeObserver = new ResizeObserver(onresize)
    resizeObserver.observe(rootEl)
    onresize()
    isMount = true
    return () => resizeObserver.disconnect()
  })

  function onresize(): void {
    const winddowAspectRatio = rootEl.clientWidth / rootEl.clientHeight
    if (winddowAspectRatio > ratio) {
      contentHeight = rootEl.clientHeight
      contentWidth = rootEl.clientHeight * ratio
    } else {
      contentWidth = rootEl.clientWidth
      contentHeight = rootEl.clientWidth * (1 / ratio)
    }
  }
</script>

<div class="aspect-ratio" bind:this={rootEl}>
  {#if isMount}
    <div style:width="{contentWidth}px" style:height="{contentHeight}px">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .aspect-ratio {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
