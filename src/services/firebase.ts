import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_APP_ID,
//   measurementId: import.meta.env.VITE_MEASUREMENT_ID,
// }

const firebaseConfig = {
  apiKey: 'AIzaSyDkXK_uMKRVGv3SVS6NiSbLmEcgKErRifU',
  authDomain: 'pay-next-893c2.firebaseapp.com',
  projectId: 'pay-next-893c2',
  storageBucket: 'pay-next-893c2.appspot.com',
  messagingSenderId: '17386183370',
  appId: '1:17386183370:web:d26cd7d069db7f7fbbf233',
  measurementId: 'G-V2FRPMVVBB',
}

const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)
const firestore = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { analytics, firestore, auth }
