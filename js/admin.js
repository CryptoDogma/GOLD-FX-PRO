const API = "https://goldfxpro-backend.onrender.com";
let allLicenses = [];

function daysLeft(date) {
  return Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
}

function statusBadge(license) {
  if (!license.active) return `<span class="badge disabled">Disabled</span>`;
  const d = daysLeft(license.expiresAt);
  if (d <= 0) return `<span class="badge expired">Expired</span>`;
  return `<span class="badge active">Active (${d}d)</span>`;
}

async function loadLicenses() {
  const secret = document.getElementById("secret").value;

  const res = await fetch(`${API}/admin/licenses`, {
    headers: { "x-admin-secret": secret }
  });

  if (!res.ok) {
    alert("Invalid admin secret");
    return;
  }

  allLicenses = await res.json();
  render();
}

function render() {
  const search = document.getElementById("search").value.toLowerCase();
  const list = document.getElementById("list");

  const filtered = allLicenses.filter(l =>
    l.email.toLowerCase().includes(search)
  );

  list.innerHTML = filtered.map(l => `
    <tr>
      <td>${l.email}</td>
      <td>${l.licenseKey}</td>
      <td>
        ${new Date(l.expiresAt).toLocaleDateString()}<br>
        <span class="muted">${daysLeft(l.expiresAt)} days left</span>
      </td>
      <td>${statusBadge(l)}</td>
      <td>
        <button class="extend" onclick="extend('${l.email}')">+30d</button>
        <button class="toggle" onclick="toggle('${l.email}')">Toggle</button>
      </td>
    </tr>
  `).join("");
}

async function extend(email) {
  if (!confirm("Extend license by 30 days?")) return;

  const secret = document.getElementById("secret").value;

  await fetch(`${API}/admin/licenses/extend`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-admin-secret":secret
    },
    body:JSON.stringify({ email, days:30 })
  });

  loadLicenses();
}

async function toggle(email) {
  if (!confirm("Toggle license active state?")) return;

  const secret = document.getElementById("secret").value;

  await fetch(`${API}/admin/licenses/toggle`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "x-admin-secret":secret
    },
    body:JSON.stringify({ email })
  });

  loadLicenses();
}

document.getElementById("search").addEventListener("input", render);
