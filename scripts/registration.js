import { fetchEvents, showToast } from "./utils.js";
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

  // Add click event listeners to event cards
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

      // Show the modal
      const eventModal = new bootstrap.Modal(
        document.getElementById("eventModal")
      );
      eventModal.show();

      handleFormValidation(currentEvent, allEvents); // Call the function to handle form validation
    });
  });
};

const handleFormValidation = (currentEvent, allEvents) => {
  // Handle form validation and registration
  const registrationForm = document.getElementById("registrationForm");
  const registerButton = document.getElementById("registerButton");
  const eventModalElement = document.getElementById("eventModal");

  // Real-time form validation
  registrationForm.addEventListener("input", (e) => {
    const input = e.target;
    if (input.checkValidity()) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
    }
  });

  // Remove any existing event listeners from the register button
  const newRegisterButton = registerButton.cloneNode(true);
  registerButton.parentNode.replaceChild(newRegisterButton, registerButton);

  // Handle registration button click
  // Add a new event listener to the register button
  newRegisterButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Check if the form is valid
    if (!registrationForm.checkValidity()) {
      registrationForm.classList.add("was-validated");
      return;
    }

    // Get form values
    const userName = document.getElementById("userName").value.trim();
    const userEmail = document.getElementById("userEmail").value.trim();
    const userSeats = parseInt(document.getElementById("userSeats").value, 10);

    // Check seat availability
    if (
      currentEvent.seatsBooked + userSeats >
      currentEvent.totalSeatsAvailable
    ) {
      showToast(
        `Only ${
          currentEvent.totalSeatsAvailable - currentEvent.seatsBooked
        } seats are available for this event.`,
         "warning"
      );
      return;
    }

    // Register the user
    currentEvent.seatsBooked += userSeats;
    showToast(
      `Thank you, ${userName}! You have successfully registered for ${currentEvent.title}.`,
      "success"
    );
    // Save registration info to local storage
    saveRegistrationInfo(currentEvent.title, userName, userEmail, userSeats);

    // Update the event in localStorage
    const eventIndex = allEvents.findIndex(
      (event) => event.title === currentEvent.title
    );
    if (eventIndex !== -1) {
      allEvents[eventIndex] = currentEvent;
      localStorage.setItem("events", JSON.stringify(allEvents));
    }

    // Reset the form and close the modal
    registrationForm.reset();
    registrationForm.classList.remove("was-validated");
    const eventModal = bootstrap.Modal.getInstance(
      document.getElementById("eventModal")
    );
    eventModal.hide();
  });

  // Clear form and validation classes when the modal is hidden
  eventModalElement.addEventListener("hidden.bs.modal", () => {
    registrationForm.reset(); // Reset the form fields
    registrationForm.classList.remove("was-validated"); // Remove validation state
    const inputs = registrationForm.querySelectorAll(".is-valid, .is-invalid");
    inputs.forEach((input) => {
      input.value = ""; // Clear input values
      input.classList.remove("is-valid", "is-invalid"); // Remove validation classes
    });
  });
};

const saveRegistrationInfo = async (
  eventTitle,
  userName,
  userEmail,
  userSeats
) => {
  const events = await fetchEvents(); // Fetch events from local storage
  const eventIndex = events.findIndex((event) => event.title === eventTitle);

  if (eventIndex !== -1) {
    const currentEvent = events[eventIndex];

    // Make sure registeredUsers is an array
    if (!Array.isArray(currentEvent.registeredUsers)) {
      currentEvent.registeredUsers = [];
    }

    const existingRegistration = currentEvent.registeredUsers.find(
      (registration) => registration.email === userEmail
    );

    if (existingRegistration) {
      existingRegistration.seats += userSeats;
    } else {
      currentEvent.registeredUsers.push({
        name: userName,
        email: userEmail,
        seats: userSeats,
        timestamp: new Date().toISOString(),
      });
    }

    // Update seatsBooked
    currentEvent.seatsBooked += userSeats;

    // Save updated event
    events[eventIndex] = currentEvent;
    localStorage.setItem("events", JSON.stringify(events));
  } else {
    console.error("Event not found in local storage.");
  }
};
