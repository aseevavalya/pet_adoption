function dashboardHumanArticleCategory(value) {
  if (value === "adaptation") return "Адаптация";
  if (value === "care") return "Уход";
  if (value === "health") return "Здоровье";
  if (value === "behavior") return "Поведение";
  return "Другое";
}

function dashboardArticleStatusClass(article) {
  return article.is_published
    ? "dashboard-badge dashboard-badge--success"
    : "dashboard-badge dashboard-badge--warning";
}

function dashboardArticleStatusText(article) {
  return article.is_published ? "Опубликовано" : "Черновик";
}

function formatDashboardArticleDate(value) {
  if (!value) return "Дата не указана";

  try {
    return new Date(value).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (_) {
    return value;
  }
}

function getPublicArticleUrl(article) {
  if (!article?.slug) return null;
  return `../article.html?slug=${encodeURIComponent(article.slug)}`;
}

async function initDashboardArticles() {
  await initDashboardLayout("");

  const listNode = document.getElementById("articlesList");
  const searchNode = document.getElementById("articlesSearch");
  const categoryNode = document.getElementById("articlesCategoryFilter");
  const statusNode = document.getElementById("articlesStatusFilter");

  let articles = [];

  function renderArticles() {
    const searchValue = (searchNode?.value || "").toLowerCase().trim();
    const categoryValue = categoryNode?.value || "";
    const statusValue = statusNode?.value || "";

    const filtered = articles.filter((article) => {
      const text = `${article.title || ""} ${article.excerpt || ""} ${article.content || ""}`.toLowerCase();

      const matchesSearch = text.includes(searchValue);
      const matchesCategory = !categoryValue || article.category === categoryValue;
      const matchesStatus =
        !statusValue ||
        (statusValue === "published" && article.is_published) ||
        (statusValue === "draft" && !article.is_published);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    listNode.innerHTML = filtered.length
      ? filtered.map((article) => {
          const publicUrl = article.is_published ? getPublicArticleUrl(article) : null;

          return `
            <article class="dashboard-row-card dashboard-row-card--compact">
              <div class="dashboard-row-card__image dashboard-row-card__image--placeholder">
                📝
              </div>

              <div>
                <div class="dashboard-article-head">
                  <div class="dashboard-article-head__main">
                    <h3 class="dashboard-article-title">${article.title || "Без названия"}</h3>

                    <p class="dashboard-article-meta">
                      slug: ${article.slug || "—"} · ${formatDashboardArticleDate(article.published_at || article.created_at)}
                    </p>
                  </div>

                  ${article.is_published && publicUrl ? `
                    <a
                      class="dashboard-mini-btn dashboard-article-view-btn"
                      href="${publicUrl}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      На сайте
                    </a>
                  ` : ""}
                </div>

                <p class="dashboard-article-desc">
                  ${article.excerpt || "Краткое описание пока не добавлено."}
                </p>

                <div class="dashboard-badges">
                  <span class="dashboard-badge">
                    ${dashboardHumanArticleCategory(article.category)}
                  </span>

                  <span class="${dashboardArticleStatusClass(article)}">
                    ${dashboardArticleStatusText(article)}
                  </span>
                </div>
              </div>

              <div class="dashboard-row-card__actions">
                <a class="dashboard-mini-btn" href="article-form.html?id=${article.id}">
                  Редактировать
                </a>

                <button
                  class="dashboard-mini-btn dashboard-mini-btn--danger"
                  type="button"
                  data-delete-id="${article.id}"
                >
                  Удалить
                </button>
              </div>
            </article>
          `;
        }).join("")
      : `<p class="dashboard-empty">По этим параметрам статьи не найдены.</p>`;
  }

  try {
    articles = await getDashboardArticles();
    renderArticles();
  } catch (error) {
    console.error(error);
    listNode.innerHTML = `<p class="dashboard-empty">Не удалось загрузить статьи.</p>`;
  }

  searchNode?.addEventListener("input", renderArticles);
  categoryNode?.addEventListener("change", renderArticles);
  statusNode?.addEventListener("change", renderArticles);

  listNode.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-id]");
    if (!button) return;

    const articleId = button.dataset.deleteId;
    const confirmed = window.confirm("Удалить статью?");
    if (!confirmed) return;

    try {
      await deleteDashboardArticle(articleId);
      articles = articles.filter((article) => String(article.id) !== String(articleId));
      renderArticles();
    } catch (error) {
      console.error(error);
      alert("Не удалось удалить статью.");
    }
  });
}

initDashboardArticles();