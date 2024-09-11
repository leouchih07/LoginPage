// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getAuth, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCQyXa_pLBUlOnoWvRAGVSEw_fEZAbQ2vk",
  authDomain: "loginpage-ef66e.firebaseapp.com",
  projectId: "loginpage-ef66e",
  storageBucket: "loginpage-ef66e.appspot.com",
  messagingSenderId: "631574972937",
  appId: "1:631574972937:web:f3833088ec16d8505206d8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Session persistence set to browser session.");
  })
  .catch((error) => {
    console.error("Error setting session persistence:", error);
  });
