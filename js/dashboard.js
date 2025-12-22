document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const AUTO_REFRESH_SECONDS = 300; // 5 minutes
  const activeStrategyEl = document.getElementById("activeStrategy");
  const directionEl = document.getElementById("direction");
  const pairEl = document.getElementById("pair");
  const entryEl = document.getElementById("entry");
  const slEl = document.getElementById("sl");
  const tpEl = document.getElementById("tp");
  const sessionEl = document.getElementById("session");
  const confidenceEl = document.getElementById("confidence");
  const reasoningEl = document.getElementById("reasoning");

  const trendStrengthEl = document.getElementById("trendStrength");
  const trendAgeEl = document.getElementById("trendAge");
  const volatilityEl = document.getElementById("volatility");
  const qualityGradeEl = document.getElementById("qualityGrade");
  const qualityScoreEl = document.getElementById("qualityScore");
  const strategyEl = document.getElementById("strategy");

  const refreshBtn = document.getElementById("refresh");
  const cooldownEl = document.getElementById("cooldown");

  let cooldown = 0;
  let timer = null;

  // ─────────────────────────────────────────────
  // HISTORY (BACKWARD-COMPATIBLE)
  async function loadHistory() {
    try {
      const container = document.getElementById("history");
      if (!container) return;

      const history = await apiRequest("/api/history", "GET", null, token);

      if (!Array.isArray(history) || history.length === 0) {
        container.innerHTML =
          "<p style='color:#9ca3af;font-size:14px;'>Signal history will appear here.</p>";
        return;
      }

      container.innerHTML = history.map(sig => {
        const grade =
          sig.analysis?.qualityGrade ??
          sig.quality?.grade ??
          "—";

        const score =
          sig.analysis?.qualityScore ??
          sig.quality?.score ??
          null;

        return `
          <div style="padding:10px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;font-size:14px;">
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
              <strong>${grade}</strong>
              ${score !== null ? `(${Math.round(score * 100)}%)` : ""}<br/>
              <span style="color:#9ca3af">${sig.session}</span>
            </div>
          </div>
        `;
      }).join("");

    } catch (err) {
      console.error("History load error:", err);
    }
  }

  // ─────────────────────────────────────────────
  // SIGNAL
  async function loadSignal() {
    try {
      const signal = await apiRequest("/api/signal", "GET", null, token);

      // 🚫 NO TRADE / WAIT STATES
      if (signal.status && signal.status !== "TRADE") {
        directionEl.textContent = signal.status.replace("_", " ");
        directionEl.className = "direction";
        pairEl.textContent = "XAUUSD · M15";
        reasoningEl.textContent = signal.reason || "No trade conditions met";

        entryEl.textContent = "—";
        slEl.textContent = "—";
        tpEl.textContent = "—";
        confidenceEl.textContent = "—";
        sessionEl.textContent = signal.session || "—";

        trendStrengthEl.textContent = "—";
        trendAgeEl.textContent = "—";
        volatilityEl.textContent = signal.volatility || "—";
        qualityGradeEl.textContent = "—";
        qualityScoreEl.textContent = "—";

        if (strategyEl) strategyEl.textContent = signal.strategy || "—";

        if (activeStrategyEl) {
        activeStrategyEl.textContent = signal.strategy
        ? signal.strategy.toUpperCase()
        : "—";
     }
        return;
      }

      // ✅ TRADE STATE
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

      trendStrengthEl.textContent = signal.analysis?.trendStrength ?? "—";
      trendAgeEl.textContent = signal.analysis?.trendAge ?? "—";
      volatilityEl.textContent = signal.analysis?.volatility ?? "—";
      qualityGradeEl.textContent = signal.analysis?.qualityGrade ?? "—";
      qualityScoreEl.textContent =
        signal.analysis?.qualityScore != null
          ? Math.round(signal.analysis.qualityScore * 100) + "%"
          : "—";

      if (strategyEl) strategyEl.textContent = signal.strategy ?? "—";

      if (activeStrategyEl) {
      activeStrategyEl.textContent = signal.strategy.toUpperCase();
}

    } catch (err) {
      console.error("Signal load error:", err);
    }
  }

  // ─────────────────────────────────────────────
  // COOLDOWN TIMER
  function startCooldown() {
    cooldown = AUTO_REFRESH_SECONDS;
    refreshBtn.disabled = true;

    if (timer) clearInterval(timer);

    timer = setInterval(() => {
      cooldown--;

      const mins = Math.floor(cooldown / 60);
      const secs = cooldown % 60;
      cooldownEl.textContent =
        `Next update in ${mins}:${secs.toString().padStart(2, "0")}`;

      if (cooldown <= 0) {
        clearInterval(timer);
        refreshBtn.disabled = false;
        cooldownEl.textContent = "Updating…";
        triggerRefresh();
      }
    }, 1000);
  }

  // ─────────────────────────────────────────────
  function triggerRefresh() {
    loadSignal();
    loadHistory();
    startCooldown();
  }

  refreshBtn.onclick = triggerRefresh;

  document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };

  // ─────────────────────────────────────────────
  // INITIAL LOAD
  loadSignal();
  loadHistory();
  startCooldown();
});


