// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {FIRE_BASE_CONFIG} from '../constant/config.ts';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIRE_BASE_CONFIG.apiKey,
  authDomain: FIRE_BASE_CONFIG.authDomain,
  projectId: FIRE_BASE_CONFIG.projectId,
  storageBucket: FIRE_BASE_CONFIG.storageBucket,
  messagingSenderId: FIRE_BASE_CONFIG.messagingSenderId,
  appId: FIRE_BASE_CONFIG.appId,
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
