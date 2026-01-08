// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCY_GhUfHZDxhKx6yeuA82lWLbLVW5MRUw",
  authDomain: "mi-app-react-demo-2d51e.firebaseapp.com",
  projectId: "mi-app-react-demo-2d51e",
  storageBucket: "mi-app-react-demo-2d51e.firebasestorage.app",
  messagingSenderId: "123461519227",
  appId: "1:123461519227:web:5ae60761c989fcf1bb1fde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);