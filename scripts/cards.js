import { addRegistrationFeature } from "./utils.js"; // Import utility function

// class to create the search event card
// This class is responsible for creating the event card elements
export class SearchEventCard {
  constructor(event) {
    this.event = event;
  }

  createCardContainer() {
    const card = document.createElement("div");
    card.classList.add("card", "search-event-card", "event-card");
    return card;
  }

  // Method to create the image container with buttons
  createImageContainer() {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("position-relative", "search-img-container");

    const image = document.createElement("img");
    image.src = this.event.image;
    image.classList.add("card-img-top");
    image.alt = "Event Image";

    const buttonsContainer = this.createButtonsContainer();

    imageContainer.appendChild(image);
    imageContainer.appendChild(buttonsContainer);

    return imageContainer;
  }

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
    cardTitle.textContent = this.event.title;
    return cardTitle;
  }

  // Method to create the event details section
  createEventDetails() {
    const eventDetails = document.createElement("div");
    eventDetails.classList.add("d-flex", "flex-column", "event-details");

    const eventTime = document.createElement("p");
    eventTime.classList.add("card-text", "event-time");
    eventTime.textContent = this.event.time;

    const eventLocation = document.createElement("p");
    eventLocation.classList.add("event-location");
    eventLocation.textContent = this.event.location;

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
    organizerName.textContent = this.event.organizer;

    const organizerFollowers = document.createElement("span");
    organizerFollowers.classList.add("text-muted");
    organizerFollowers.textContent = `${this.event.followers} followers`;

    eventOrganizer.appendChild(organizerName);
    eventOrganizer.appendChild(organizerFollowers);

    return eventOrganizer;
  }

  // Method to create the attendees info section
  createAttendeesInfo() {
    const attendeesInfo = document.createElement("p");
    attendeesInfo.classList.add("text-muted");
    attendeesInfo.innerHTML = `<span>${this.event.attendees} people</span> are attending this event.`;
    return attendeesInfo;
  }

  // Method to create the card description
  createCardDescription() {
    const cardDescription = document.createElement("p");
    cardDescription.classList.add("card-description", "text-muted");
    cardDescription.textContent = this.event.description;
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

// Function to render event cards on the page
export const renderCards = async (events, query) => {
  const searchResults = document.querySelector(".search-results");
  searchResults.innerHTML = ""; // Clear previous results

  if (events.length === 0) {
    searchResults.innerHTML = `<p class="text-center my-auto">No results found for "${query || ""}" that matches the specified criteria.</p>`;
    return;
  }

  events.forEach((event) => {
    const newResult = new SearchEventCard(event);

    searchResults.appendChild(newResult.createEventCard());
  });

  addRegistrationFeature(); // Add registration feature to the cards
};