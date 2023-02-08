import * as webnative from 'webnative'
import { createEmitter, type FileSystem as FileSystemEvents } from 'webnative/events'
import { isCID } from 'webnative/fs/types/check'
import { type CID, decodeCID, encodeCID } from 'webnative/common/cid'
import { FileSystem, type Program } from 'webnative'

const LOCAL_ONLY_FS_KEY = 'local-only-fs'

function setupHooks(fs: webnative.FileSystem, program: Program): void {
  fs.publish = async function () {
    const cid: CID = await this.root.put()
    await program.components.storage.setItem(LOCAL_ONLY_FS_KEY, encodeCID(cid))
    return cid
  }
}

async function localOnlyFileSystem(program: Program): Promise<webnative.FileSystem> {
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

export function getLocalOnlyFs(): Promise<webnative.FileSystem> {
  return webnative
    .program({
      namespace: 'local-only',
      debug: true
    })
    .then(async (program) => {
       return await localOnlyFileSystem(program)
    })
}
