<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>GOLD FX PRO – Dashboard</title>

  <script defer src="js/api.js"></script>
  <script defer src="js/dashboard.js"></script>

  <style>
    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      background: #0b1220;
      color: #e5e7eb;
      padding: 24px;
    }

    h2 {
      margin-bottom: 20px;
      color: #d4af37;
    }

    .card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 14px;
      padding: 20px;
      max-width: 520px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }

    .direction {
      font-size: 32px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .buy {
      color: #22c55e;
    }

    .sell {
      color: #ef4444;
    }

    .pair {
      color: #9ca3af;
      margin-bottom: 16px;
    }

    .levels {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }

    .level {
      background: #020617;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
      border: 1px solid #1f2937;
    }

    .level span {
      display: block;
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 4px;
    }

    .level strong {
      font-size: 16px;
    }

    .meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
      color: #9ca3af;
    }

    .confidence {
      font-weight: bold;
      color: #d4af37;
    }

    .reasoning {
      background: #020617;
      border-left: 4px solid #d4af37;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      margin-top: 14px;
      color: #cbd5f5;
    }

    .actions {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }

    button {
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      font-weight: bold;
      cursor: pointer;
    }

    .refresh {
      background: #2563eb;
      color: white;
    }

    .logout {
      background: #ef4444;
      color: white;
    }
  </style>
</head>

<body>

<h2>GOLD FX PRO – Market Dashboard</h2>

<div class="card">
  <div id="direction" class="direction">—</div>
  <div id="pair" class="pair">—</div>

  <div class="levels">
    <div class="level">
      <span>Entry</span>
      <strong id="entry">—</strong>
    </div>
    <div class="level">
      <span>Stop Loss</span>
      <strong id="sl">—</strong>
    </div>
    <div class="level">
      <span>Take Profit</span>
      <strong id="tp">—</strong>
    </div>
  </div>

  <div class="meta">
    <div>Session: <strong id="session">—</strong></div>
    <div>Confidence: <span class="confidence" id="confidence">—</span></div>
  </div>

  <div class="reasoning" id="reasoning">
    —
  </div>

  <div class="actions">
    <button class="refresh" id="refresh">Refresh Signal</button>
    <button class="logout" id="logout">Logout</button>
  </div>
</div>

</body>
</html>
