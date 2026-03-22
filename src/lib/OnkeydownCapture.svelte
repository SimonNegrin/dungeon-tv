<script lang="ts">
  let {
    key,
    handler,
    preventDefault = false,
  }: {
    key: string
    handler: (event: KeyboardEvent) => void
    preventDefault?: boolean
  } = $props()

  let keys = $derived(key.split(","))

  function onkeydowncapture(event: KeyboardEvent): void {
    if (preventDefault) {
      event.preventDefault()
    }
    if (keys.includes(event.key)) {
      handler(event)
    }
  }
</script>

<svelte:window {onkeydowncapture} />
