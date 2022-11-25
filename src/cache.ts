import { FetchOk, IsoDate } from './model'

if (!('indexedDB' in window)) {
  throw new Error("This browser doesn't support IndexedDB")
}

let db: any

const storeName = 'cache'

const openDb = () =>
  new Promise((resolve, reject) => {
    const dbName = 'fly-feed'
    const request = indexedDB.open(dbName)
    let newDb = false

    request.addEventListener('error', (event) => reject(`Error opening DB ${dbName}: ${request.error}`))

    request.addEventListener('upgradeneeded', (event: any) => {
      const db = event.target?.result

      try {
        db.createObjectStore(storeName, { keyPath: 'id' })
      } catch (e) {
        reject('Error creating upadates store')
      }

      newDb = true
    })

    request.addEventListener('success', (event: any) => {
      db = event.target.result
      resolve(dbInterface)
    })
  })

const contentId = '1'

const saveCache = (content: { updatedAt: IsoDate, articles: FetchOk[] }) =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite')
    const request = transaction.objectStore(storeName).add({ ...content, id: contentId })
    transaction.onerror = () =>
      reject(`Error writing to ${storeName}: ${transaction.error}`)

    request.onerror = () =>
      reject(`Error writing to ${storeName}: ${request.error}`)

    request.onsuccess = () => resolve(request.result) //key
  })

const readCache = () =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName])
    const request = transaction.objectStore(storeName).get(contentId)
    transaction.onerror = () =>
      reject(`Error reading from ${storeName}: ${transaction.error}`)

    request.onerror = () =>
      reject(
        `Error reading from ${storeName}: ${request.error}`,
      )

    request.onsuccess = () => resolve(request.result)
  })

const dbInterface = {
  openDb,
  saveCache,
  readCache,
}

export default openDb
