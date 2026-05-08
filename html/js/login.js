const AUTH_API_BASE = "http://127.0.0.1:8000/api/auth";

async function adminLoginRequest(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (_) {}

  if (!response.ok) {
    const message = data?.detail || data?.error || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return data;
}

async function initAdminLogin() {
  const form = document.getElementById("adminLoginForm");
  const statusNode = document.getElementById("adminLoginStatus");
  const submitBtn = document.getElementById("adminLoginBtn");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      username: form.username.value.trim(),
      password: form.password.value,
    };

    submitBtn.disabled = true;
    statusNode.textContent = "Входим...";
    statusNode.className = "login-status";

    try {
        const result = await adminLoginRequest(`${AUTH_API_BASE}/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

        console.log("LOGIN RESULT:", result);

        statusNode.textContent = "Вход выполнен.";
        statusNode.className = "login-status is-success";

        window.location.assign("./dashboard/index.html");
        return;
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        statusNode.textContent = error.message || "Ошибка входа.";
        statusNode.className = "login-status is-error";
    } finally {
        submitBtn.disabled = false;
    }
  });
}

initAdminLogin();