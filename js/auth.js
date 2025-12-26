document.addEventListener("DOMContentLoaded", () => {
  // ─────────────────────────────────────────────
  // LOGIN
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", async e => {
      e.preventDefault();

      try {
        const data = await apiRequest(
          "/api/login",
          "POST",
          {
            email: email.value,
            password: password.value,
            license: license.value
          }
        );

        // Save JWT
        localStorage.setItem("token", data.token);

        // Go to dashboard
        window.location.href = "dashboard.html";

      } catch (err) {
        alert("Login failed: " + err.message);
      }
    });
  }

  // ─────────────────────────────────────────────
  // REGISTER
  const regForm = document.getElementById("registerForm");
  if (!regForm) return;

  regForm.addEventListener("submit", async e => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("name")?.value,
      email: document.getElementById("email")?.value,
      password: document.getElementById("password")?.value,
      activationCode: document.getElementById("activationCode")?.value,

      // ✅ NEW FIELDS
      phone: document.getElementById("phone")?.value || null,
      whatsappOptIn:
        document.getElementById("whatsappOptIn")?.checked || false
    };

    console.log("REGISTER PAYLOAD:", payload);

    try {
      const res = await apiRequest(
        "/api/register",
        "POST",
        payload
      );

      alert(
        "Registration successful!\n\n" +
        "Your account has been activated.\n" +
        "You may now log in."
      );

      window.location.href = "index.html";

    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  });
});
