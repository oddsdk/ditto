<script lang="ts">
  import { el } from '@elemaudio/core'
  import { default as core } from '@elemaudio/plugin-renderer'

  import { initialize } from '$lib/init'
  import type { Channels } from '$lib/audio/index'
  import Effect from '$components/views/Effect.svelte'
  import CloseIcon from '$components/icons/Close.svelte'
  import Connect from '$components/views/Connect.svelte'
  import ConnectIcon from '$components/icons/Connect.svelte'
  import Presets from '$components/views/Presets.svelte'
  import PresetsIcon from '$components/icons/Presets.svelte'

  type View = 'connect' | 'effect' | 'presets'

  let input: Channels
  let view: View = 'effect'

  // Initialize Elementary Audio
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

  // Initialize Webnative
  async function init() {
    await initialize()
  }

  init().then().catch(console.log)

  function setView(event: CustomEvent<{ view: View }>) {
    view = event.detail.view
  }
</script>

{#if input}
  <div class="grid grid-flow-row auto-rows-max gap-5 px-5 py-5">
    <div class="grid grid-flow-col auto-cols w-full pl-4">
      <h2 class="text-2xl font-mono">Ditto</h2>
      {#if view === 'effect'}
        <div class="grid grid-flow-col auto-cols pt-1 pr-5 gap-5 justify-end">
          <ConnectIcon on:click={setView} />
          <PresetsIcon on:click={setView} />
        </div>
      {:else}
        <div class="grid pt-1 pr-3 justify-end">
          <CloseIcon on:click={setView} />
        </div>
      {/if}
    </div>
    {#if view === 'effect'}
      <Effect {input} {render} />
    {:else if view === 'connect'}
      <Connect />
    {:else if view === 'presets'}
      <Presets />
    {/if}
  </div>
{/if}
