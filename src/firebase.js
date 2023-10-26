// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzgq_DFNyyJTPosvf0uKX6e7JsDSVAs_M",
  authDomain: "studentsmartrentals-965ac.firebaseapp.com",
  projectId: "studentsmartrentals-965ac",
  storageBucket: "studentsmartrentals-965ac.appspot.com",
  messagingSenderId: "1057299077102",
  appId: "1:1057299077102:web:f8696250906c4ddd0ca0ff",
  measurementId: "G-HRP0DYDW8D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

//const provider = new GoogleAuthProvider();
// export { auth, provider };
export const storage = getStorage();
export const db = getFirestore();
export default app;
