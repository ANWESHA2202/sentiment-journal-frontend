// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_0snfgFaadzPItqKCr7m586ZzAVQC74E",
  authDomain: "sentiment-journal-27a45.firebaseapp.com",
  projectId: "sentiment-journal-27a45",
  storageBucket: "sentiment-journal-27a45.firebasestorage.app",
  messagingSenderId: "430474343177",
  appId: "1:430474343177:web:35ae344e4ed46a0d7699d8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const myReactNativeLocalPersistence = getReactNativePersistence({
  getItem: (...args) => {
    // Called inline to avoid deprecation warnings on startup.
    return AsyncStorage.getItem(...args);
  },
  setItem: (...args) => {
    // Called inline to avoid deprecation warnings on startup.
    return AsyncStorage.setItem(...args);
  },
  removeItem: (...args) => {
    // Called inline to avoid deprecation warnings on startup.
    return AsyncStorage.removeItem(...args);
  },
});

export const auth = initializeAuth(app, {
  persistence: myReactNativeLocalPersistence,
});

export const db = getFirestore(app);
