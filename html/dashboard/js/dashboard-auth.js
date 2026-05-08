const DASHBOARD_AUTH_API = "http://127.0.0.1:8000/api/auth";

async function requireDashboardAuth() {
  try {
    const response = await fetch(`${DASHBOARD_AUTH_API}/me/`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Not authenticated");
    }

    const data = await response.json();

    if (!data.authenticated) {
      throw new Error("Not authenticated");
    }
  } catch (error) {
    console.error(error);
    window.location.href = "../login.html";
  }
}