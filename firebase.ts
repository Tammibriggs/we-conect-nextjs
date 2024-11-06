import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDK6kJwx9vyPQWxLI73a2NmTi8Zs8MuBnc",
  authDomain: "store-images-cc8fe.firebaseapp.com",
  projectId: "store-images-cc8fe",
  storageBucket: "store-images-cc8fe.appspot.com",
  messagingSenderId: "1028210401843",
  appId: "1:1028210401843:web:7cccee7e83d584fee6b946",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
