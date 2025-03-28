document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("header");
  const getNavBar = async () => {
    try {
      const navbar = await fetch("./components/navbar.html");
      const navbarText = await navbar.text();
      header.innerHTML = navbarText;
    } catch (err) {
      console.error("Error fetching navbar:", err);
    }
  };

  getNavBar();
});
