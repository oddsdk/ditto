import * as odd from '@oddjs/odd'
import { createEmitter, type FileSystem as FileSystemEvents } from '@oddjs/odd/events'
import { isCID } from '@oddjs/odd/fs/types/check'
import { type CID, decodeCID, encodeCID } from '@oddjs/odd/common/cid'
import { FileSystem, type Program } from '@oddjs/odd'

const LOCAL_ONLY_FS_KEY = 'local-only-fs'

function setupHooks(fs: odd.FileSystem, program: Program): void {
  fs.publish = async function () {
    const cid: CID = await this.root.put()
    await program.components.storage.setItem(LOCAL_ONLY_FS_KEY, encodeCID(cid))
    return cid
  }
}

/**
 * Retrieves a local-only filesystem or creates a new filesystem if
 * does not exist.
 * 
 * @param program an ODD program
 */
async function localOnlyFileSystem(program: Program): Promise<odd.FileSystem> {
  const account = { rootDID: await program.agentDID() }
  const dependencies = program.components
  const fsEvents = createEmitter<FileSystemEvents>()

  // Load existing filesystem
  const rootCID = await program.components.storage.getItem(LOCAL_ONLY_FS_KEY)
  if (rootCID && isCID(rootCID)) {
    const existingFs = await FileSystem.fromCID(decodeCID(rootCID), {
      account,
      dependencies,
      eventEmitter: fsEvents,
      localOnly: true
    })

    setupHooks(existingFs, program)
    return existingFs
  }

  // Create a new filesystem
  const newFs = await FileSystem.empty({
    account,
    dependencies,
    eventEmitter: fsEvents,
    localOnly: true
  })

  setupHooks(newFs, program)
  await newFs.publish()

  return newFs
}

export function getLocalOnlyFs(): Promise<odd.FileSystem> {
  return odd
    .program({
      namespace: 'local-only',
      debug: true
    })
    .then(async (program) => {
       return await localOnlyFileSystem(program)
    })
}
