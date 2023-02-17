<script lang="ts">
  import { flip } from 'svelte/animate'

  import { notificationStore } from '../../stores'
  import Notification from '$components/notifications/Notification.svelte'
</script>

{#if $notificationStore.length}
  <div class="absolute top-0 right-0 bottom-0 left-0 z-20 bg-base-300 text-slate-900 rounded-lg flex flex-col justify-center">
    {#each $notificationStore as notification (notification.id)}
      <div animate:flip>
        <Notification {notification} />
      </div>
    {/each}
  </div>
{/if}
