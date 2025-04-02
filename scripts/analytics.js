import { getComponents, handleAuth } from "./utils.js";
getComponents();
handleAuth();

// Initialize the search button and input field after a delay to ensure they are available in the DOM
// This is important if the elements are dynamically loaded or if there are any rendering delays
setTimeout(() => {
  const searchButton = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");

  const searchForm = document.getElementById("search-form");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission

    const query = searchInput.value.trim(); // Get the search query

    // Redirect to the search page with the query as a URL parameter
    window.location.href = `../search.html?query=${encodeURIComponent(query)}`;
  });

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim(); // Get the search query

    // Redirect to the search page with the query as a URL parameter
    window.location.href = `../search.html?query=${encodeURIComponent(query)}`;

    searchInput.value = ""; // Clear the search input field
  });
}, 1000); // Delay the event listener attachment by 1 seconds

// Fetch registration data from local storage
const getRegistrationData = () => {
  const data = JSON.parse(localStorage.getItem("registrations"));
  return data || {};
};

// Fetch event data from local storage
const getEventData = () => {
  const data = JSON.parse(localStorage.getItem("events"));
  return data || [];
};

// Process registration data to calculate attendees per event
const processRegistrationData = (registrationData) => {
  const processedData = [];
  for (const [eventName, registrations] of Object.entries(registrationData)) {
    const totalSeats = registrations.reduce((sum, reg) => sum + reg.seats, 0);
    processedData.push({ eventName, attendees: totalSeats });
  }
  return processedData;
};

// Calculate basic statistics
function calculateStatistics(data) {
  const totalEvents = data.length;
  const totalAttendees = data.reduce((sum, event) => sum + event.attendees, 0);
  const averageAttendees =
    totalEvents > 0 ? (totalAttendees / totalEvents).toFixed(2) : 0;
  return { totalEvents, totalAttendees, averageAttendees };
}

// Calculate additional statistics
function calculateAdditionalStatistics(eventData) {
  const totalSeatsAvailable = eventData.reduce(
    (sum, event) => sum + event.totalSeatsAvailable,
    0
  );
  const totalSeatsBooked = eventData.reduce(
    (sum, event) => sum + event.seatsBooked,
    0
  );
  const bookingPercentage =
    totalSeatsAvailable > 0
      ? ((totalSeatsBooked / totalSeatsAvailable) * 100).toFixed(2)
      : 0;
  return { totalSeatsAvailable, totalSeatsBooked, bookingPercentage };
}

// Render statistics in the dashboard
function renderStatistics(stats) {
  document.getElementById("total-events").textContent = stats.totalEvents;
  document.getElementById("total-attendees").textContent = stats.totalAttendees;
  document.getElementById("average-attendees").textContent =
    stats.averageAttendees;
}

// Render additional statistics in the dashboard
function renderAdditionalStatistics(stats) {
  document.getElementById("total-seats-available").textContent =
    stats.totalSeatsAvailable;
  document.getElementById("total-seats-booked").textContent =
    stats.totalSeatsBooked;
  document.getElementById("booking-percentage").textContent =
    `${stats.bookingPercentage}%`;
}

// Render charts using Chart.js
function renderCharts(data) {
  const ctx = document.getElementById("eventChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((event) => event.eventName),
      datasets: [
        {
          label: "Attendees",
          data: data.map((event) => event.attendees),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Initialize dashboard
function initDashboard() {
  const registrationData = getRegistrationData();
  const processedData = processRegistrationData(registrationData);
  const stats = calculateStatistics(processedData);
  renderStatistics(stats);

  const eventData = getEventData();
  const additionalStats = calculateAdditionalStatistics(eventData);
  renderAdditionalStatistics(additionalStats);

  renderCharts(processedData);
}

// Run initialization on page load
document.addEventListener("DOMContentLoaded", initDashboard);
