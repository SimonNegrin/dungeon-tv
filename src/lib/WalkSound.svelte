<script lang="ts">
  import Audio from "./Audio.svelte"

  let step1: Audio
  let step2: Audio
  let left = true

  export function play(): void {
    left = !left
    if (left) {
      step1.play()
    } else {
      step2.play()
    }
  }
</script>

<Audio bind:this={step1} src="/sounds/step_left.mp3" />
<Audio bind:this={step2} src="/sounds/step_right.mp3" />
