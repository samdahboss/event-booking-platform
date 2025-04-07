import { fetchEvents, handleAuth } from "./utils.js";
handleAuth();

// Function to fetch organizers data from json file and store it in local storage if it's not already there
const storeInitialOranizers = async () => {
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
storeInitialOranizers();

// Fetching the logged-in organizer's data from localStorage
const organizers = JSON.parse(localStorage.getItem("organizers")) || [];
const loggedInId = JSON.parse(localStorage.getItem("loggedInOrganizerId"));

// Fetching all events from localStorage
let allEvents;
const getAllEvents = async () => {
  allEvents = await fetchEvents();
};
getAllEvents();

//Importing the Event Modal from the components folder
const getEventModal = async () => {
  const modalContainer = document.getElementById("addEventModal"); // Select the modal container element

  // Fetch the modal HTML and add it to the modal container
  try {
    const modal = await fetch("./components/add-events-modal.html");
    const modalText = await modal.text();
    modalContainer.innerHTML = modalText;
  } catch (err) {
    console.error("Error fetching modal:", err);
  }
};
getEventModal();

// Event listener for the sidebar toggle button
const toggleSidebarBtns = document.querySelectorAll(".toggle-sidebar");
const sidebar = document.getElementById("sidebar");
const body = document.body;
toggleSidebarBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!sidebar.classList.contains("show")) {
      body.style.overflowY = "hidden";
    } else {
      body.style.overflowY = "auto"; // Restore scrolling
    }
    sidebar.classList.toggle("show");
  });
});

//Get the logged-in organizer's data
const currentOrganizer = organizers.find(
  (organizer) => organizer.id === loggedInId
);

// Check if the organizer is logged in
if (!currentOrganizer) {
  alert("You're not logged in as an organizer!");
  window.location.href = "/index.html";
}

//Getting the logged-in organizer's Events
async function getCurrentOrganizerEvent() {
  const events = await fetchEvents();
  return events.filter((e) => e.organizerId === currentOrganizer.id);
}

// Display the organizer's name and email in the dashboard
document.getElementById("organizerName").innerText = currentOrganizer.name;
document.getElementById("organizerEmail").innerText = currentOrganizer.email;

//Add Event Feature for Organizers
const showAddEventModal = document.getElementById("add-event-btn");
showAddEventModal.addEventListener("click", () => {
  // Show the modal
  const eventModal = new bootstrap.Modal(
    document.getElementById("addEventModal")
  );
  eventModal.show();

  const addEventBtn = document.getElementById("addEventButton");
  addEventBtn.addEventListener("click", () => addEvent());
});
const addEvent = () => {
  const formData = {
    title: document.getElementById("eventTitle").value.trim(),
    description: document.getElementById("eventDescription").value.trim(),
    date: document.getElementById("eventDate").value.trim(),
    location: document.getElementById("eventLocation").value.trim(),
    price: document.getElementById("eventPrice").value.trim(),
    category: document.getElementById("eventCategory").value.trim(),
    imageUrl: document.getElementById("eventImage").value.trim(),
    totalSeats: document.getElementById("totalSeats").value.trim(),
  };

  console.log(formData);

  const generateId = () => {
    return "event-" + allEvents.length;
  };
  const newEvent = {
    eventId: generateId(),
    organizerId: currentOrganizer.id,
    organizerName: currentOrganizer.name,
    registeredUsers: [],
    title: formData.title,
    date: "Monday - 31st March 2025 - 22:00",
    location: formData.location,
    price: "$" + formData.price,
    followers: "23.5k",
    attendees: 0,
    description: formData.description,
    category: formData.category,
    image: formData.imageUrl,
    totalSeatsAvailable: formData.totalSeats,
    seatsBooked: 0,
  };

  allEvents.push(newEvent);
  localStorage.setItem("events", JSON.stringify(allEvents));

  // Update organizer's own data too
  currentOrganizer.events.push(newEvent);
  const orgIndex = organizers.findIndex((o) => o.id === currentOrganizer.id);
  organizers[orgIndex] = currentOrganizer;
  localStorage.setItem("organizers", JSON.stringify(organizers));

  renderDashboard();
};

function deleteEvent(eventId) {
  let events = JSON.parse(localStorage.getItem("events")) || [];
  events = events.filter((e) => e.eventId !== eventId);
  localStorage.setItem("events", JSON.stringify(events));

  const orgIndex = organizers.findIndex((o) => o.id === currentOrganizer.id);
  if (orgIndex !== -1) {
    organizers[orgIndex].events = organizers[orgIndex].events.filter(
      (e) => e.id !== eventId
    );
    localStorage.setItem("organizers", JSON.stringify(organizers));
  }

  renderDashboard();
}

function editEvent(eventId) {
  // Placeholder - link to edit page or open a modal
  alert("Edit functionality is not implemented yet.");
}

window.editEvent = editEvent;
window.deleteEvent = deleteEvent;

//Function to render the dashboard
async function renderDashboard() {
  const table = document.getElementById("eventsTable");
  table.innerHTML = "";

  const events = await getCurrentOrganizerEvent();

  // Stats
  document.getElementById("totalEvents").innerText = events.length;
  document.getElementById("totalUsers").innerText = events.reduce(
    (a, b) => a + b.registeredUsers.length,
    0
  );
  document.getElementById("topEvent").innerText =
    events.sort(
      (a, b) => b.registeredUsers.length - a.registeredUsers.length
    )[0]?.title || "N/A";

  events.forEach((event) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${event.title}</td>
        <td>${event.date}</td>
        <td>${event.registeredUsers.length}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editEvent('${event.eventId}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteEvent('${event.eventId}')">Delete</button>
        </td>
      `;

    table.appendChild(row);
  });
}
renderDashboard();
