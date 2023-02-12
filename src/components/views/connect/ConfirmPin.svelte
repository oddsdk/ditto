<script lang="ts">
  import { createEventDispatcher } from 'svelte'

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

        dispatch('confirm')
      } else {
        pinError = true
      }
    }
  }

  function cancelConnection() {
    dispatch('cancel')
  }
</script>

<div class="grid grid-flow-row auto-rows w-full justify-center gap-4">
  <div>
    Enter the connection code from the Ditto app to approve the connection.
  </div>
  <input
    id="pin"
    type="text"
    class="input input-bordered w-full max-w-[197px] mb-2 rounded-full h-[68px] place-self-center focus:outline-none font-mono text-2xl text-deviceCode text-center tracking-[0.1em] font-light {pinError
      ? '!text-red-500 !border-red-500'
      : ''}"
    maxlength="6"
    spellcheck="false"
    bind:value={pinInput}
    on:keyup={checkPin}
  />
  <button
    class="btn btn-sm btn-outline w-2/5 max-w[197px] place-self-center"
    on:click={cancelConnection}
  >
    Cancel Request
  </button>
</div>
