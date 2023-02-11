<script lang="ts">
  import type { Program } from 'webnative'
  import { programStore } from '../../stores'

  type View = 'connect' | 'link' | 'confirm-pin' | 'connected'

  let program: Program | null = $programStore

  let checkingUsername = false
  let username = ''
  let usernameAvailable = false
  let usernameValid = false
  let view: View = 'connect'

  async function checkUsername(event: { currentTarget: HTMLInputElement }) {
    checkingUsername = true
    username = event.currentTarget.value

    if (program) {
      usernameValid = await program.auth.isUsernameValid(username)
      usernameAvailable = await program.auth.isUsernameAvailable(username)
    }

    checkingUsername = false
  }

  $: usernameError =
    username.length > 0 &&
    !checkingUsername &&
    (!usernameValid || !usernameAvailable)

  function registerUser() {
    // register user
    view = 'link'
  }
</script>

<div class="grid grid-flow-row auto-rows px-4">
  {#if view === 'connect'}
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
                <span class="label-text-alt text-error">
                  Username is invalid
                </span>
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
  {:else if view === 'link'}
    Scan QRCode on mobile or copy the link

    <!-- QRCode and copy link side-by-side? -->
  {/if}
</div>
