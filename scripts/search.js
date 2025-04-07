import {
  fetchEvents,
  getComponents,
  getQueryParam,
  hasQueryParam,
  hidePreloader,
  handleAuth,
} from "./utils.js"; // Import utility functions

import { renderCards } from "./cards.js"; // Import the renderCards function

import {
  filterEvents,
  getFilterPreferences,
  resetFilterPreference,
  applyFilter,
} from "./filters.js"; // Import the filtering logic function

const preloader = document.getElementById("preloader");
preloader.style.display = "none"; //hide preloader in development

hidePreloader(); // Call the function to hide the preloader
getComponents(); // Call the function to get Navbar and Footer components
handleAuth(); // Call the function to handle authentication

// Function to toggle mobile filter menu
(() => {
  const filterClose = document.querySelector(".filter-close-btn");
  const filterShowBtn = document.querySelector(".show-filter-btn");
  const filterMenu = document.querySelector(".search-sidebar-content");
  const filterMenuContainer = document.querySelector(".filter-panel");
  const body = document.querySelector("body");

  filterClose.addEventListener("click", () => {
    filterMenu.classList.remove("active"); // Hide the filter menu
    filterClose.classList.remove("active");
    filterShowBtn.classList.add("active");
    filterMenuContainer.classList.remove("active");
    body.classList.remove("overflow-hidden"); // Remove overflow hidden class from body
  });

  filterShowBtn.addEventListener("click", () => {
    filterMenuContainer.classList.add("active");
    filterMenu.classList.add("active"); // Show the filter menu
    filterShowBtn.classList.remove("active");
    filterClose.classList.add("active");
    body.classList.add("overflow-hidden"); // Add overflow hidden class to body
  });
})();

// Function to search events based on title, location and description
const searchEvents = async (query) => {
  const events = JSON.parse(localStorage.getItem("events"));
  const searchResults = events.filter((event) => {
    return (
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())
    );
  });
  return searchResults;
};
// Function to handle search functionality
// This function is responsible for searching events based on user input
setTimeout(() => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-btn");
  const searchForm = document.querySelector("#search-form");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim(); // Get the search query

    searchFilterRender(query);
  });

  const searchFilterRender = async (query) => {
    if (query === "") {
      renderCards([], query);
      return; // Do nothing if the input is empty
    }
    const searchResults = await searchEvents(query); // Fetch events from local storage
    const filteredEvents = await filterEvents(searchResults); // Filter events based on user preferences
    localStorage.setItem("matchingEvents", JSON.stringify(filteredEvents)); // Store matching events in local storage
    renderCards(filteredEvents, query); // Render the filtered events
  };

  // Example usage
  if (hasQueryParam("query")) {
    const query = getQueryParam("query"); // Get the value of the 'query' parameter
    searchFilterRender(query); // Call the search filter and render function
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission

    const query = searchInput.value.trim(); // Get the search query

    searchFilterRender(query); // Call the search filter and render function
  });

  searchButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission

    const query = searchInput.value.trim(); // Get the search query

    searchFilterRender(query); // Call the search filter and render function
  });
}, 1000);

getFilterPreferences(); // Call the function to get filter preferences
resetFilterPreference(); // Call the function to add reset functionality to button
applyFilter(); // Call the function to add  apply filter functionality to button

// Function to check if events are already in local storage
const checkLocalStorage = () => {
  const allEvents = JSON.parse(localStorage.getItem("events"));

  if (!allEvents) {
    fetchEvents() // Fetch events from JSON file and store in local storage if there are none
      .then((events) => {
        localStorage.setItem("matchingEvents", JSON.stringify(events)); // Store matching events in local storage
        renderCards(events); // Render events after fetching
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    localStorage.setItem("matchingEvents", JSON.stringify(allEvents)); // Store matching events in local storage
    renderCards(allEvents); // Render all events on page load
  }
};
checkLocalStorage(); // Call the function to check local storage
