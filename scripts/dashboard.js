import { handleAuth } from "./utils.js";
handleAuth();

const organizers = JSON.parse(localStorage.getItem("organizers")) || [];
const loggedInId = JSON.parse(localStorage.getItem("loggedInOrganizerId"));
const allEvents = JSON.parse(localStorage.getItem("events")) || [];

const currentOrganizer = organizers.find(
  (organizer) => organizer.id === loggedInId
);

if (!currentOrganizer) {
  alert("You're not logged in as an organizer!");
  window.location.href = "/index.html";
}

document.getElementById("organizerName").innerText = currentOrganizer.name;
document.getElementById("organizerEmail").innerText = currentOrganizer.email;

function getMyEvents() {
  return allEvents.filter((e) => e.organizerId === currentOrganizer.id);
}

function renderDashboard() {
  const table = document.getElementById("eventsTable");
  table.innerHTML = "";

  const events = getMyEvents();

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
          <button class="btn btn-sm btn-info me-1" onclick="viewUsers('${event.id}')">Users</button>
          <button class="btn btn-sm btn-warning me-1" onclick="editEvent('${event.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteEvent('${event.id}')">Delete</button>
        </td>
      `;

    table.appendChild(row);
  });
}

function deleteEvent(eventId) {
  let events = JSON.parse(localStorage.getItem("events")) || [];
  events = events.filter((e) => e.id !== eventId);
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

function viewUsers(eventId) {
  const event = allEvents.find((e) => e.id === eventId);
  if (!event) return alert("Event not found");

  const users = event.registeredUsers;
  if (!users.length) return alert("No users registered yet.");

  let msg = `Registered Users for "${event.name}":\n`;
  users.forEach((u, i) => {
    msg += `${i + 1}. ${u.name} (${u.email})\n`;
  });
  alert(msg);
}

function editEvent(eventId) {
  // Placeholder - link to edit page or open a modal
  alert("Edit functionality is not implemented yet.");
}

function addEvent() {
  // Placeholder - link to event creation page or use prompt
  const name = prompt("Enter Event Name:");
  const date = prompt("Enter Event Date (YYYY-MM-DD):");

  if (!name || !date) return;

  const newEvent = {
    id: Date.now().toString(),
    name,
    date,
    registeredUsers: [],
    organizerId: currentOrganizer.id,
    organizerName: currentOrganizer.name,
  };

  const events = JSON.parse(localStorage.getItem("events")) || [];
  events.push(newEvent);
  localStorage.setItem("events", JSON.stringify(events));

  // Update organizer's own data too
  currentOrganizer.events.push(newEvent);
  const orgIndex = organizers.findIndex((o) => o.id === currentOrganizer.id);
  organizers[orgIndex] = currentOrganizer;
  localStorage.setItem("organizers", JSON.stringify(organizers));

  renderDashboard();
}

renderDashboard();
