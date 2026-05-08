function getArticleIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function transliterateArticle(text) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("");
}

function slugifyArticle(value) {
  return transliterateArticle(value)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "")
    .replace(/\-\-+/g, "-");
}

function initArticleEditor() {
  if (!window.tinymce) {
    console.error("TinyMCE не найден");
    return Promise.resolve();
  }

  return tinymce.init({
    selector: "#article_content",
    license_key: "gpl",
    menubar: false,
    branding: false,
    statusbar: false,
    min_height: 520,
    max_height: 900,
    plugins: "lists link table code wordcount autoresize",
    toolbar:
      "undo redo | blocks | bold italic underline | bullist numlist | link blockquote | alignleft aligncenter alignright | removeformat code",
    autoresize_bottom_margin: 24,
    content_style: `
      @font-face {
        font-family: "Involve";
        src: url("../fonts/Involve-Regular.otf") format("opentype");
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: "Involve";
        src: url("../fonts/Involve-Oblique.otf") format("opentype");
        font-weight: 400;
        font-style: italic;
        font-display: swap;
      }
      @font-face {
        font-family: "Involve";
        src: url("../fonts/Involve-Medium.otf") format("opentype");
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }
      @font-face {
        font-family: "Involve";
        src: url("../fonts/Involve-Bold.otf") format("opentype");
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }
      body {
        font-family: "Involve", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, "Helvetica Neue", sans-serif;
        font-size: 17px;
        font-weight: 400;
        line-height: 1.48;
        letter-spacing: 0.006em;
        color: #2f352f;
      }
      p { margin: 0 0 1em; }
      ul, ol { margin: 0 0 1em; padding-left: 1.4em; }
      li { font-size: 16px; line-height: 1.42; letter-spacing: 0.006em; }
      strong, b { font-weight: 700; }
      h1, h2, h3, h4, h5, h6 { font-weight: 700; -webkit-text-stroke: 0.18px currentColor; }
      em, i { font-style: italic; }
      strong em, strong i, b em, b i { font-weight: 700; font-style: italic; }
    `,
  });
}

function fillArticleForm(form, article) {
  form.title.value = article.title || "";
  form.slug.value = article.slug || "";
  form.category.value = article.category || "";
  form.excerpt.value = article.excerpt || "";

  const editor = window.tinymce ? tinymce.get("article_content") : null;
  if (editor && editor.initialized) {
    editor.setContent(article.content || "");
  } else {
    form.content.value = article.content || "";
  }

  form.is_published.checked = Boolean(article.is_published);
}

function collectArticleFormData(form) {
  const formData = new FormData();

  formData.append("title", form.title.value.trim());
  formData.append("slug", form.slug.value.trim());
  formData.append("category", form.category.value);
  formData.append("excerpt", form.excerpt.value.trim());
  const editor = window.tinymce ? tinymce.get("article_content") : null;
  formData.append(
    "content",
    editor && editor.initialized
      ? editor.getContent()
      : form.content.value.trim()
  );
  formData.append("is_published", form.is_published.checked ? "true" : "false");

  const coverFile = form.cover_image?.files?.[0];
  if (coverFile) {
    formData.append("cover_image", coverFile);
  }

  return formData;
}

function renderArticleCoverPreviewFromUrl(url) {
  const previewImage = document.getElementById("articleCoverPreview");
  const previewEmpty = document.getElementById("articleCoverPreviewEmpty");

  if (!previewImage || !previewEmpty) return;

  if (!url) {
    previewImage.hidden = true;
    previewImage.removeAttribute("src");
    previewEmpty.hidden = false;
    return;
  }

  previewImage.src = dashboardImageUrl(url);
  previewImage.hidden = false;
  previewEmpty.hidden = true;
}

function bindArticleCoverPreview(form) {
  const input = document.getElementById("articleCoverImage");
  const previewImage = document.getElementById("articleCoverPreview");
  const previewEmpty = document.getElementById("articleCoverPreviewEmpty");

  if (!input || !previewImage || !previewEmpty) return;

  input.addEventListener("change", () => {
    const file = input.files?.[0];

    if (!file) {
      previewImage.hidden = true;
      previewImage.removeAttribute("src");
      previewEmpty.hidden = false;
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    previewImage.src = objectUrl;
    previewImage.hidden = false;
    previewEmpty.hidden = true;
  });
}

async function initDashboardArticleForm() {
  await initDashboardLayout("");
  await initArticleEditor();

  const form = document.getElementById("articleForm");
  const heading = document.getElementById("articleFormHeading");
  const lead = document.getElementById("articleFormLead");
  const statusNode = document.getElementById("articleFormStatus");
  const submitBtn = document.getElementById("articleSubmitBtn");

  const articleId = getArticleIdFromUrl();

  if (!form) return;

  bindArticleCoverPreview(form);

  form.title.addEventListener("input", () => {
    if (!form.slug.dataset.userEdited) {
      form.slug.value = slugifyArticle(form.title.value);
    }
  });

  form.slug.addEventListener("input", () => {
    form.slug.dataset.userEdited = "true";
  });

  if (articleId) {
    heading.textContent = "Редактировать статью";
    lead.textContent = "Измените данные статьи и сохраните изменения.";

    try {
      const article = await getDashboardArticleById(articleId);
      fillArticleForm(form, article);
      renderArticleCoverPreviewFromUrl(article.cover_image);
    } catch (error) {
      console.error(error);
      statusNode.textContent = "Ошибка загрузки статьи.";
      statusNode.className = "dashboard-form-status is-error";
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (window.tinymce) {
      tinymce.triggerSave();
    }

    const editor = window.tinymce ? tinymce.get("article_content") : null;
    const contentValue = editor && editor.initialized
      ? editor.getContent({ format: "text" }).trim()
      : form.content.value.trim();

    if (!contentValue) {
      statusNode.textContent = "Добавь текст статьи.";
      statusNode.className = "dashboard-form-status is-error";
      return;
    }

    const payload = collectArticleFormData(form);

    submitBtn.disabled = true;
    statusNode.textContent = articleId
      ? "Сохраняем изменения..."
      : "Создаём статью...";
    statusNode.className = "dashboard-form-status";

    try {
      if (articleId) {
        await updateDashboardArticle(articleId, payload);
        window.location.href = "articles.html";
        return;
      } else {
        await createDashboardArticle(payload);
        window.location.href = form.is_published.checked
          ? "articles.html"
          : "articles.html?published=false";
        return;
      }

      statusNode.className = "dashboard-form-status is-success";
    } catch (error) {
      console.error(error);
      statusNode.textContent = "Не удалось сохранить статью. Проверь обязательные поля, slug и файл изображения.";
      statusNode.className = "dashboard-form-status is-error";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

initDashboardArticleForm();
