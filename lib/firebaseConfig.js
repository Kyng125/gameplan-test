// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8KQNNFKXmq-Y-qpIyJ1u1OxTHqvkMRcs",
  authDomain: "gameplan-v1.firebaseapp.com",
  projectId: "gameplan-v1",
  storageBucket: "gameplan-v1.appspot.com",
  messagingSenderId: "993189180072",
  appId: "1:993189180072:web:7bacc701b9420e3c24489d",
  measurementId: "G-MQV1W7YXWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };