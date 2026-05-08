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
    <article
      class="article-card media-card"
      data-category="${article.category}"
      data-title="${article.title}"
      style="--card-image: url('${getImageUrl(article.cover_image)}');"
    >
      <a class="article-card-link media-card__link" href="article.html?slug=${encodeURIComponent(article.slug)}">
        <div class="article-card-frame media-card__frame">
          <img
            class="article-card-image media-card__image"
            src="${getImageUrl(article.cover_image)}"
            alt="${article.title}"
          >

          <div class="article-card-overlay media-card__overlay">
            <div class="article-card-top media-card__top">
              <span class="article-badge media-card__pill">${article.category_display || "Статья"}</span>
            </div>

            <div class="article-card-body media-card__content">
              <h2 class="article-card-title media-card__title">${article.title}</h2>
              <p class="article-card-text media-card__text">
                ${article.excerpt || "Описание скоро появится."}
              </p>
              <span class="article-readmore media-card__meta">Читать статью</span>
            </div>
          </div>
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
