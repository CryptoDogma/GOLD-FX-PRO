document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  try {
    const signal = await apiRequest(
      "/api/signal",
      "GET",
      null,
      token
    );

    document.getElementById("signalText").textContent =
      `${signal.direction} ${signal.pair}`;

    document.getElementById("entry").textContent = signal.entry;
    document.getElementById("tp").textContent = signal.takeProfit;
    document.getElementById("sl").textContent = signal.stopLoss;

  } catch (err) {
    document.getElementById("signalText").textContent =
      "Unable to fetch signal";
  }

  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };
});
