<script lang="ts">
  import { el } from '@elemaudio/core'
  import { default as core } from '@elemaudio/plugin-renderer'

  import { sessionStore } from '../stores'
  import { initialize } from '$lib/init'
  import { clearStorage } from '$lib/filesystem'
  import type { Channels } from '$lib/audio/index'
  import Effect from '$components/views/Effect.svelte'
  import CloseIcon from '$components/icons/Close.svelte'
  import Connect from '$components/views/Connect.svelte'
  import ConnectIcon from '$components/icons/Connect.svelte'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import PresetHeader from '$components/presets/PresetHeader.svelte'
  import Presets from '$components/views/Presets.svelte'
  import PresetsIcon from '$components/icons/Presets.svelte'
  // import Sync from '$components/icons/Sync.svelte'
  import UnsavedChanges from '$components/icons/UnsavedChanges.svelte'

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
    // await clearStorage()
    loading = false
  }

  init().catch(console.log)

  function setView(event: CustomEvent<{ view: View }>) {
    view = event.detail.view
  }
</script>

{#if input}
  <div class="relative grid grid-flow-row auto-rows-max min-h-screen">
    {#if loading}
      <LoadingSpinner />
    {:else}
      <div class="grid grid-flow-col auto-cols w-full items-center px-2 pl-5 py-5 backdrop-blur-sm bg-base-100 border-b">
        <h2 class="text-2xl font-mono cursor-pointer">Ditto</h2>
        <div class="relative max-w-[500px] flex items-center justify-center">
          <div class="absolute left-[52px]">
            {#if  view === 'presets'}
              <CloseIcon on:click={setView} />
            {:else if view === 'effect' || view === 'connect'}
              <PresetsIcon on:click={setView} />
            {/if}
          </div>
          <PresetHeader on:click={setView} />
        </div>
        <div class="relative flex items-center justify-end pr-5 gap-5">
          <!-- {#if $sessionStore.connectedStatus}
            <Sync />
          {/if} -->
          <UnsavedChanges />
          {#if view === 'connect'}
            <CloseIcon on:click={setView} />
          {:else}
            <ConnectIcon on:click={setView} />
          {/if}
        </div>
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
    {#if !loading && !$sessionStore.connectedStatus}
      <div class="absolute right-0 bottom-0 left-0 text-center bg-base-300 text-sm py-2 font-monospace">Presets will only be saved to locally until you connect with the Ditto companion app</div>
    {/if}
  </div>
{/if}
