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

  // Analysis elements (NEW)
  const trendStrengthEl = document.getElementById("trendStrength");
  const trendAgeEl = document.getElementById("trendAge");
  const volatilityEl = document.getElementById("volatility");
  const qualityGradeEl = document.getElementById("qualityGrade");
  const qualityScoreEl = document.getElementById("qualityScore");

  async function loadSignal() {
    try {
      const signal = await apiRequest("/api/signal", "GET", null, token);

      //History
     async function loadHistory() {
  try {
    const history = await apiRequest("/api/history", "GET", null, token);
    const container = document.getElementById("history");

    if (!container) {
      console.error("History container not found");
      return;
    }

    if (!history || !history.length) {
      container.innerHTML = `
        <p style="color:#9ca3af; font-size:14px;">
          Signal history will appear here as new signals are generated.
        </p>`;
      return;
    }

    container.innerHTML = history.map(sig => `
      <div style="
        padding:10px;
        border-bottom:1px solid #1f2937;
        font-size:14px;
        display:flex;
        justify-content:space-between;
      ">
        <div>
          <strong style="color:${sig.direction === "BUY" ? "#22c55e" : "#ef4444"}">
            ${sig.direction}
          </strong>
          ${sig.pair} · ${sig.timeframe}<br/>
          <span style="color:#9ca3af">
            ${new Date(sig.timestamp).toLocaleString()}
          </span>
        </div>
        <div style="text-align:right">
          <strong>${sig.quality.grade}</strong>
          (${Math.round(sig.quality.score * 100)}%)<br/>
          <span style="color:#9ca3af">${sig.session}</span>
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error("History load error:", err);
  }
}

      // Direction
      directionEl.textContent = signal.direction;
      directionEl.className =
        "direction " + (signal.direction === "BUY" ? "buy" : "sell");

      // Pair & TF
      pairEl.textContent = `${signal.pair} · ${signal.timeframe}`;

      // Levels
      entryEl.textContent = signal.entry;
      slEl.textContent = signal.stopLoss;
      tpEl.textContent = signal.takeProfit;

      // Meta
      sessionEl.textContent = signal.session;
      confidenceEl.textContent = `${Math.round(signal.confidence * 100)}%`;

      // Reasoning
      reasoningEl.textContent = signal.reasoning;

      // 🔍 Analysis (SAFE + OPTIONAL)
      if (signal.analysis) {
        trendStrengthEl.textContent = signal.analysis.trendStrength || "—";
        trendAgeEl.textContent = signal.analysis.trendAge || "—";
        volatilityEl.textContent = signal.analysis.volatility || "—";

        qualityGradeEl.textContent = signal.analysis.qualityGrade || "—";
        qualityScoreEl.textContent =
          signal.analysis.qualityScore != null
            ? Math.round(signal.analysis.qualityScore * 100) + "%"
            : "—";
      } else {
        trendStrengthEl.textContent = "—";
        trendAgeEl.textContent = "—";
        volatilityEl.textContent = "—";
        qualityGradeEl.textContent = "—";
        qualityScoreEl.textContent = "—";
      }

    } catch (err) {
      console.error("Signal load error:", err);

      directionEl.textContent = "NO SIGNAL";
      directionEl.className = "direction";
      reasoningEl.textContent = "Unable to fetch signal at this time.";

      trendStrengthEl.textContent = "—";
      trendAgeEl.textContent = "—";
      volatilityEl.textContent = "—";
      qualityGradeEl.textContent = "—";
      qualityScoreEl.textContent = "—";
    }
  }

  document.getElementById("refresh").onclick = loadSignal;

  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };

document.getElementById("refresh").onclick = () => {
  loadSignal();
  loadHistory();
};
});




