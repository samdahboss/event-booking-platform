// Utility functions for the application
// This file contains various utility functions that are used throughout the application
// such as fetching data, handling authentication, and managing query parameters

//Function to get the Navbar and Footer and add it to Page
// This function fetches the HTML for the navbar and footer from separate files
export const getComponents = () => {
  //Function to get Navbar and add it to Page
  const getNavBar = async () => {
    const header = document.getElementById("header");
    try {
      const navbar = await fetch("./components/navbar.html");
      const navbarText = await navbar.text();
      header.innerHTML = navbarText;
    } catch (err) {
      console.error("Error fetching navbar:", err);
    }
  };
  getNavBar();

  //Function to get Footer and add it to Page
  const getFooter = async () => {
    const footer = document.getElementById("footer");
    try {
      const footerMarkup = await fetch("./components/footer.html");
      const footerMarkupText = await footerMarkup.text();
      footer.innerHTML = footerMarkupText;
    } catch (err) {
      console.error("Error fetching navbar:", err);
    }
  };
  getFooter();
};

// Function to show the preloader while the page is loading
export function hidePreloader() {
  // Function to hide the preloader after 5seconds
  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    preloader.style.display = "none"; // Hide the preloader
  }, 5000);
}

// Function to fetch events data from json file and store it in local storage if it's not already there
export const fetchEvents = async () => {
  try {
    const response = await fetch("../data/events.json");
    if (!response.ok) {
      throw new Error("Failed to fetch events data");
    }
    const result = await response.json();
    localStorage.setItem("events", JSON.stringify(result.events)); // Store events in local storage
    return JSON.parse(localStorage.getItem("events")); // Return the events data
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // Return an empty array on error
  }
};

// Function to check if a specific query parameter exists in the URL
export const hasQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(param); // Returns true if the parameter exists, false otherwise
};

// Function to get the value of a specific query parameter from the URL
// This function is useful for extracting information from the URL, such as search terms or filters
export const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param); // Returns the value of the parameter or null if it doesn't exist
};

// Function to handle authentication button in the navbar
// This function checks if the user is signed in or not and updates the button accordingly
export const handleAuth = () => {
  const isSignedIn = localStorage.getItem("currentUser") ? true : false;
  setTimeout(() => {
    const navAuthBtn = document.getElementById("nav-auth-btn");

    if (isSignedIn) {
      navAuthBtn.innerHTML = `<i class="fas fa-bolt"></i>Sign Out`;
      navAuthBtn.onclick = function () {
        localStorage.removeItem("currentUser");
        window.location.reload();
      };
    } else {
      navAuthBtn.innerHTML = `<i class="fas fa-bolt"></i>Sign In`;
      navAuthBtn.onclick = function () {
        window.location.href = "auth.html";
      };
    }
  }, 5000);
};
