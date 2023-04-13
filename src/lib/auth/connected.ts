import * as odd from '@oddjs/odd'
import { sessionStore } from '../../stores'

export type ConnectedStatus = { connected: boolean }

export function isConnectedStatus(status: unknown): status is ConnectedStatus {
  return (
    status !== null &&
    typeof status === 'object' &&
    'connected' in status &&
    status.connected !== null &&
    typeof status.connected === 'boolean'
  )
}

export async function checkConnectedStatus(
  fs: odd.FileSystem
): Promise<boolean> {
  const statusExists = await fs.exists(
    odd.path.file('private', 'connectedStatus')
  )

  if (statusExists) {
    // `status` is checked with type guard before use
    // eslint-disable-next-line
    const status: ConnectedStatus = JSON.parse(
      new TextDecoder().decode(
        await fs.read(odd.path.file('private', 'connectedStatus'))
      )
    )

    if (isConnectedStatus(status)) {
      return status.connected
    }
  }

  return false
}

export async function setConnectedStatus(fs: odd.FileSystem, status: boolean) {
  sessionStore.update(session => ({
    ...session,
    connectedStatus: status
  }))

  await fs.write(
    odd.path.file('private', 'connectedStatus'),
    new TextEncoder().encode(JSON.stringify({ connected: true }))
  )
  await fs.publish()
}