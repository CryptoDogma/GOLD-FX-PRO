const API_BASE = "https://goldfxpro-backend.onrender.com";

async function apiRequest(path, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(API_BASE + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text);
  }

  return JSON.parse(text);
}

