function initAboutEditors() {
  if (!window.tinymce) {
    console.error("TinyMCE не найден");
    return Promise.resolve();
  }

  return tinymce.init({
    selector: "#story_content",
    license_key: "gpl",
    menubar: false,
    branding: false,
    min_height: 320,
    resize: true,
    plugins: "autoresize lists link code wordcount",
    toolbar: "undo redo | bold italic | bullist numlist | removeformat",
    statusbar: false,
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
      body {
        font-family: "Involve", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, "Helvetica Neue", sans-serif;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.7;
        letter-spacing: 0.006em;
        color: #2f352f;
      }
      p { margin: 0 0 1em; }
      strong, b { font-weight: 700; }
      em, i { font-style: italic; }
      strong em, strong i, b em, b i { font-weight: 700; font-style: italic; }
    `,
    autoresize_bottom_margin: 16,
    autoresize_overflow_padding: 8
  });
}

function bindBlockToggles() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-toggle-block]");
    if (!button) return;

    const blockId = button.dataset.toggleBlock;
    const block = document.getElementById(blockId);
    if (!block) return;

    block.hidden = !block.hidden;
    button.textContent = block.hidden ? "Редактировать" : "Скрыть";
  });
}

function fillAboutPreview(page) {
  const storyContentNode = document.getElementById("aboutPreviewStoryContent");
  if (!storyContentNode) return;

  storyContentNode.innerHTML = page.story_content || "—";
  if (!page.story_content) {
    storyContentNode.textContent = "—";
  }
}

function fillAboutPageForm(form, page) {
  const storyEditor = window.tinymce ? tinymce.get("story_content") : null;

  if (storyEditor && storyEditor.initialized) {
    storyEditor.setContent(page.story_content || "");
  } else if (form.story_content) {
    form.story_content.value = page.story_content || "";
  }

  fillAboutPreview(page);
}

function collectAboutPagePayload(form) {
  const formData = new FormData();

  formData.append(
    "story_content",
    window.tinymce && tinymce.get("story_content") && tinymce.get("story_content").initialized
      ? tinymce.get("story_content").getContent()
      : form.story_content.value.trim()
  );

  return formData;
}

function previewPayloadFromForm(form) {
  return {
    story_content:
      window.tinymce && tinymce.get("story_content") && tinymce.get("story_content").initialized
        ? tinymce.get("story_content").getContent()
        : form?.story_content?.value?.trim() || "",
  };
}

function bindLivePreview(form) {
  setTimeout(() => {
    const storyEditor = window.tinymce ? tinymce.get("story_content") : null;

    if (storyEditor && storyEditor.initialized) {
      storyEditor.on("input change keyup setcontent", () => {
        fillAboutPreview(previewPayloadFromForm(form));
      });
    }
  }, 0);
}

async function initDashboardAboutPage() {
  await initDashboardLayout("");

  const form = document.getElementById("aboutPageForm");
  const statusNode = document.getElementById("aboutPageFormStatus");
  const submitBtn = document.getElementById("aboutPageSubmitBtn");

  if (!form) return;

  bindBlockToggles();
  await initAboutEditors();
  bindLivePreview(form);

  let pageId = null;

  try {
    const pages = await getDashboardAboutPages();

    if (Array.isArray(pages) && pages.length > 0) {
      const page = pages[0];
      pageId = page.id;
      fillAboutPageForm(form, page);
    } else {
      fillAboutPreview({});
    }
  } catch (error) {
    console.error(error);
    statusNode.textContent = `Не удалось загрузить данные страницы: ${error.message}`;
    statusNode.className = "dashboard-form-status is-error";
    fillAboutPreview({});
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = collectAboutPagePayload(form);

    submitBtn.disabled = true;
    statusNode.textContent = "Сохраняем...";
    statusNode.className = "dashboard-form-status";

    try {
      if (pageId) {
        await updateDashboardAboutPage(pageId, payload);
      } else {
        const createdPage = await createDashboardAboutPage(payload);
        pageId = createdPage.id;
      }

      fillAboutPreview(previewPayloadFromForm(form));

      statusNode.textContent = "Страница успешно сохранена.";
      statusNode.className = "dashboard-form-status is-success";
    } catch (error) {
      console.error(error);
      statusNode.textContent = `Не удалось сохранить страницу: ${error.message}`;
      statusNode.className = "dashboard-form-status is-error";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

initDashboardAboutPage();
