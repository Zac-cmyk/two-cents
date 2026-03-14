import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAzU4xS9U1uGfODgoT1cl1mJpnhv1x6arA",
  authDomain: "cents-3279b.firebaseapp.com",
  projectId: "cents-3279b",
  storageBucket: "cents-3279b.firebasestorage.app",
  messagingSenderId: "870969320561",
  appId: "1:870969320561:web:515539c9ac75fdba93e7d0",
  measurementId: "G-ZEWGNSGHZD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();