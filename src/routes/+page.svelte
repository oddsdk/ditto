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
          <!-- <div class="absolute z-0 top-0 -left-4 w-80 h-80 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div class="absolute z-0 bottom-0 -right-4 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div class="absolute z-0 -bottom-8 left-20 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div> -->
        <!-- <div class="fixed z-0 top-0 right-0 bottom-0 left-0">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
          <radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5"><animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="rgba(255, 0, 255, 1)"></stop><stop offset="100%" stop-color="rgba(255, 0, 255, 0)"></stop></radialGradient>
          <radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5"><animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="rgba(255, 255, 0, 1)"></stop><stop offset="100%" stop-color="rgba(255, 255, 0, 0)"></stop></radialGradient>
          <radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5"><animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="rgba(0, 255, 255, 1)"></stop><stop offset="100%" stop-color="rgba(0, 255, 255, 0)"></stop></radialGradient>
          <radialGradient id="Gradient4" cx="50%" cy="50%" fx="4.56417%" fy="50%" r=".5"><animate attributeName="fx" dur="23s" values="0%;5%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="rgba(0, 255, 0, 1)"></stop><stop offset="100%" stop-color="rgba(0, 255, 0, 0)"></stop></radialGradient>
          <radialGradient id="Gradient5" cx="50%" cy="50%" fx="2.65405%" fy="50%" r=".5"><animate attributeName="fx" dur="24.5s" values="0%;5%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="rgba(0,0,255, 1)"></stop><stop offset="100%" stop-color="rgba(0,0,255, 0)"></stop></radialGradient>
          <radialGradient id="Gradient6" cx="50%" cy="50%" fx="0.981338%" fy="50%" r=".5"><animate attributeName="fx" dur="25.5s" values="0%;5%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="rgba(255,0,0, 1)"></stop><stop offset="100%" stop-color="rgba(255,0,0, 0)"></stop></radialGradient>
          </defs>
          <rect x="13.744%" y="1.18473%" width="100%" height="100%" fill="url(#Gradient1)" transform="rotate(334.41 50 50)"><animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite"></animate><animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s" repeatCount="indefinite"></animateTransform></rect>
          <rect x="-2.17916%" y="35.4267%" width="100%" height="100%" fill="url(#Gradient2)" transform="rotate(255.072 50 50)"><animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite"></animate><animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s" repeatCount="indefinite"></animateTransform>
          </rect>
          <rect x="9.00483%" y="14.5733%" width="100%" height="100%" fill="url(#Gradient3)" transform="rotate(139.903 50 50)"><animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite"></animate><animate attributeName="y" dur="12s" values="0%;25%;0%" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s" repeatCount="indefinite"></animateTransform>
          </rect>
          </svg>
        </div> -->
      </div>
    {/if}
  </div>
{/if}
