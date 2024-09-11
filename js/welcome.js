import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get("name");

const welcomeMessage = document.getElementById("welcome-message");
welcomeMessage.innerText = `Welcome, ${userName || 'Guest'}!`;

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    window.location.href = "../LoginPage.html"; // Redirect to login page
  } catch (error) {
    console.error("Error logging out:", error);
  }
});
