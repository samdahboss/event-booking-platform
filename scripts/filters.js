// Description: This file contains the filtering logic for the events based on user preferences. It includes functions to filter events by date, price, and category, as well as functions to get and reset filter preferences from the form inputs.
export const filterPreference = {
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

import { renderCards } from "./cards.js"; // Import the renderCards function to display filtered events

//FILTERING LOGIC
// Function to get filter preferences from the form inputs
export const filterEvents = async (events) => {
  const dateFilter = () => {
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

export const getFilterPreferences = () => {
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

export const resetFilterPreference = () => {
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
    localStorage.setItem("matchingEvents", JSON.stringify(allEvents)); // Store all events in local storage
    renderCards(allEvents); // Render all events after resetting filters
  });
};

export const applyFilter = async () => {
  const applyFilterBtn = document.querySelector(".apply-filter");

  applyFilterBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // Prevent form submission
    const matchingEvents = JSON.parse(localStorage.getItem("matchingEvents"));
    const filterMatchingEvents = await filterEvents(matchingEvents); // Filter events based on user preferences

    renderCards(filterMatchingEvents); // Clear previous results
  });
};
