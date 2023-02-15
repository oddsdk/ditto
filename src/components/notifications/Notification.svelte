<script lang="ts">
  import { fade, fly } from 'svelte/transition'

  import type { Notification } from '$lib/notifications'

  export let notification: Notification
</script>

<div
  in:fly={{ x: -20, duration: 400 }}
  out:fade
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  <h3 class="text-lg text-center">{@html notification.msg}</h3>
</div>
