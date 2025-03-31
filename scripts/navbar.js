const isSignedIn = localStorage.getItem("currentUser") ? true : false;
setTimeout(() => {
  const navAuthBtn = document.getElementById("nav-auth-btn");

  if (isSignedIn) {
    navAuthBtn.innerHTML = `<i class="fas fa-bolt"></i>Sign Out`;
    navAuthBtn.onclick = function () {
      localStorage.removeItem("currentUser");
      window.location.reload();
    };
  } else {
    navAuthBtn.innerHTML = `<i class="fas fa-bolt"></i>Sign In`;
    navAuthBtn.onclick = function () {
      window.location.href = "auth.html";
    };
  }
}, 1000);
