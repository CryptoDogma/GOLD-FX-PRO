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
        directionEl.textConte
