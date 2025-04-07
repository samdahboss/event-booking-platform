import { fetchEvents, handleAuth } from "./utils.js";
handleAuth();

// Fetching the logged-in organizer's data from localStorage
const organizers = JSON.parse(localStorage.getItem("organizers")) || [];
const loggedInId = JSON.parse(localStorage.getItem("loggedInOrganizerId"));

//Get the logged-in organizer's data
const currentOrganizer = organizers.find(
  (organizer) => organizer.id === loggedInId
);

// Check if the organizer is logged in
if (!currentOrganizer) {
  //Redirect to login page
  window.location.href = "/auth.html";
} else {
  // Display the organizer's name and email in the dashboard
  document.getElementById("organizerName").innerText = currentOrganizer.name;
  document.getElementById("organizerEmail").innerText = currentOrganizer.email;
}

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

//Getting the logged-in organizer's Events
async function getCurrentOrganizerEvent() {
  const events = await fetchEvents();
  return events.filter((e) => e.organizerId === currentOrganizer.id);
}

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

async function editEvent(eventId) {
  // Placeholder - link to edit page or open a modal
  let events = await fetchEvents();
  const currentEvent = events.find((e) => e.eventId === eventId);
  const currentEventIndex = events.findIndex(
    (event) => event.eventId === eventId
  );

  //Function to set form inputs to previous event data
  const setFormInputs = () => {
    document.getElementById("eventTitle").value = currentEvent.title;
    document.getElementById("eventDescription").value =
      currentEvent.description;
    document.getElementById("eventDate").value = currentEvent.date;
    document.getElementById("eventLocation").value = currentEvent.location;
    document.getElementById("eventPrice").value = currentEvent.price.replace(
      "$",
      ""
    );
    document.getElementById("eventCategory").value = currentEvent.category;
    document.getElementById("eventImage").value = currentEvent.image;

    document.getElementById("totalSeats").value =
      currentEvent.totalSeatsAvailable;
  };
  setFormInputs();

  const eventModal = new bootstrap.Modal(
    document.getElementById("addEventModal")
  );
  eventModal.show();

  const editEventBtn = document.getElementById("addEventButton");
  editEventBtn.textContent = "Save Changes";
  editEventBtn.addEventListener("click", () => saveChanges());

  const saveChanges = () => {
    const formData = {
      eventId: currentEvent.eventId,
      title: document.getElementById("eventTitle").value.trim(),
      description: document.getElementById("eventDescription").value.trim(),
      date: document.getElementById("eventDate").value.trim(),
      location: document.getElementById("eventLocation").value.trim(),
      price: document.getElementById("eventPrice").value.trim(),
      category: document.getElementById("eventCategory").value.trim(),
      imageUrl: document.getElementById("eventImage").value.trim(),
      totalSeats: parseInt(document.getElementById("totalSeats").value.trim()),
    };

    const newEvent = {
      eventId: formData.eventId,
      organizerId: currentOrganizer.id,
      organizerName: currentOrganizer.name,
      registeredUsers: currentEvent.registeredUsers,
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

    allEvents[currentEventIndex] = newEvent;
    localStorage.setItem("events", JSON.stringify(allEvents));

    // Update organizer's own data too
    currentOrganizer.events.push(newEvent);
    const orgIndex = organizers.findIndex((o) => o.id === currentOrganizer.id);
    organizers[orgIndex] = currentOrganizer;
    localStorage.setItem("organizers", JSON.stringify(organizers));

    renderDashboard();
    eventModal.hide()
  };
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
