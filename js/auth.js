document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

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
});
document.addEventListener("DOMContentLoaded", () => {
  const regForm = document.getElementById("registerForm");
  if (!regForm) return;

  regForm.addEventListener("submit", async e => {
    e.preventDefault();

    try {
      const response = await apiRequest(
        "/api/register",
        "POST",
        {
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
          activationCode: document.getElementById("activationCode").value
        }
      );

      alert(
        "Registration successful!\n\n" +
        "Please check your email to verify your account."
      );

      window.location.href = "index.html";

    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  });
});
