async function injectPartial(targetId, path) {
  const target = document.getElementById(targetId);
  if (!target) return;

  try {
    const response = await fetch(path);
    target.innerHTML = await response.text();
  } catch (error) {
    console.error(`Не удалось загрузить partial ${path}`, error);
  }
}

function setActiveNav() {
  const pageKey = document.body.dataset.dashboardPage;
  if (!pageKey) return;

  const links = document.querySelectorAll(".dashboard-link");
  links.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === pageKey);
  });
}

function ensureSidebarBackdrop() {
  const shell = document.querySelector(".dashboard-shell");
  if (!shell) return null;

  let backdrop = shell.querySelector(".dashboard-sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "dashboard-sidebar-backdrop";
    shell.appendChild(backdrop);
  }

  return backdrop;
}

function closeDashboardSidebar() {
  const shell = document.querySelector(".dashboard-shell");
  if (!shell) return;
  shell.classList.remove("sidebar-open");
}

function toggleDashboardSidebar() {
  const shell = document.querySelector(".dashboard-shell");
  if (!shell) return;
  shell.classList.toggle("sidebar-open");
}

function initDashboardSidebar() {
  const toggleButton = document.getElementById("dashboardMenuToggle");
  const backdrop = ensureSidebarBackdrop();

  if (toggleButton) {
    toggleButton.addEventListener("click", toggleDashboardSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeDashboardSidebar);
  }

  document.querySelectorAll(".dashboard-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 980) {
        closeDashboardSidebar();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeDashboardSidebar();
    }
  });
}

async function initDashboardLayout(pageTitle) {
  await injectPartial("dashboardSidebarMount", "partials/sidebar.html");
  await injectPartial("dashboardTopbarMount", "partials/topbar.html");

  setActiveNav();
  initDashboardSidebar();
  initDashboardLogout();

  const titleNode = document.getElementById("dashboardPageTitle");

  if (titleNode) {
    if (pageTitle) {
      titleNode.textContent = pageTitle;
      titleNode.style.display = "";
    } else {
      titleNode.textContent = "";
      titleNode.style.display = "none";
    }
  }
}

function initDashboardLogout() {
  const logoutButton = document.getElementById("dashboardLogoutBtn");
  if (!logoutButton) return;

  logoutButton.addEventListener("click", () => {
    try {
      if (typeof logoutDashboard === "function") {
        logoutDashboard();
        return;
      }

      localStorage.removeItem("dashboardAccessToken");
      localStorage.removeItem("dashboardRefreshToken");
      localStorage.removeItem("dashboardUser");

      window.location.href = "../login.html";
    } catch (error) {
      console.error("Не удалось выполнить выход из панели", error);
    }
  });
}