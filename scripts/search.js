const preloader = document.getElementById("preloader");
preloader.style.display = "none"; //hide reploader in development
// Function to hide the preloader after 5seconds
setTimeout(() => {
  preloader.style.display = "none"; // Hide the preloader
}, 5000);

const getComponents = () => {
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
getComponents();

// Function to create the search event card
// This class is responsible for creating the event card elements
class SearchEventCard {
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
const renderCards = async (events, query) => {
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
};

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

//FILTERING LOGIC
// Function to get filter preferences from the form inputs
const filterPreference = {
  date: "All",
  price: "Both",
  category: {
    "Food & Drink": true,
    Music: true,
    "Visual Arts": true,
    Politics: true,
    Community: true,
  },
};

const getFilterPreferences = () => {
  const dateInputs = document.querySelectorAll(".date-option");
  dateInputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      const value = e.target.value;
      filterPreference.date = value; // Set the selected date
    });
  });

  const priceInputs = document.querySelectorAll(".price-option");
  priceInputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      const value = e.target.value;
      filterPreference.price = value; // Set the selected price range
    });
  });

  const categoryInputs = document.querySelectorAll(".category-option");
  categoryInputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      const selectedValue = e.target.value; // Get the value of the selected checkbox
      filterPreference.category[selectedValue] =
        !filterPreference.category[selectedValue];
    });
  });
};
getFilterPreferences(); // Call the function to get filter preferences

const filterEvents = async (events) => {
  const parseCustomDate = (dateString) => {
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

  const dateFilter = () => {
    return events.filter((event) => {
      const eventDate = parseCustomDate(event.date); // Parse the event date
      const today = new Date(); // Get today's date
      const tomorrow = new Date(today); // Clone today's date
      tomorrow.setDate(today.getDate() + 1); // Add 1 day to get tomorrow

      if (filterPreference.date === "All") {
        return true; // No filter applied
      } else if (filterPreference.date === "today") {
        // Check if the event is happening today
        return (
          eventDate.getDate() === today.getDate() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getFullYear() === today.getFullYear()
        );
      } else if (filterPreference.date === "tommorow") {
        // Check if the event is happening tomorrow
        return (
          eventDate.getDate() === tomorrow.getDate() &&
          eventDate.getMonth() === tomorrow.getMonth() &&
          eventDate.getFullYear() === tomorrow.getFullYear()
        );
      } else if (filterPreference.date === "weekend") {
        // Check if the event is happening on Saturday or Sunday
        const dayOfWeek = eventDate.getDay(); // Get the day of the week (0 = Sunday, 6 = Saturday)
        return (
          (dayOfWeek === 6 || dayOfWeek === 0) && eventDate >= today // Ensure it's in the future
        );
      }
    });
  };

  const priceFilter = () => {
    const formatPrice = (price) => {
      const numericValue = price.replace(/[^0-9.-]+/g, ""); // Remove non-numeric characters
      return parseFloat(numericValue); // Convert to a float
    };

    return events.filter((event) => {
      if (filterPreference.price === "Both") {
        return true; // No filter applied
      } else if (filterPreference.price === "Free") {
        return formatPrice(event.price) === 0; // Only free events
      } else if (filterPreference.price === "Priced") {
        return formatPrice(event.price) > 0; // Only paid events
      }
    });
  };

  const categoryFilter = () => {
    return events.filter((event) => {
      return filterPreference.category[event.category]; // Check if the category is selected
    });
  };

  return events.filter((event) => {
    const isDateMatch = dateFilter().includes(event); // Filter by date
    const isPriceMatch = priceFilter().includes(event); // Filter by price
    const isCategoryMatch = categoryFilter().includes(event); // Filter by category

    return isDateMatch && isPriceMatch && isCategoryMatch; // Return true if all filters match
  });
};

const resetFilterPreference = () => {
  const resetFilterButton = document.querySelector(".reset-btn");
  resetFilterButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent form submission
    filterPreference.date = "All"; // Reset date filter
    filterPreference.price = "Both"; // Reset price filter
    filterPreference.category = {
      "Food & Drink": true,
      Music: true,
      "Visual Arts": true,
      Politics: true,
      Community: true,
    }; // Reset category filter

    const dateInputs = document.querySelectorAll(".date-option");
    dateInputs.forEach((input) => {
      input.checked = false; // Uncheck all date options
      if (input.value === "all") {
        input.checked = true; // Check the "All" option
      }
    });

    const priceInputs = document.querySelectorAll(".price-option");
    priceInputs.forEach((input) => {
      input.checked = false; // Uncheck all price options
      if (input.value === "Both") {
        input.checked = true; // Check the "Both" option
      }
    });

    const categoryInputs = document.querySelectorAll(".category-option");
    categoryInputs.forEach((input) => {
      input.checked = true; // check all category options
    });

    const allEvents = JSON.parse(localStorage.getItem("events"));
    localStorage.setItem("matchingEvents", JSON.stringify(allEvents)); // Store matching events in local storage
    renderCards(allEvents); // Render all events after resetting filters
  });
};
resetFilterPreference(); // Call the function to add reset functionality to button

const applyFilter = async () => {
  const applyFilterBtn = document.querySelector(".apply-filter");
  applyFilterBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent form submission
    const matchingEvents = JSON.parse(localStorage.getItem("matchingEvents"));
    const filterMatchingEvents = await filterEvents(matchingEvents); // Filter events based on user preferences

    renderCards(filterMatchingEvents); // Clear previous results
  });
};
applyFilter(); // Call the function to add event listener to apply filter button

// Function to fetch events data from json file and store it in local storage if it's not already there
const fetchEvents = async () => {
  try {
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
fetchEvents(); // Call the function to fetch events data
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

setTimeout(() => {
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-btn");
  const searchForm = document.querySelector("#search-form");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission
  });

  searchButton.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent form submission
    searchButton.value = "";
    const query = searchInput.value.trim(); // Get the search query
    if (query === "") {
      renderCards([], query);
      return; // Do nothing if the input is empty
    }
    const searchResults = await searchEvents(query); // Fetch events from local storage
    const filteredEvents = await filterEvents(searchResults); // Filter events based on user preferences
    localStorage.setItem("matchingEvents", JSON.stringify(filteredEvents)); // Store matching events in local storage
    renderCards(filteredEvents, query); // Render the filtered events
  });
}, 1000);
