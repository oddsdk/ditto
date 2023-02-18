<script lang="ts">
  import { fly } from 'svelte/transition'
  import * as webnative from 'webnative'

  import { fileSystemStore, programStore, sessionStore } from '../../../stores'
  import {
    loadFromFilesystem as loadPresets,
    savePreset,
    storeToFilesystem as storePresets
  } from '$lib/presets'
  import { getUsername, usernamePrefix } from '$lib/auth'
  import type { Program } from 'webnative'
  import { Visibility } from '$lib/patch'

  let program: Program | null = $programStore

  let checkingUsername = false
  let displayName = ''
  let usernameAvailable = false
  let usernameValid = false

  async function checkUsername(event: { currentTarget: HTMLInputElement }) {
    checkingUsername = true
    displayName = event.currentTarget.value

    if (program) {
      usernameValid = await program.auth.isUsernameValid(
        `${usernamePrefix}${displayName}`
      )
      usernameAvailable = await program.auth.isUsernameAvailable(
        `${usernamePrefix}${displayName}`
      )
    }

    checkingUsername = false
  }

  async function registerUser() {
    if (program) {
      const { success } = await program.auth.register({
        username: `${usernamePrefix}${displayName}`
      })

      if (success) {
        const session = await program.auth.session()

        if (session) {
          const fs = session.fs

          if (fs) {
            // Set connectedStatus. After the user links to the web app,
            // connectedStatus is set to true.
            await fs.write(
              webnative.path.file('private', 'connectedStatus'),
              new TextEncoder().encode(JSON.stringify({ connected: false }))
            )
            await fs.publish()

            sessionStore.set({
              connectedStatus: false,
              session
            })

            // Load presets from local-only filesystem
            const presets = await loadPresets(Visibility.private)

            // Update the creator field of each preset with the username
            await Promise.all(presets.map(async (preset) => savePreset({
              ...preset,
              creator: getUsername(),
            })))

            // Switch to persistent filesystem
            fileSystemStore.set(fs)

            // Store presets in persistent filesystem
            await storePresets(presets, Visibility.private)
          } else {
            console.error('File system missing on session at registration')
          }
        } else {
          console.error('Session failed to load after registration')
        }
      } else {
        console.error('Failed to register user')
      }
    }
  }

  $: usernameError =
    displayName.length > 0 &&
    !checkingUsername &&
    (!usernameValid || !usernameAvailable)
</script>

<div in:fly={{ y: 20, duration: 400 }} class="flex flex-col items-center justify-center h-full-no-header gap-2">
  <h2 class="text-lg font-semibold">Connect to sync your presets to the web.</h2>
  <div id="connect" class="form-control w-full max-w-xs gap-4">
    <div>
      <label class="label" for="connect">
        <span class="label-text">Choose a username</span>
      </label>
      <input
        type="text"
        placeholder=""
        spellcheck="false"
        class="input input-bordered focus:outline-0 w-full max-w-xs"
        class:input-error={usernameError}
        on:input={checkUsername}
      />
      {#if displayName.length > 0}
        {#if !usernameValid}
          <label class="label" for="connect">
            <span class="label-text-alt text-error"> Username is invalid </span>
          </label>
        {:else if !usernameAvailable}
          <label class="label pb-0" for="connect">
            <span class="label-text-alt text-error">
              Username is unavailable
            </span>
          </label>
        {/if}
      {/if}
    </div>

    <button
      class="btn btn-primary"
      disabled={displayName.length === 0 || usernameError}
      on:click={registerUser}
    >
      Connect
    </button>
  </div>
</div>
