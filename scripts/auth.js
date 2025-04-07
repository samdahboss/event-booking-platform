import { storeInitialOrganizers } from "./utils.js";
storeInitialOrganizers();// Function to fetch organizers data from json file and store it in local storage if it's not already there

function toggleForm() {
  document.getElementById("sign-in").style.display =
    document.getElementById("sign-in").style.display === "none"
      ? "flex"
      : "none";
  document.getElementById("sign-up").style.display =
    document.getElementById("sign-up").style.display === "none"
      ? "flex"
      : "none";
}
// toggleForm(); // Initialize the form state
window.toggleForm = toggleForm;

// Function to handle sign-in
function signUp() {
  const email = document.querySelector(".sign-up-email").value.trim();
  const password = document.querySelector(".sign-up-password").value.trim();
  const name = document.querySelector(".sign-up-name").value.trim();

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return emailRegex.test(email);
  };

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Check if the account already exists
  const getOrganizers = () => {
    const organizers = JSON.parse(localStorage.getItem("organizers")) || [];
    return organizers;
  };

  const organizers = getOrganizers();
  const isExistingorganizer = organizers.some(
    (organizer) => organizer.email === email
  );

  if (isExistingorganizer) {
    alert("An account with this email already exists.");
    return;
  }

  // Add the new organizer to local storage
  const setOrganizers = (organizer) => {
    organizers.push(organizer);
    localStorage.setItem("organizers", JSON.stringify(organizers));
  };
  const generateId = () => {
    return "org-" + (organizers.length + 1); // Simple ID generation logic
  };

  const newOrganizerId = generateId(); // Generate the ID once
  console.log("Generated Organizer ID:", newOrganizerId); // Debugging log
  localStorage.setItem("loggedInOrganizerId", JSON.stringify(newOrganizerId)); // Store the current organizer in local storage
  console.log(
    "Stored loggedInOrganizerId in localStorage:",
    localStorage.getItem("loggedInOrganizerId")
  ); // Debugging log to verify storage
  setOrganizers({
    id: newOrganizerId, // Use the same ID for the organizer
    email,
    password,
    name,
    events: [], // Initialize with an empty events array
  });

  // alert("Sign-up successful!");
  // Simulate a successful sign-up
  window.location.href = "/dashboard.html";
}

const signUpButton = document.querySelector(".sign-up-btn");
signUpButton.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default form submission
  signUp();
});

// Function to handle sign-in
function signIn() {
  const email = document.querySelector(".sign-in-email").value.trim();
  const password = document.querySelector(".sign-in-password").value.trim();

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return emailRegex.test(email);
  };

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Check if the account exists
  const getOrganizers = () => {
    const organizers = JSON.parse(localStorage.getItem("organizers")) || [];
    return organizers;
  };

  const organizers = getOrganizers();
  const organizer = organizers.find(
    (organizer) => organizer.email === email && organizer.password === password
  );

  if (!organizer) {
    alert("Invalid email or password.");
    return;
  }

  localStorage.setItem("loggedInOrganizerId", JSON.stringify(organizer.id)); // Store the current organizer in local storage

  // alert("Sign-in successful!");
  // Simulate a successful sign-in
  window.location.href = "/dashboard.html";
}

const signInButton = document.querySelector(".sign-in-btn");
signInButton.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default form submission
  signIn();
});
