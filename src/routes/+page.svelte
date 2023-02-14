<script lang="ts">
  import { el } from '@elemaudio/core'
  import { default as core } from '@elemaudio/plugin-renderer'

  import { initialize } from '$lib/init'
  import type { Channels } from '$lib/audio/index'
  import Effect from '$components/views/Effect.svelte'
  import CloseIcon from '$components/icons/Close.svelte'
  import Connect from '$components/views/Connect.svelte'
  import ConnectIcon from '$components/icons/Connect.svelte'
  import PresetHeader from '$components/Presets/PresetHeader.svelte'
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

  init().catch(console.log)

  function setView(event: CustomEvent<{ view: View }>) {
    view = event.detail.view
  }
</script>

{#if input}
  <div class="grid grid-flow-row auto-rows-max gap-5 px-5 py-5 min-h-screen">
    <div class="grid grid-flow-col auto-cols w-full items-center pl-4">
      <h2 class="text-2xl font-mono">Ditto</h2>
      <PresetHeader on:click={setView} />
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


<!-- <div class="bg-gray-50 min-h-screen flex items-center justify-center px-16">
  <div class="relative w-full max-w-lg">
    <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob "></div>
    <div class="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-32 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    <div class="m-8 relative space-y-4">
      <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
        <div class="flex-1 flex justify-between items-center">
          <div class="h-4 w-48 bg-gray-300 rounded"></div>
          <div class="w-24 h-6 rounded-lg bg-purple-300"></div>
        </div>
      </div>
      <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
        <div class="flex-1 flex justify-between items-center">
          <div class="h-4 w-48 bg-gray-300 rounded"></div>
          <div class="w-24 h-6 rounded-lg bg-purple-300"></div>
        </div>
      </div>
      <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
        <div class="flex-1 flex justify-between items-center">
          <div class="h-4 w-48 bg-gray-300 rounded"></div>
          <div class="w-24 h-6 rounded-lg bg-purple-300"></div>
        </div>
      </div>
    </div>
  </div>
</div> -->
