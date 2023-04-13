<script lang="ts">
  import type * as odd from '@oddjs/odd'
  import { onDestroy } from 'svelte'
  import type { AccountLinkingProducer } from '@oddjs/odd'

  import { authStore, viewStore } from '../../stores'
  import { setConnectedStatus } from '$lib/auth/connected'
  import Register from '$components/views/connect/Register.svelte'
  import Link from '$components/views/connect/Link.svelte'
  import ConfirmPin from '$components/views/connect/ConfirmPin.svelte'
  import Connected from '$components/views/connect/Connected.svelte'

  type View = 'register' | 'link' | 'confirm-pin' | 'connected'

  let authStrategy: odd.AuthenticationStrategy | null
  let session: odd.Session | null
  let username = ''

  let accountLinkingProducer: AccountLinkingProducer
  let pin: number[]
  let view: View
  let confirmPin: () => void = () => {
    return
  }

  const unsubscribeAuthStore = authStore.subscribe(auth => {
    const connected = auth.connectedStatus
    authStrategy = auth.authStrategy
    session = auth.session

    /** Initialize connect view
     *
     * If a session exists, the user has already registered.
     * Check to see if they have connected to the web companion
     * app. If they have, show the connected view. Otherwise,
     * initiate account linking and show the link view.
     *
     * Note that when the user registers, the auth store is
     * updated with a session and a connected status set to false.
     * We re-run this check and load the 'link' view.
     */
    if (session) {
      username = session.username

      if (connected) {
        view = 'connected'
      } else {
        view = 'link'
        initAccountLinkingProducer(username).catch(err =>
          console.error('Failed to initialize account linking producer: ', err)
        )
      }
    } else {
      view = 'register'
    }
  })

  function handleLinkingCanceled() {
    if (accountLinkingProducer) accountLinkingProducer.cancel()

    viewStore.update(state => ({
      ...state,
      globalView: 'effect'
    }))
  }

  async function handleRelink() {
    await initAccountLinkingProducer(username)
    view = 'link'
  }

  async function initAccountLinkingProducer(username: string) {
    if (authStrategy) {
      accountLinkingProducer = await authStrategy.accountProducer(username)

      accountLinkingProducer.on('challenge', detail => {
        pin = detail.pin
        confirmPin = detail.confirmPin
        view = 'confirm-pin'
      })

      accountLinkingProducer.on('link', ({ approved }) => {
        if (approved) {
          view = 'connected'

          if (session?.fs) {
            setConnectedStatus(session.fs, true).catch(err => {
              console.error('Failed to set connected status: ', err)
            })
          } else {
            console.error(
              'Unable to retrieve session when setting connected status'
            )
          }
        }
      })
    }
  }

  onDestroy(() => {
    unsubscribeAuthStore()
    if (accountLinkingProducer) accountLinkingProducer.cancel()
  })
</script>

<div class="grid grid-flow-row auto-rows px-4">
  {#if view === 'register'}
    <Register />
  {:else if view === 'link'}
    <Link {username} />
  {:else if view === 'confirm-pin'}
    <ConfirmPin {pin} {confirmPin} on:cancel={handleLinkingCanceled} />
  {:else if view === 'connected'}
    <Connected on:relink={handleRelink} />
  {/if}
</div>
