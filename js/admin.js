const API = "https://goldfxpro-backend.onrender.com";

async function loadLicenses() {
  const secret = document.getElementById("secret").value;
  const res = await fetch(`${API}/admin/licenses`, {
    headers: { "x-admin-secret": secret }
  });

  if (!res.ok) {
    alert("Invalid admin secret");
    return;
  }

  const licenses = await res.json();
  const list = document.getElementById("list");

  list.innerHTML = licenses.map(l => `
    <tr>
      <td>${l.email}</td>
      <td>${l.licenseKey}</td>
      <td>${new Date(l.expiresAt).toLocaleDateString()}</td>
      <td>${l.active ? "Active" : "Disabled"}</td>
      <td>
        <button class="extend" onclick="extend('${l.email}')">+30d</button>
        <button class="toggle" onclick="toggle('${l.email}')">Toggle</button>
      </td>
    </tr>
  `).join("");
}

async function extend(email) {
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
