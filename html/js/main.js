// Инициализация бокового меню.
function initMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const sideMenu = document.getElementById("sideMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  if (!menuBtn || !closeMenuBtn || !sideMenu || !menuOverlay) return;
  if (menuBtn.dataset.ready === "true") return;

  function openMenu() {
    sideMenu.classList.add("show");
    menuOverlay.classList.add("show");
    sideMenu.setAttribute("aria-hidden", "false");
    menuBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    sideMenu.classList.remove("show");
    menuOverlay.classList.remove("show");
    sideMenu.setAttribute("aria-hidden", "true");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  menuBtn.addEventListener("click", openMenu);
  closeMenuBtn.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".side-menu a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  menuBtn.dataset.ready = "true";
}

// Меню инициализируется после загрузки nav.
document.addEventListener("nav:loaded", initMenu);
