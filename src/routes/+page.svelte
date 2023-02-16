<script lang="ts">
  import { el } from '@elemaudio/core'
  import { default as core } from '@elemaudio/plugin-renderer'

  import { initialize } from '$lib/init'
  import type { Channels } from '$lib/audio/index'
  import Effect from '$components/views/Effect.svelte'
  import CloseIcon from '$components/icons/Close.svelte'
  import Connect from '$components/views/Connect.svelte'
  import ConnectIcon from '$components/icons/Connect.svelte'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import PresetHeader from '$components/presets/PresetHeader.svelte'
  import Presets from '$components/views/Presets.svelte'
  import PresetsIcon from '$components/icons/Presets.svelte'

  type View = 'connect' | 'effect' | 'presets'

  let input: Channels
  let view: View = 'effect'
  let loading = false

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
    loading = true
    await initialize()
    loading = false
  }

  init().catch(console.log)

  function setView(event: CustomEvent<{ view: View }>) {
    view = event.detail.view
  }
</script>

{#if input}
  <div class="grid grid-flow-row auto-rows-max min-h-screen">
    {#if loading}
      <LoadingSpinner />
    {:else}
      <div class="grid grid-flow-col auto-cols w-full items-center px-2 pl-5 py-5 backdrop-blur-sm bg-base-100 border-b">
        <h2 class="text-2xl font-mono">Ditto</h2>
        <div class="relative max-w-[500px] flex items-center justify-center">
          <div class="absolute left-[52px]">
            {#if view === 'effect'}
              <PresetsIcon on:click={setView} />
            {:else}
              <CloseIcon on:click={setView} />
            {/if}
          </div>
          <PresetHeader on:click={setView} />
        </div>
        <!-- {#if view === 'effect'} -->
        <div class="grid grid-flow-col auto-cols pt-1 pr-5 gap-5 justify-end">
          <ConnectIcon on:click={setView} />
        </div>
        <!-- {/if} -->
      </div>
      <div class="relative pl-4">
        {#if view === 'effect'}
          <Effect {input} {render} />
        {:else if view === 'connect'}
          <Connect on:navigate={setView} />
        {:else if view === 'presets'}
          <Presets />
        {/if}
      </div>
    {/if}
  </div>
{/if}
