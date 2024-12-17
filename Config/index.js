// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZ6A84dVuLT_TEijQvbDDMyZg8f1Gi5ZA",
  authDomain: "whatsappclone-7a89a.firebaseapp.com",
  databaseURL: "https://whatsappclone-7a89a-default-rtdb.firebaseio.com",
  projectId: "whatsappclone-7a89a",
  storageBucket: "whatsappclone-7a89a.firebasestorage.app",
  messagingSenderId: "130488291951",
  appId: "1:130488291951:web:ec3a391387321b92ed739a",
  measurementId: "G-WJE18GEDHS"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;