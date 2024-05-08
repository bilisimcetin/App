// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWnqTlL2HVYKVwpu_KZb-GnkYt_l8GwVs",
  authDomain: "ashani-a2f2b.firebaseapp.com",
  projectId: "ashani-a2f2b",
  storageBucket: "ashani-a2f2b.appspot.com",
  messagingSenderId: "716389946137",
  appId: "1:716389946137:web:119e8712869072ac9fab88",
  measurementId: "G-1L2VNG5K6J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);


export {auth , db,  storage};