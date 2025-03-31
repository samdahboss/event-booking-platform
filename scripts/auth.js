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
toggleForm(); // Initialize the form state

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
  const getUsers = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
  };

  const users = getUsers();
  const isExistingUser = users.some((user) => user.email === email);

  if (isExistingUser) {
    alert("An account with this email already exists.");
    return;
  }

  // Add the new user to local storage
  const setUsers = (user) => {
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  };

  setUsers({
    email,
    password,
    name,
  });

  alert("Sign-up successful!");
  // Simulate a successful sign-up
  window.location.href = "/index.html";
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
  const getUsers = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users;
  };

  const users = getUsers();
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    alert("Invalid email or password.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user)); // Store the current user in local storage

  alert("Sign-in successful!");
  // Simulate a successful sign-in
  window.location.href = "/index.html";
}

const signInButton = document.querySelector(".sign-in-btn");
signInButton.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default form submission
  signIn();
});
