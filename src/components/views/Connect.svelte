<script lang="ts">
  import { programStore } from '../../stores'
  import Register from '$components/views/connect/Register.svelte'
  import Link from '$components/views/connect/Link.svelte'
  import ConfirmPin from '$components/views/connect/ConfirmPin.svelte'
  import Connected from '$components/views/connect/Connected.svelte'

  type View = 'register' | 'link' | 'confirm-pin' | 'connected'

  const program = $programStore
  let view: View

  if (program?.session) {
    view = 'link'
  } else {
    view = 'register'
  }

  function navigate(event: CustomEvent<{ from: View }>) {
    switch (event.detail.from) {
      case 'register':
        view = 'link'
        break

      case 'link':
        view = 'confirm-pin'
        break

      case 'confirm-pin':
        view = 'connected'
        break

      default:
        break
    }
  }
</script>

<div class="grid grid-flow-row auto-rows px-4">
  {#if view === 'register'}
    <Register on:navigate={navigate} />
  {:else if view === 'link'}
    <Link on:navigate={navigate} />
  {:else if view === 'confirm-pin'}
    <ConfirmPin on:navigate={navigate} />
  {:else if view === 'connected'}
    <Connected on:navigate={navigate} />
  {/if}
</div>
