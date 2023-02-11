<script lang="ts">
  import clipboardCopy from 'clipboard-copy'
  import QRCode from 'qrcode-svg'

  import { dittoAppURL } from '$lib/auth'
  import { programStore } from '../../../stores'
  import Share from '$components/icons/Share.svelte'

  let connectionLink: string
  let qrcode: string = ''

  programStore.subscribe(program => {
    const username = program?.session?.username

    if (username) {
      connectionLink = `${dittoAppURL}/link-device?username=${username}`
      qrcode = new QRCode({
        content: connectionLink,
        color: '#e2e2e2',
        background: '#000',
        padding: 0,
        width: 150,
        height: 150,
        join: true
      }).svg()
    } else {
      console.log('username missing', username)
    }
  })

  const copyLink = async () => {
    await clipboardCopy(connectionLink)
  }
</script>

<div class="grid grid-flow-col grid-cols-[1fr_2fr] gap-10">
  <div>{@html qrcode}</div>
  <div class="grid grid-flow-row auto-rows">
    <span> Scan this code, or share the connection link. </span>
    <button class="btn btn-outline" on:click={copyLink}>
      <Share />
      <span class="ml-2">Share connection link</span>
    </button>
  </div>
</div>
