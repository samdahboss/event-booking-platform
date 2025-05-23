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
    if (localStorage.getItem("events")) {
      return JSON.parse(localStorage.getItem("events")); // Return events from local storage if available
    }

    // Fetch events data from the JSON file
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

// Function to fetch organizers data from json file and store it in local storage if it's not already there
export const storeInitialOrganizers = async () => {
  try {
    if (localStorage.getItem("organizers")) {
      return; // Return if organizers from local storage is available
    }

    // Fetch organizers data from the JSON file
    const response = await fetch("../data/organizers.json");
    if (!response.ok) {
      throw new Error("Failed to fetch organizers data");
    }

    const result = await response.json();
    localStorage.setItem("organizers", JSON.stringify(result)); // Store organizers in local storage
  } catch (error) {
    console.error("Error fetching events:", error);
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
  const isSignedIn = localStorage.getItem("loggedInOrganizerId") ? true : false;
  setTimeout(() => {
    const navAuthBtn = document.getElementById("nav-auth-btn");
    const dashboardLink = document.getElementById("dashboard-link");

    if (isSignedIn) {
      navAuthBtn.innerHTML = `<i class="fas fa-bolt"></i>Sign Out`;
      navAuthBtn.onclick = function () {
        localStorage.removeItem("loggedInOrganizerId");
        window.location.reload();
      };

      dashboardLink.classList.add("d-block");
    } else {
      navAuthBtn.innerHTML = `<i class="fas fa-bolt"></i>Become A Host`;
      navAuthBtn.onclick = function () {
        window.location.href = "/auth.html";
        localStorage.removeItem("loggedInOrganizerId");
      };

      dashboardLink.classList.add("d-none");
    }
  }, 2000);
};

export function showToast(message, type = "info") {
  Toastify({
    text: message,
    duration: 3000, // Duration in milliseconds
    close: true, // Show close button
    gravity: "top", // Position: "top" or "bottom"
    position: "right", // Position: "left", "center", or "right"
    backgroundColor:
      type === "success"
        ? "green"
        : type === "error"
          ? "red"
          : type === "warning"
            ? "orange"
            : "blue", // Set color based on type
    stopOnFocus: true, // Prevents dismissing on hover
  }).showToast();
}

export const generateId = async() => {
  const allEvents = await fetchEvents(); // Fetch all events from local storage
  let newId;
  do {
    newId = "event-" + Math.floor(Math.random() * 100000); // Generate a random ID
  } while (allEvents.some((event) => event.eventId === newId)); // Check if the ID already exists
  return newId;
};

export function formatDate(dateString) {
  const date = new Date(dateString);

  // Days and months arrays
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract components
  const dayName = days[date.getDay()]; // Day of the week
  const day = date.getDate(); // Day of the month
  const month = months[date.getMonth()]; // Month name
  const year = date.getFullYear(); // Year
  const hours = String(date.getHours()).padStart(2, "0"); // Hours (2 digits)
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Minutes (2 digits)

  // Format the date
  return `${dayName} - ${day} ${month} ${year} - ${hours}:${minutes}`;
}

export const parseCustomDate = (dateString) => {
  // Remove the day of the week (e.g., "Tuesday - ")
  const withoutDay = dateString.replace(/^[A-Za-z]+\s-\s/, "");

  // Remove ordinal suffixes (e.g., "22nd" -> "22")
  const withoutSuffix = withoutDay.replace(/(\d+)(st|nd|rd|th)/, "$1");

  //Remove Time (e.g., "-22:00" -> "")
  const withoutTime = withoutSuffix.replace(/-\s*\d{2}:\d{2}$/, "").trim();

  // Rearrange the date string to "Month dd, yyyy"
  const formattedDate = withoutTime.replace(
    /^(\d+)\s(\w+)\s(\d{4})$/,
    "$2 $1, $3"
  );

  // Convert to a standard date format
  const standardDate = new Date(formattedDate);

  // Return the parsed Date object
  return standardDate;
};

export const validateForm = (requiredFields) => {
  let isValid = true;
  requiredFields.forEach((field) => {
    const input = document.getElementById(field);
    if (input.value.trim() === "") {
      isValid = false;
      input.classList.add("is-invalid");
    } else {
      input.classList.remove("is-invalid");
    }
  });
  return isValid;
};
