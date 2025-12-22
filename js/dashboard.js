document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // Protect dashboard
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  // Placeholder signal (UI only for now)
  document.getElementById("signalText").textContent = "WAITING FOR SIGNAL";
  document.getElementById("entry").textContent = "-";
  document.getElementById("tp").textContent = "-";
  document.getElementById("sl").textContent = "-";

  // Logout
  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };
});
