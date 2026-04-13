<script lang="ts">
  import { waitTime } from "./helpers/common"
  import type { Point } from "./types"

  interface ISize {
    width: number
    height: number
  }

  interface IAnimation {
    spritesheet: string
    size: ISize
    keyframes: Point[]
  }

  let {
    animation,
    color,
  }: {
    animation: IAnimation
    color: string
  } = $props()

  let pos = $derived(animation.keyframes[0])

  export async function play(): Promise<void> {
    for (const keyframe of animation.keyframes) {
      pos = keyframe
      await waitTime(40)
    }
  }

  function left(pos: Point): number {
    return pos.x * -animation.size.width
  }

  function top(pos: Point): number {
    return pos.y * -animation.size.height
  }
</script>

<div
  class="animation"
  style:width="{animation.size.width}px"
  style:height="{animation.size.height}px"
  style:mask-image="url({animation.spritesheet})"
  style:mask-position="{left(pos)}px {top(pos)}px"
  style:background-color={color}
></div>
