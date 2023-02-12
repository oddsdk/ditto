<script lang="ts">
  import * as webnative from 'webnative'
  import { createEventDispatcher } from 'svelte'
  import type { AccountLinkingProducer } from 'webnative'

  import { programStore } from '../../stores'
  import Register from '$components/views/connect/Register.svelte'
  import Link from '$components/views/connect/Link.svelte'
  import ConfirmPin from '$components/views/connect/ConfirmPin.svelte'
  import Connected from '$components/views/connect/Connected.svelte'
  import { isConnectedStatus, type ConnectedStatus } from '$lib/auth'

  type View = 'register' | 'link' | 'confirm-pin' | 'connected'

  const dispatch = createEventDispatcher()

  const program = $programStore
  const session = program?.session
  let accountLinkingProducer: AccountLinkingProducer
  let pin: number[]
  let view: View
  let confirmPin: () => void = () => {
    return
  }

  /** Initialize connect view
   *
   * If a session exists, the user has already registered.
   * Check to see if they have connected to the web companion
   * app. If they have, show the connected view. Otherwise,
   * initiate account linking and show the link view.
   */
  if (session?.fs) {
    const { fs, username } = session

    checkConnectedStatus(fs)
      .then(async connected => {
        if (connected) {
          view = 'connected'
        } else {
          await initAccountLinkingProducer(username)
          view = 'link'
        }
      })
      .catch(err => console.error('Error checking connection status: ', err))
  } else {
    view = 'register'
  }

  async function checkConnectedStatus(
    fs: webnative.FileSystem
  ): Promise<boolean> {
    const statusExists = await fs.exists(
      webnative.path.file('private', 'connectedStatus')
    )

    if (statusExists) {
      // `status` is checked with type guard before use
      // eslint-disable-next-line
      const status: ConnectedStatus = JSON.parse(
        new TextDecoder().decode(
          await fs.read(webnative.path.file('private', 'connectedStatus'))
        )
      )

      if (isConnectedStatus(status)) {
        return status.connected
      }
    }

    return false
  }

  async function setConnectedStatus(fs: webnative.FileSystem) {
    await fs.write(
      webnative.path.file('private', 'connectedStatus'),
      new TextEncoder().encode(JSON.stringify({ connected: true }))
    )
    await fs.publish()
  }

  async function link(event: CustomEvent<{ username: string }>) {
    const { username } = event.detail

    await initAccountLinkingProducer(username)
    view = 'link'
  }

  function handlePinConfirmed() {
    view = 'connected'
  }

  function handleLinkingCanceled() {
    accountLinkingProducer.cancel()

    dispatch('navigate', { view: 'effect' })
  }

  async function initAccountLinkingProducer(username: string) {
    if (program) {
      accountLinkingProducer = await program.auth.accountProducer(username)

      console.log('account linking producer started')

      accountLinkingProducer.on('challenge', detail => {
        pin = detail.pin
        confirmPin = detail.confirmPin
        view = 'confirm-pin'
      })

      accountLinkingProducer.on('link', ({ approved }) => {
        if (approved) {
          if (session?.fs) {
            setConnectedStatus(session.fs).catch(err => {
              console.warn('Failed to set connected status: ', err)
            })
          }
        }
      })
    }
  }
</script>

<div class="grid grid-flow-row auto-rows px-4">
  {#if view === 'register'}
    <Register on:register={link} />
  {:else if view === 'link'}
    <Link />
  {:else if view === 'confirm-pin'}
    <ConfirmPin
      {pin}
      {confirmPin}
      on:confirm={handlePinConfirmed}
      on:cancel={handleLinkingCanceled}
    />
  {:else if view === 'connected'}
    <Connected />
  {/if}
</div>
