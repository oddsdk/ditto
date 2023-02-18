<script lang="ts">
  import clipboardCopy from 'clipboard-copy'
  import { fly } from 'svelte/transition'
  import QRCode from 'qrcode-svg'

  import { dittoAppURL } from '$lib/auth'
  import Share from '$components/icons/Share.svelte'

  export let username: string

  let connectionLink: string
  let qrcode: string = ''

  connectionLink = `${dittoAppURL}/link-device?username=${username}`
  qrcode = new QRCode({
    content: connectionLink,
    color: '#171717',
    background: '#FAFAFA',
    padding: 0,
    width: 200,
    height: 200,
    join: true
  }).svg()

  const copyLink = async () => {
    await clipboardCopy(connectionLink)
  }
</script>

<div in:fly={{ y: 20, duration: 400 }} class="flex flex-col items-center justify-center h-full-no-header gap-6">
  <div class="rounded-lg overflow-hidden">{@html qrcode}</div>
  <span class="text-lg">Scan this code, or share the connection link</span>
  <button class="btn btn-outline" on:click={copyLink}>
    <Share />
    <span class="ml-2">Share connection link</span>
  </button>
</div>
