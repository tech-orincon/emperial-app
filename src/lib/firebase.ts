import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';

// ─── Firebase Config ──────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: 'AIzaSyBeavNW3kC_qMy6AR2AAfM_6VC9fT2Vezk',
  authDomain: 'emperial-5d4f9.firebaseapp.com',
  projectId: 'emperial-5d4f9',
  storageBucket: 'emperial-5d4f9.firebasestorage.app',
  messagingSenderId: '119322125556',
  appId: '1:119322125556:web:68e21cca6550b6608f6aa1',
  measurementId: 'G-MB5ET5QM6D',
};

// ─── App & Auth ───────────────────────────────────────────────────────────────

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

// Persist session in localStorage so the user stays logged in across page
// refreshes. Firebase will also automatically refresh the ID token (every hour).
setPersistence(auth, browserLocalPersistence);
