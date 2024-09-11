import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

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
const nameInput = document.getElementById("userName");
const confirmInput = document.getElementById("confirmPwd");
const registerBtn = document.getElementById("register-btn");

async function userRegister() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();
  const confirmPwd = confirmInput.value.trim();

  document.getElementById("email-error").style.visibility = "hidden";
  document.getElementById("password-error").style.visibility = "hidden";
  document.getElementById("name-error").style.visibility = "hidden";
  document.getElementById("confirm-error").style.visibility = "hidden";

  let hasError = false;
  if (name === "") {
    document.getElementById("name-error").innerText = "User name is required.";
    document.getElementById("name-error").style.visibility = "visible";
    hasError = true;
  }

  if (email === "") {
    document.getElementById("email-error").innerText = "Email is required.";
    document.getElementById("email-error").style.visibility = "visible";
    hasError = true;
  }

  if (password === "") {
    document.getElementById("password-error").innerText =
      "Password is required.";
    document.getElementById("password-error").style.visibility = "visible";
    hasError = true;
  } else if (password.length < 6) {
    document.getElementById("password-error").innerText =
      "Password must be at least six characters.";
    document.getElementById("password-error").style.visibility = "visible";
    hasError = true;
  }

  if (confirmPwd === "") {
    document.getElementById("confirm-error").innerText =
      "Confirm password is required.";
    document.getElementById("confirm-error").style.visibility = "visible";
    hasError = true;
  } else if (password !== confirmPwd) {
    document.getElementById("confirm-error").innerText =
      "Those passwords didn't match. Try again.";
    document.getElementById("confirm-error").style.visibility = "visible";
    hasError = true;
  }

  if (hasError) return;

  registerBtn.disabled = true;
  registerBtn.innerText = "Registering...";

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log("Registration successful:", userCredential.user);

    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: name,
      email: email,
      createdAt: new Date(),
    });

    emailInput.value = "";
    passwordInput.value = "";
    nameInput.value = "";
    confirmInput.value = "";

    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }

    if (Notification.permission === "granted") {
      displayNotification();
    } else {
      console.log("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error during registration:", error); // Log full error
    const errorCode = error.code;
    let emailErrorMessage = "";
    let errorMessage = "";

    switch (errorCode) {
      case "auth/invalid-email":
        emailErrorMessage = "The email address is not valid.";
        break;
      case "auth/email-already-in-use":
        emailErrorMessage = "The email address is already in use.";
        break;
      case "auth/weak-password":
        errorMessage = "The password must be at least six characters.";
        break;
      case "auth/network-request-failed":
        errorMessage = "Network error. Please check your connection.";
        break;
      default:
        errorMessage = "Registration failed. Please try again.";
    }

    document.getElementById("email-error").innerText = emailErrorMessage;
    document.getElementById("email-error").style.visibility = "visible";
    document.getElementById("password-error").innerText = errorMessage;
    document.getElementById("password-error").style.visibility = "visible";
  } finally {
    registerBtn.disabled = false;
    registerBtn.innerText = "Register";
  }
}

async function displayNotification() {
  const reg = await navigator.serviceWorker.getRegistration();
  if (reg) {
    const options = {
      body: "New Register Come In !!",
      icon: "../img/welcome.jpg",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };
    reg.showNotification("Notification", options);
  } else {
    console.error("Service worker not registered properly.");
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function (registration) {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch(function (error) {
      console.error("Service Worker registration failed:", error);
    });
}

document.getElementById("register-btn").addEventListener("click", userRegister);
