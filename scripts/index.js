import {
  getComponents,
  hidePreloader,
  handleAuth,
  fetchEvents,
} from "./utils.js"; // Importing the getComponents function

import { addRegistrationFeature } from "./registration.js";

hidePreloader(); // Call the function to hide the preloader
getComponents(); // Call the function to get Navbar and Footer components
handleAuth(); // Call the function to handle authentication

// Function to get the carousel component and add it to the hero section of the page
const getCarousel = async () => {
  const hero = document.getElementById("hero");
  try {
    const carousel = await fetch("./components/carousel.html");
    const carouselText = await carousel.text();
    hero.innerHTML = carouselText;
  } catch (err) {
    console.error("Error fetching navbar:", err);
  }
};
getCarousel();

// const setOrganizers = async () => {
//   const response = await fetch("../data/organizers.json");
//   const result = await response.json();
  
//   localStorage.setItem("organizers", JSON.stringify(result)); // Store organizers in local storage
// }
// setOrganizers(); // Call the function to set dummy organizers in local storage

// Function to get the categories and populate the category section
class Category {
  constructor(description, imageUrl) {
    this.description = description;
    this.imageUrl = imageUrl;
  }
  createCategory() {
    const category = document.createElement("div");
    category.classList.add("category-item", "mx-auto");

    const categoryImage = document.createElement("img");
    categoryImage.src = this.imageUrl;
    categoryImage.classList.add("category-img", "d-block", "mx-auto");

    const categoryDescription = document.createElement("p");
    categoryDescription.classList.add("text-center");
    categoryDescription.textContent = this.description;

    category.appendChild(categoryImage);
    category.appendChild(categoryDescription);

    return category;
  }
}
const populateCategories = async () => {
  const categoriesContainer = document.getElementById("category-container");

  const getCategories = async () => {
    const categories = await fetch("../data/categories.json");
    const result = await categories.json();
    return result.categories;
  };

  const categories = await getCategories();

  categories.forEach((category) => {
    const newCategory = new Category(category.name, category.image);
    categoriesContainer.appendChild(newCategory.createCategory());
  });
};
populateCategories();

// Function to handle the filter buttons
let filterValue = "All"; // Default filter value

const handleFilterButtons = () => {
  const filterButtons = document.querySelectorAll(".filter-button");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      filterValue = button.textContent;
      populateEvents(); // Call the function to filter events and add them to the page
    });
  });
};

const filterEvents = (events) => {
  if (filterValue === "All") {
    return events.slice(0, 8);
  }
  return events.filter((event) => event.category === filterValue);
};
// Function to get the events and populate the event cards
class EventCard {
  constructor(
    title,
    imageUrl,
    time,
    location,
    organizer,
    followers,
    attendees,
    description
  ) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.time = time;
    this.location = location;
    this.organizer = organizer;
    this.followers = followers;
    this.attendees = attendees;
    this.description = description;
  }

  // Method to create the card container
  createCardContainer() {
    const card = document.createElement("div");
    card.classList.add("card", "event-card");
    return card;
  }

  // Method to create the image container with buttons
  createImageContainer() {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("position-relative");

    const image = document.createElement("img");
    image.src = this.imageUrl;
    image.classList.add("card-img-top");
    image.alt = "Event Image";

    const buttonsContainer = this.createButtonsContainer();

    imageContainer.appendChild(image);
    imageContainer.appendChild(buttonsContainer);

    return imageContainer;
  }

  // Method to create the buttons container
  createButtonsContainer() {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add(
      "position-absolute",
      "top-0",
      "end-0",
      "p-2"
    );

    const shareButton = document.createElement("button");
    shareButton.classList.add("btn", "btn-light");
    shareButton.innerHTML = `<i class="fas fa-share-alt"></i>`;

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("btn", "btn-light");
    favoriteButton.innerHTML = `<i class="far fa-heart"></i>`;

    buttonsContainer.appendChild(shareButton);
    buttonsContainer.appendChild(favoriteButton);

    return buttonsContainer;
  }

  // Method to create the card body
  createCardBody() {
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = this.createCardTitle();
    const eventDetails = this.createEventDetails();
    const attendeesInfo = this.createAttendeesInfo();
    const cardDescription = this.createCardDescription();

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(eventDetails);
    cardBody.appendChild(attendeesInfo);
    cardBody.appendChild(cardDescription);

    return cardBody;
  }

  // Method to create the card title
  createCardTitle() {
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("event-card-title");
    cardTitle.textContent = this.title;
    return cardTitle;
  }

  // Method to create the event details section
  createEventDetails() {
    const eventDetails = document.createElement("div");
    eventDetails.classList.add("d-flex", "flex-column", "event-details");

    const eventTime = document.createElement("p");
    eventTime.classList.add("card-text", "event-time");
    eventTime.textContent = this.time;

    const eventLocation = document.createElement("p");
    eventLocation.classList.add("event-location");
    eventLocation.textContent = this.location;

    const eventOrganizer = this.createEventOrganizer();

    eventDetails.appendChild(eventTime);
    eventDetails.appendChild(eventLocation);
    eventDetails.appendChild(eventOrganizer);

    return eventDetails;
  }

  // Method to create the event organizer section
  createEventOrganizer() {
    const eventOrganizer = document.createElement("p");
    eventOrganizer.classList.add(
      "event-organizer",
      "d-flex",
      "justify-content-between",
      "gap-2"
    );

    const organizerName = document.createElement("span");
    organizerName.classList.add("text-decoration-underline");
    organizerName.textContent = this.organizer;

    const organizerFollowers = document.createElement("span");
    organizerFollowers.classList.add("text-muted");
    organizerFollowers.textContent = `${this.followers} followers`;

    eventOrganizer.appendChild(organizerName);
    eventOrganizer.appendChild(organizerFollowers);

    return eventOrganizer;
  }

  // Method to create the attendees info section
  createAttendeesInfo() {
    const attendeesInfo = document.createElement("p");
    attendeesInfo.classList.add("text-muted");
    attendeesInfo.innerHTML = `<span>${this.attendees} people</span> are attending this event.`;
    return attendeesInfo;
  }

  // Method to create the card description
  createCardDescription() {
    const cardDescription = document.createElement("p");
    cardDescription.classList.add("card-description", "text-muted");
    cardDescription.textContent = this.description;
    return cardDescription;
  }

  // Main method to create the entire event card
  createEventCard() {
    const card = this.createCardContainer();
    const imageContainer = this.createImageContainer();
    const cardBody = this.createCardBody();

    card.appendChild(imageContainer);
    card.appendChild(cardBody);

    return card;
  }
}
// Function to populate the events section
const populateEvents = async () => {
  const events = await fetchEvents();
  const filteredEvents = filterEvents(events);
  renderEvents(filteredEvents); // Call the function to render events
};
//Function to Render Events
const renderEvents = async (events) => {
  const eventsContainer = document.querySelector(".find-events-container");
  eventsContainer.innerHTML = ""; // Clear the container before populating

  if (events.length === 0) {
    eventsContainer.innerHTML = "<p>No events found.</p>";
    return;
  }

  events.forEach((event) => {
    const newEventCard = new EventCard(
      event.title,
      event.image,
      event.date,
      event.location,
      event.organizerName,
      event.followers,
      event.attendees,
      event.description
    );
    eventsContainer.appendChild(newEventCard.createEventCard());
  });

  addRegistrationFeature(); // Call the function to add registration feature
};

populateEvents(); // Initial call to populate events on page load
handleFilterButtons(); // Call the function to handle filter buttons

// Function to handle the search functionality
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
