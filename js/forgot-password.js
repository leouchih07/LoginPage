import { auth, db } from "./firebase-config.js"; // Import Firebase configuration
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const emailInput = document.getElementById("email");
const resetBtn = document.getElementById("reset-btn");
const successMessage = document.getElementById("success-message");
const errorMessage = document.getElementById("error-message");

resetBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  successMessage.innerText = "";
  errorMessage.innerText = "";

  if (email === "") {
    errorMessage.innerText = "Email is required.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    await logPasswordResetAttempt(email);

    successMessage.innerText = `A password reset link has been sent to ${email}.`;
  } catch (error) {
    console.error("Error sending password reset email:", error);

    let errorCode = error.code;
    let errorMsg = "";

    switch (errorCode) {
      case "auth/invalid-email":
        errorMsg = "Invalid email address.";
        break;
      case "auth/user-not-found":
        errorMsg = "No user found with this email.";
        break;
      default:
        errorMsg = "Failed to send reset email. Please try again.";
    }
    errorMessage.innerText = errorMsg;
  }
});

async function logPasswordResetAttempt(email) {
  try {
    const docRef = doc(db, "password_resets", email); // 
    await setDoc(docRef, {
      email: email,
      resetRequestedAt: new Date(),
    });
    console.log("Password reset attempt logged in Firestore.");
  } catch (error) {
    console.error("Error logging password reset attempt:", error);
  }
}
