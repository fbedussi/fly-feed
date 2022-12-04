import { FetchOk, IsoDate } from './model'

if (!('indexedDB' in window)) {
  throw new Error("This browser doesn't support IndexedDB")
}

let db: IDBDatabase | undefined

const storeName = 'cache'

const openDb = (): Promise<typeof dbInterface> =>
  new Promise((resolve, reject) => {
    const dbName = 'fly-feed'
    const request = indexedDB.open(dbName)
    let newDb = false

    request.addEventListener('error', () => reject(`Error opening DB ${dbName}: ${request.error}`))

    request.addEventListener('upgradeneeded', event => {
      const db = (event.target as { result: IDBDatabase } | null | undefined)?.result

      if (!db) {
        throw new Error('not initialized DB')
      }

      try {
        db.createObjectStore(storeName, { keyPath: 'id' })
      } catch (e) {
        reject('Error creating updates store')
      }

      newDb = true
    })

    request.addEventListener('success', event => {
      db = (event.target as { result: IDBDatabase } | null | undefined)?.result
      if (!db) {
        throw new Error('not initialized DB')
      }
      resolve(dbInterface)
    })
  })

const contentId = '1'

const saveCache = (content: { updatedAt: IsoDate; articles: FetchOk[] }): Promise<IDBValidKey> =>
  new Promise((resolve, reject) => {
    if (!db) {
      throw new Error('not initialized DB')
    }
    const transaction = db.transaction([storeName], 'readwrite')
    const request = transaction.objectStore(storeName).put({ ...content, id: contentId })
    transaction.onerror = () => reject(`Error writing to ${storeName}: ${transaction.error}`)

    request.onerror = () => reject(`Error writing to ${storeName}: ${request.error}`)

    request.onsuccess = () => resolve(request.result) //key
  })

const readCache = <T>(): Promise<T> =>
  new Promise((resolve, reject) => {
    if (!db) {
      throw new Error('not initialized DB')
    }
    const transaction = db.transaction([storeName])
    const request = transaction.objectStore(storeName).get(contentId)
    transaction.onerror = () => reject(`Error reading from ${storeName}: ${transaction.error}`)

    request.onerror = () => reject(`Error reading from ${storeName}: ${request.error}`)

    request.onsuccess = () => resolve(request.result as T)
  })

const dbInterface = {
  saveCache,
  readCache,
}

export default openDb
