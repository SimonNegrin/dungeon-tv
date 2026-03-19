<script lang="ts">
  let {
    src,
  }: {
    src: string
  } = $props()

  let audioEl: HTMLAudioElement

  export function play(): void {
    if (!audioEl) return
    audioEl.currentTime = 0
    audioEl.play()
  }
</script>

<audio bind:this={audioEl} {src} preload="auto"></audio>
