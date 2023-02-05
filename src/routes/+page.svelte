<script lang="ts">
  import { el } from '@elemaudio/core'
  import { default as core } from '@elemaudio/plugin-renderer'

  import Delay from '$lib/delay/Delay.svelte'

  import type { Channels } from '$lib/index'

  let input: Channels

  core.on('load', function () {
    input = {
      left: el.in({ channel: 0 }),
      right: el.in({ channel: 1 })
    }
  })

  const render = (channels: Channels): void => {
    core.render(channels.left, channels.right)
  }

  core.initialize()
</script>

{#if input}
  <Delay {input} {render} />
{/if}
