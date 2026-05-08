const API_BASE = "http://127.0.0.1:8000/api";

const searchInput = document.getElementById("articleSearch");
const categoryButtons = document.querySelectorAll(".category-btn");
const articlesGrid = document.getElementById("articlesGrid");
const noResults = document.getElementById("noResults");

let activeCategory = "all";
let allArticles = [];

function getImageUrl(path) {
  if (!path) return "img/about-project.png";
  if (path.startsWith("http")) return path;
  return `http://127.0.0.1:8000${path.startsWith("/") ? path : `/${path}`}`;
}

function renderArticles(list) {
  if (!articlesGrid || !noResults) return;

  if (!list.length) {
    articlesGrid.innerHTML = "";
    noResults.classList.remove("hidden");
    return;
  }

  noResults.classList.add("hidden");
  articlesGrid.innerHTML = list.map((article) => `
    <article class="article-card" data-category="${article.category}" data-title="${article.title}">
      <a class="article-card-link" href="article.html?slug=${encodeURIComponent(article.slug)}">
        <div class="article-card-image tape-left">
          <img src="${getImageUrl(article.cover_image)}" alt="${article.title}">
        </div>
        <div class="article-card-body">
          <span class="article-badge">${article.category_display || "Статья"}</span>
          <h2>${article.title}</h2>
          <p>${article.excerpt || "Описание скоро появится."}</p>
          <span class="article-readmore">Читать статью →</span>
        </div>
      </a>
    </article>
  `).join("");
}

function filterArticles() {
  const searchValue = (searchInput?.value || "").toLowerCase().trim();

  const filtered = allArticles.filter((article) => {
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    const text = `${article.title} ${article.excerpt || ""}`.toLowerCase();
    const matchesSearch = text.includes(searchValue);
    return matchesCategory && matchesSearch;
  });

  renderArticles(filtered);
}

async function loadArticles() {
  try {
    const response = await fetch(`${API_BASE}/articles/`);
    if (!response.ok) throw new Error("Не удалось загрузить статьи");
    allArticles = await response.json();
    filterArticles();
  } catch (error) {
    console.error(error);
    if (articlesGrid) {
      articlesGrid.innerHTML = '<p class="articles-empty">Не удалось загрузить статьи.</p>';
    }
  }
}

if (searchInput) {
  searchInput.addEventListener("input", filterArticles);
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category || "all";
    filterArticles();
  });
});

loadArticles();
