import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth'
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
export const initAuth = setPersistence(auth, browserLocalPersistence).then(
  () => auth,
)

export const db = getFirestore(app)

enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
    console.error(
      'Fail to enable persistence, due to a missing precondition (e.g. multiple tabs open)',
    )
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
    console.error(
      'Fail to enable persistence, due to a lack of browser support',
    )
  }
})

export default app
