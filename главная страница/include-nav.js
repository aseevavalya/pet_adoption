// Подгружаем общий nav и нижний бар возврата.
async function loadNavigation() {
  const navContainer = document.getElementById("site-nav");
  if (!navContainer) return;

  try {
    const response = await fetch("partials/nav.html");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    navContainer.innerHTML = await response.text();
    setActiveNavigationLink();
    appendHomeBar();

    // Сообщаем остальному JS, что меню уже в DOM.
    document.dispatchEvent(new Event("nav:loaded"));
  } catch (error) {
    console.error("Не удалось загрузить навигацию:", error);
  }
}

// Подсвечиваем текущую страницу в навигации.
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

// Добавляем нижний бар на все страницы, кроме главной.
function appendHomeBar() {
  const currentFile = getCurrentFileName();
  const isHomePage = currentFile === "index.html";

  if (isHomePage || document.querySelector(".bottom-home-wrap")) return;

  const footer = document.createElement("footer");
  footer.className = "bottom-home-wrap";
  footer.innerHTML = `
    <div class="container">
      <a class="bottom-home-bar" href="index.html">
        <span class="bottom-home-icon" aria-hidden="true">←</span>
        <span class="bottom-home-text">На главную</span>
      </a>
    </div>
  `;

  document.body.appendChild(footer);
}

// Возвращаем имя файла текущей страницы.
function getCurrentFileName() {
  const path = window.location.pathname;
  const fileName = path.split("/").pop();
  return fileName || "index.html";
}

loadNavigation();
