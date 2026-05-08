const API_BASE = "http://127.0.0.1:8000/api";
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const titleEl = document.getElementById("articleTitle");
const badgeEl = document.getElementById("articleBadge");
const excerptEl = document.getElementById("articleExcerpt");
const imageEl = document.getElementById("articleImage");
const contentEl = document.getElementById("articleContent");

function getImageUrl(path) {
  if (!path) return "img/about-project.png";
  if (path.startsWith("http")) return path;
  return `http://127.0.0.1:8000${path.startsWith("/") ? path : `/${path}`}`;
}

async function loadArticle() {
  if (!slug) return;
  try {
    const response = await fetch(`${API_BASE}/articles/${slug}/`);
    if (!response.ok) throw new Error("Не удалось загрузить статью");
    const article = await response.json();

    document.title = `${article.title} — Животные ищут дом`;
    if (titleEl) titleEl.textContent = article.title;
    if (badgeEl) badgeEl.textContent = article.category_display || "Статья";
    if (excerptEl) excerptEl.textContent = article.excerpt || "";
    if (imageEl) {
      imageEl.src = getImageUrl(article.cover_image);
      imageEl.alt = article.title;
    }
    if (contentEl) {
      contentEl.innerHTML = (article.content || "")
        .split("\n")
        .filter(Boolean)
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join("");
    }
  } catch (error) {
    console.error(error);
    if (contentEl) contentEl.innerHTML = "<p>Не удалось загрузить статью.</p>";
  }
}

loadArticle();
