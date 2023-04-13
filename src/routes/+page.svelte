<script lang="ts">
  import { el } from '@elemaudio/core'
  import { default as core } from '@elemaudio/plugin-renderer'

  import { sessionStore, viewStore } from '../stores'
  import { initialize } from '$lib/init'
  import type { Channels } from '$lib/audio/index'
  import Effect from '$components/views/Effect.svelte'
  import CloseIcon from '$components/icons/Close.svelte'
  import Connect from '$components/views/Connect.svelte'
  import ConnectIcon from '$components/icons/Connect.svelte'
  import GlobalShortcutHandler from '$components/common/GlobalShortcutHandler.svelte'
  import GlobalShortcutView from '$components/common/GlobalShortcutView.svelte'
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import Logo from '$components/icons/Logo.svelte'
  import PresetHeader from '$components/presets/PresetHeader.svelte'
  import Presets from '$components/views/Presets.svelte'
  import PresetsIcon from '$components/icons/Presets.svelte'
  // import Sync from '$components/icons/Sync.svelte'
  import UnsavedChanges from '$components/icons/UnsavedChanges.svelte'

  let input: Channels
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

  // Initialize the ODD SDK
  async function init() {
    loading = true
    await initialize()
    loading = false
  }

  init().catch(console.log)
</script>

<GlobalShortcutHandler />

{#if input}
  <div class="relative grid grid-flow-row auto-rows-max min-h-screen">
    {#if loading}
      <LoadingSpinner />
    {:else}
      <div
        class="grid grid-flow-col auto-cols w-full items-center px-2 pl-5 py-5 backdrop-blur-sm bg-base-100 border-b"
      >
        <Logo />
        <div class="relative max-w-[500px] flex items-center justify-center">
          <div class="absolute left-[54px]">
            {#if $viewStore.globalView === 'presets'}
              <CloseIcon />
            {:else if $viewStore.globalView === 'effect' || $viewStore.globalView === 'connect'}
              <PresetsIcon />
            {/if}
          </div>
          <PresetHeader />
        </div>
        <div class="relative flex items-center justify-end pr-5 gap-5">
          <!-- {#if $sessionStore.connectedStatus}
            <Sync />
          {/if} -->
          <UnsavedChanges />
          {#if $viewStore.globalView === 'connect'}
            <CloseIcon />
          {:else}
            <ConnectIcon />
          {/if}
        </div>
      </div>
      <div class="relative pl-4 h-full-no-header">
        {#if $viewStore.showShortcuts}
          <GlobalShortcutView />
        {/if}

        {#if $viewStore.globalView === 'effect'}
          <Effect {input} {render} />
        {:else if $viewStore.globalView === 'connect'}
          <Connect />
        {:else if $viewStore.globalView === 'presets'}
          <Presets />
        {/if}
      </div>
    {/if}
    {#if !loading && !$sessionStore.connectedStatus}
      <div
        class="absolute right-0 bottom-0 left-0 text-center bg-base-300 text-sm py-2 font-monospace"
      >
        Presets will only be saved locally until you connect with the Ditto
        companion app
      </div>
    {/if}
  </div>
{/if}
