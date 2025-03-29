// Function to hide the preloader after 5seconds
setTimeout(() => {
    const preloader = document.getElementById("preloader");
    preloader.style.display = "none"; // Hide the preloader
  }, 5000);
  
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