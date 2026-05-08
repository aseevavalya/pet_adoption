const DASHBOARD_API_BASE = "http://127.0.0.1:8000/api";
const DASHBOARD_MEDIA_BASE = "http://127.0.0.1:8000";

function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (const cookie of cookies) {
    const [key, ...parts] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(parts.join("="));
    }
  }

  return null;
}

function isUnsafeMethod(method = "GET") {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

async function dashboardRequest(url, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const csrfToken = getCookie("csrftoken");

  const headers = {
    ...(options.headers || {}),
  };

  if (isUnsafeMethod(method) && csrfToken) {
    headers["X-CSRFToken"] = csrfToken;
  }

  const response = await fetch(url, {
    credentials: "include",
    ...options,
    method,
    headers,
  });

  if (!response.ok) {
    let errorText = `HTTP ${response.status}`;

    try {
      const data = await response.json();
      errorText = data?.detail || data?.error || JSON.stringify(data);
    } catch (_) {}

    throw new Error(errorText);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function dashboardImageUrl(path) {
  if (!path) return "../img/about-project.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${DASHBOARD_MEDIA_BASE}${path}`;
}

async function getDashboardAnimals() {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/animals/`);
}

async function getDashboardAnimalById(id) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/animals/${id}/`);
}

async function createDashboardAnimal(payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/animals/`, {
    method: "POST",
    body: payload,
  });
}

async function updateDashboardAnimal(id, payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/animals/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

async function deleteDashboardAnimal(id) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/animals/${id}/`, {
    method: "DELETE",
  });
}

async function getDashboardRequests() {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/requests/`);
}

async function getDashboardRequestById(id) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/requests/${id}/`);
}

async function updateDashboardRequest(id, payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/requests/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function deleteDashboardRequest(id) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/requests/${id}/`, {
    method: "DELETE",
  });
}

async function getDashboardArticles() {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/articles/`);
}

async function getDashboardArticleById(id) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/articles/${id}/`);
}

async function createDashboardArticle(payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/articles/`, {
    method: "POST",
    body: payload,
  });
}

async function updateDashboardArticle(id, payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/articles/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

async function deleteDashboardArticle(id) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/articles/${id}/`, {
    method: "DELETE",
  });
}

async function getDashboardAboutPages() {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/pages/about/`);
}

async function createDashboardAboutPage(payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/pages/about/`, {
    method: "POST",
    body: payload,
  });
}

async function updateDashboardAboutPage(id, payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/pages/about/${id}/`, {
    method: "PATCH",
    body: payload,
  });
}

async function getDashboardHelpPages() {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/pages/help/`);
}

async function createDashboardHelpPage(payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/pages/help/`, {
    method: "POST",
    body: payload,
  });
}

async function updateDashboardHelpPage(id, payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/pages/help/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function getDashboardContactsPages() {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/pages/contacts/`);
}

async function createDashboardContactsPage(payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/pages/contacts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function updateDashboardContactsPage(id, payload) {
  return dashboardRequest(`${DASHBOARD_API_BASE}/dashboard/pages/contacts/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
