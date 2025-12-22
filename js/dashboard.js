document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
    return;
  }

  const AUTO_REFRESH_SECONDS = 300; // 5 minutes

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

  const refreshBtn = document.getElementById("refresh");
  const cooldownEl = document.getElementById("cooldown");

  let cooldown = 0;
  let timer = null;

  // ─────────────────────────────────────────────
  // HISTORY
  async function loadHistory() {
    try {
      const container = document.getElementById("history");
      if (!container) return;

      const history = await apiRequest("/api/history", "GET", null, token);

      if (!history || !history.length) {
        container.innerHTML =
          "<p style='color:#9ca3af;font-size:14px;'>Signal history will appear here.</p>";
        return;
      }

      container.innerHTML = history.map(sig => `
        <div style="padding:10px;border-bottom:1px solid #1f2937;display:flex;justify-content:space-between;font-size:14px;">
          <div>
            <strong style="color:${sig.direction === "BUY" ? "#22c55e" : "#ef4444"}">
              ${sig.direction}
            </strong>
            ${sig.pair} · ${sig.timeframe}<br/>
            <span style="color:#9ca3af">${new Date(sig.timestamp).toLocaleString()}</span>
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

  // ─────────────────────────────────────────────
  // SIGNAL
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
        trendStrengthEl.textContent = signal.analysis.trendStrength;
        trendAgeEl.textContent = signal.analysis.trendAge;
        volatilityEl.textContent = signal.analysis.volatility;
        qualityGradeEl.textContent = signal.analysis.qualityGrade;
        qualityScoreEl.textContent =
          Math.round(signal.analysis.qualityScore * 100) + "%";
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
  // REFRESH HANDLER
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
document.getElementById("strategy").textContent = signal.strategy;
  // ─────────────────────────────────────────────
  // INITIAL LOAD
  loadSignal();
  loadHistory();
  startCooldown();
});


