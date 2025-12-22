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

  // Analysis elements
  const trendStrengthEl = document.getElementById("trendStrength");
  const trendAgeEl = document.getElementById("trendAge");
  const volatilityEl = document.getElementById("volatility");
  const qualityGradeEl = document.getElementById("qualityGrade");
  const qualityScoreEl = document.getElementById("qualityScore");

  // ✅ HISTORY LOADER (CORRECT SCOPE)
  async function loadHistory() {
    try {
      const container = document.getElementById("history");
      if (!container) {
        console.error("History container not found");
        return;
      }

      const history = await apiRequest("/api/history", "GET", null, token);
      console.log("History response:", history);

      if (!Array.isArray(history) || history.length === 0) {
        container.innerHTML = `
          <p style="color:#9ca3af; font-size:14px;">
            Signal history will appear here as new signals are generated.
          </p>
        `;
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

  // ✅ SIGNAL LOADER
  async function loadSignal() {
    try {
      const signal = await apiRequest("/api/signal", "GET", null, token);

      directionEl.textContent = signal.direction;
      directionEl.className =
        "direction " + (signal.direction === "BUY" ? "buy" : "sell");

      pairEl.textContent = `${signal.pair} · ${signal.timeframe}`;

      entryEl.textContent = signal.entry;
      slEl.textContent = signal.stopLoss;
      tpEl.textContent = signal.takeProfit;

      sessionEl.textContent = signal.session;
      confidenceEl.textContent = `${Math.round(signal.confidence * 100)}%`;

      reasoningEl.textContent = signal.reasoning;

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
    }
  }

  // Buttons
  document.getElementById("refresh").onclick = () => {
    loadSignal();
    loadHistory();
  };

  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };

  // Initial load
  loadSignal();
  loadHistory();
});
