import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const themeButton = document.getElementById("theme-btn");
let isDarkMode = false;

themeButton.addEventListener("click", () => {
  const body = document.body;
  body.classList.toggle("dark-mode");
  isDarkMode = !isDarkMode;
  themeButton.textContent = isDarkMode ? "☀️ Light Theme" : "🌑 Dark Theme";
});


const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

async function userLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  emailError.style.visibility = 'hidden';
  passwordError.style.visibility = 'hidden';

  let hasError = false;

  if (email === "") {
    emailError.innerText = "Email is required.";
    emailError.style.visibility = 'visible';
    hasError = true;
  }

  if (password === "") {
    passwordError.innerText = "Password is required.";
    passwordError.style.visibility = 'visible';
    hasError = true;
  }

  if (hasError) return;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Login successful:", userCredential.user);

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userName = userDoc.data().name; 

      window.location.href = `welcome.html?name=${encodeURIComponent(userName)}`;
    } else {
      console.error("No user document found!");
    }
  } catch (error) {
    console.error("Firebase error:", error);
    const errorCode = error.code;
    let emailErrorMessage = "";
    let passwordErrorMessage = "";

    switch (errorCode) {
      case "auth/invalid-email":
        emailErrorMessage = "The email address is not valid.";
        break;
      case "auth/user-not-found":
        emailErrorMessage = "No user found with this email.";
        break;
      case "auth/wrong-password":
        passwordErrorMessage = "Incorrect password.";
        break;
      case "auth/network-request-failed":
        passwordErrorMessage = "Network error. Please check your connection.";
        break;
      default:
        passwordErrorMessage = "Login failed. Please try again.";
    }

    if (emailErrorMessage) {
      emailError.innerText = emailErrorMessage;
      emailError.style.visibility = 'visible';
    }

    if (passwordErrorMessage) {
      passwordError.innerText = passwordErrorMessage;
      passwordError.style.visibility = 'visible';
    }
  }
}

loginBtn.addEventListener("click", userLogin);

emailInput.addEventListener("input", () => {
  emailError.style.visibility = 'hidden';
});

passwordInput.addEventListener("input", () => {
  passwordError.style.visibility = 'hidden';
});
