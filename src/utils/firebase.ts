import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQcZW9ub9vCKxsqhItrXbKg8L8rqU0VMk",
  authDomain: "preciouspool.firebaseapp.com",
  databaseURL:
    "https://preciouspool-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "preciouspool",
  storageBucket: "preciouspool.appspot.com",
  messagingSenderId: "216565374605",
  appId: "1:216565374605:web:c7e7e2d8bd1aa08d264cc4",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

export const database = getFirestore(firebase);

export default firebase;
