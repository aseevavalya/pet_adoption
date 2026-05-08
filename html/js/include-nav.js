async function loadNavigation() {
  const navContainer = document.getElementById("site-nav");
  if (!navContainer) return;

  try {
    const response = await fetch("partials/nav.html");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    navContainer.innerHTML = await response.text();
    setActiveNavigationLink();

    document.dispatchEvent(new Event("nav:loaded"));
  } catch (error) {
    console.error("Не удалось загрузить навигацию:", error);
  }
}

function setActiveNavigationLink() {
  const currentFile = getCurrentFileName();
  const navLinks = document.querySelectorAll("[data-nav-link]");

  navLinks.forEach((link) => {
    const target = link.getAttribute("data-nav-link");
    if (target === currentFile) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function getCurrentFileName() {
  const path = window.location.pathname;
  const fileName = path.split("/").pop();
  return fileName || "index.html";
}

loadNavigation();