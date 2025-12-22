document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const directionEl = document.getElementById("direction");
  const pairEl = document.getElementById("pair");
  const entryEl = document.getElementById("entry");
  const slEl = document.getElementById("sl");
  const tpEl = document.getElementById("tp");
  const sessionEl = document.getElementById("session");
  const confidenceEl = document.getElementById("confidence");
  const reasoningEl = document.getElementById("reasoning");

  async function loadSignal() {
    try {
      const signal = await apiRequest("/api/signal", "GET", null, token);

      directionEl.textContent = signal.direction;
      directionEl.className = "direction " + (signal.direction === "BUY" ? "buy" : "sell");

      pairEl.textContent = `${signal.pair} · ${signal.timeframe}`;

      entryEl.textContent = signal.entry;
      slEl.textContent = signal.stopLoss;
      tpEl.textContent = signal.takeProfit;

      sessionEl.textContent = signal.session;
      confidenceEl.textContent = `${Math.round(signal.confidence * 100)}%`;

      reasoningEl.textContent = signal.reasoning;

    } catch (err) {
      directionEl.textContent = "NO SIGNAL";
      reasoningEl.textContent = "Unable to fetch signal at this time.";
    }
  }

  document.getElementById("refresh").onclick = loadSignal;

  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };

  loadSignal();
});
