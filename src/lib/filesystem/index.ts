// Utility for clearing out IndexedDB
// For use during development only!
export async function clearStorage() {
  const dbs = await window.indexedDB.databases()
  dbs.forEach(db => {
    if (db.name) {
      window.indexedDB.deleteDatabase(db.name)
    }
  })
}