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
  <div class="grid grid-flow-row auto-rows-max gap-5 px-10 py-5 justify-center">
    <div class="grid justify-start pl-4">
      <h2 class="text-2xl font-mono">Ditto</h2>
    </div>
    <Delay {input} {render} />
  </div>
{/if}
