// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCk9yLnAGI_iGfgOBc_pzH3gGx3halpeg",
  authDomain: "mobilereact-c416c.firebaseapp.com",
  projectId: "mobilereact-c416c",
  storageBucket: "mobilereact-c416c.appspot.com",
  messagingSenderId: "920102836226",
  appId: "1:920102836226:web:0a9c593e2da8899be42f1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export {app, database}; 