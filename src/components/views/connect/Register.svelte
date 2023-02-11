<script lang="ts">
  import * as webnative from 'webnative'
  import { createEventDispatcher } from 'svelte'

  import { getLocalOnlyFs } from '$lib/filesystem/local'
  import { programStore } from '../../../stores'
  import { usernamePrefix } from '$lib/auth'
  import type { Program } from 'webnative'

  const dispatch = createEventDispatcher()

  let program: Program | null = $programStore

  let checkingUsername = false
  let username = ''
  let usernameAvailable = false
  let usernameValid = false

  async function checkUsername(event: { currentTarget: HTMLInputElement }) {
    checkingUsername = true
    username = event.currentTarget.value

    if (program) {
      usernameValid = await program.auth.isUsernameValid(
        `${usernamePrefix}${username}`
      )
      usernameAvailable = await program.auth.isUsernameAvailable(
        `${usernamePrefix}${username}`
      )
    }

    checkingUsername = false
  }

  async function registerUser() {
    // register user

    if (program) {
      const { success } = await program.auth.register({
        username: `${usernamePrefix}${username}`
      })

      if (success) {
        // Copy data to synced file system
        const localOnlyFs = await getLocalOnlyFs()

        const presetsNode = await localOnlyFs.get(
          webnative.path.directory('private', 'presets')
        )

        console.log('presets node', presetsNode)

        // Dispatch view change message
        dispatch('navigate', { from: 'register' })
      } else {
        console.log('failed to register user')
      }
    }
  }

  $: usernameError =
    username.length > 0 &&
    !checkingUsername &&
    (!usernameValid || !usernameAvailable)
</script>

<div class="grid grid-flow-row auto-rows gap-2">
  <div>Connect to sync your presets to the web.</div>
  <div id="connect" class="form-control w-full max-w-xs gap-4">
    <div>
      <label class="label" for="connect">
        <span class="label-text">Choose a username</span>
      </label>
      <input
        type="text"
        placeholder=""
        spellcheck="false"
        class="input input-bordered w-full max-w-xs"
        class:input-error={usernameError}
        on:input={checkUsername}
      />
      {#if username.length > 0}
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
      disabled={username.length === 0 || usernameError}
      on:click={registerUser}
    >
      Connect
    </button>
  </div>
</div>
