import { fetchEvents } from "./utils.js";
// Fetching the logged-in organizer's data from localStorage
const organizers = JSON.parse(localStorage.getItem("organizers")) || [];
const loggedInId = JSON.parse(localStorage.getItem("loggedInOrganizerId"));

//Get the logged-in organizer's data
const currentOrganizer = organizers.find(
  (organizer) => organizer.id === loggedInId
);

//Getting the logged-in organizer's Events
async function getCurrentOrganizerEvent() {
  const events = await fetchEvents();
  return events.filter((e) => e.organizerId === currentOrganizer.id);
}

// Process registration data to calculate attendees per event
const processRegistrationData = (registrationData) => {
  const processedData = [];
  for (const [eventName, registrations] of Object.entries(registrationData)) {
    const totalSeats = registrations.reduce((sum, reg) => sum + reg.seats, 0);
    processedData.push({ eventName, attendees: totalSeats });
  }
  return processedData;
};

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

// Initialize Charts
// This function fetches the logged-in organizer's events, processes the registration data, and renders the charts
// It is called when the page loads to display the charts on the dashboard
export async function initCharts() {
  try {
    // Fetch the logged-in organizer's events
    const organizerEvents = await getCurrentOrganizerEvent();

    // Process the registration data for the organizer's events
    const registrationData = {};
    organizerEvents.forEach((event) => {
      registrationData[event.title] = event.registeredUsers || [];
    });

    // Process the registration data to calculate attendees per event
    const processedData = processRegistrationData(registrationData);

    // Render the chart with the processed data
    renderCharts(processedData);
  } catch (error) {
    console.error("Error initializing dashboard:", error);
  }
}
