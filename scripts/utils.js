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

//Function to Add Registration Feature to Event Cards
// This function adds a click event listener to each event card
// When a card is clicked, it opens a modal with event details and a registration button
// The modal allows users to register for the event

export const addRegistrationFeature = async () => {
  const modalContainer = document.getElementById("eventModal"); // Select the modal container element

  // Fetch the modal HTML and add it to the modal container
  try {
    const modal = await fetch("./components/registration-modal.html");
    const modalText = await modal.text();
    modalContainer.innerHTML = modalText;

    addRegistrationToCards(); // Call the function to add registration functionality to event cards
  } catch (err) {
    console.error("Error fetching modal:", err);
  }
};

const addRegistrationToCards = async () => {
  const eventCards = document.querySelectorAll(".event-card"); // Select all event cards
  const allEvents = await fetchEvents(); // Fetch all events data
  eventCards.forEach((card) => {
    card.addEventListener("click", () => {
      const eventTitle = card.querySelector(".event-card-title").textContent;
      const currentEvent = allEvents.find(
        (event) => event.title === eventTitle
      ); // Find the clicked event in the events data

      // Populate the modal with event details
      document.getElementById("modalEventTitle").textContent =
        currentEvent.title;
      document.getElementById("modalEventDescription").textContent =
        currentEvent.description;
      document.getElementById("modalEventImage").src = currentEvent.image;
      document.getElementById("modalEventDate").textContent = currentEvent.date;
      document.getElementById("modalEventLocation").textContent =
        currentEvent.location;
      document.getElementById("modalEventHost").textContent = currentEvent.host;
      document.getElementById("modalEventPrice").textContent =
        currentEvent.price;

      // Show the modal
      const eventModal = new bootstrap.Modal(
        document.getElementById("eventModal")
      );
      eventModal.show();
    });
  });

  // Handle registration button click
  const registerButton = document.getElementById("registerButton");
  registerButton.addEventListener("click", () => {
    alert("You have successfully registered for this event!");
    // Add additional registration logic here
  });
};
