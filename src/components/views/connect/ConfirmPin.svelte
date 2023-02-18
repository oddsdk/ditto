<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'

  export let confirmPin: () => void
  export let pin: number[]

  const dispatch = createEventDispatcher()

  let pinInput = ''
  let pinError = false
  const TARGET_PIN_LENGTH = 6

  function checkPin() {
    if (pinInput.length === TARGET_PIN_LENGTH) {
      if (pin.join('') === pinInput) {
        confirmPin()

        // show spinner
      } else {
        pinError = true
      }
    }
  }

  function cancelConnection() {
    dispatch('cancel')
  }
</script>

<div in:fly={{ y: 20, duration: 400 }} class="flex flex-col items-center justify-center h-full-no-header gap-6">
  <h2 class="text-lg">
    Enter the connection code from the Ditto app to approve the connection.
  </h2>
  <input
    id="pin"
    type="text"
    class="input input-bordered focus:outline-0 w-full max-w-[197px] mb-2 rounded-full h-[68px] place-self-center focus:outline-none font-mono text-2xl text-deviceCode text-center tracking-[0.1em] font-light {pinError
      ? '!text-red-500 !border-red-500'
      : ''}"
    maxlength="6"
    spellcheck="false"
    bind:value={pinInput}
    on:keyup={checkPin}
  />
  <button
    class="btn btn-outline"
    on:click={cancelConnection}
  >
    Cancel Request
  </button>
</div>
