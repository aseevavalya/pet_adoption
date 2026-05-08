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

function fillHelpPreview(page) {
  const titleNode = document.getElementById("helpPreviewTitle");
  const leadNode = document.getElementById("helpPreviewLead");
  const donationTitleNode = document.getElementById("helpPreviewDonationTitle");
  const donationDetailsNode = document.getElementById("helpPreviewDonationDetails");
  const buttonTextNode = document.getElementById("helpPreviewButtonText");
  const contentNode = document.getElementById("helpPreviewContent");

  if (titleNode) titleNode.textContent = page.title || "—";
  if (leadNode) leadNode.textContent = page.lead || "—";
  if (donationTitleNode) donationTitleNode.textContent = page.donation_title || "—";

  if (donationDetailsNode) {
    donationDetailsNode.innerHTML = page.donation_details || "—";
    if (!page.donation_details) donationDetailsNode.textContent = "—";
  }

  if (buttonTextNode) buttonTextNode.textContent = page.button_text || "—";

  if (contentNode) {
    const text = (page.content || "").trim();
    if (!text) {
      contentNode.textContent = "—";
    } else {
      contentNode.innerHTML = text
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => `<p>${item}</p>`)
        .join("");
    }
  }
}

function fillHelpPageForm(form, page) {
  form.title.value = page.title || "";
  form.lead.value = page.lead || "";
  form.content.value = page.content || "";
  form.donation_title.value = page.donation_title || "";
  form.button_text.value = page.button_text || "";
  form.donation_details.value = page.donation_details || "";

  fillHelpPreview(page);
}

function collectHelpPagePayload(form) {
  return {
    title: form.title.value.trim(),
    lead: form.lead.value.trim(),
    content: form.content.value.trim(),
    donation_title: form.donation_title.value.trim(),
    button_text: form.button_text.value.trim(),
    donation_details: form.donation_details.value.trim(),
  };
}

function bindHelpLivePreview(form) {
  ["title", "lead", "content", "donation_title", "button_text", "donation_details"].forEach((fieldName) => {
    const field = form[fieldName];
    if (!field) return;

    field.addEventListener("input", () => {
      fillHelpPreview(collectHelpPagePayload(form));
    });
  });
}

async function initDashboardHelpPage() {
  await initDashboardLayout("");

  const form = document.getElementById("helpPageForm");
  const statusNode = document.getElementById("helpPageFormStatus");
  const submitBtn = document.getElementById("helpPageSubmitBtn");

  if (!form) return;

  bindBlockToggles();
  bindHelpLivePreview(form);

  let pageId = null;

  try {
    const pages = await getDashboardHelpPages();

    if (Array.isArray(pages) && pages.length > 0) {
      const page = pages[0];
      pageId = page.id;
      fillHelpPageForm(form, page);
    } else {
      fillHelpPreview({});
    }
  } catch (error) {
    console.error(error);
    statusNode.textContent = `Не удалось загрузить данные страницы: ${error.message}`;
    statusNode.className = "dashboard-form-status is-error";
    fillHelpPreview({});
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = collectHelpPagePayload(form);

    submitBtn.disabled = true;
    statusNode.textContent = "Сохраняем...";
    statusNode.className = "dashboard-form-status";

    try {
      if (pageId) {
        await updateDashboardHelpPage(pageId, payload);
      } else {
        const createdPage = await createDashboardHelpPage(payload);
        pageId = createdPage.id;
      }

      fillHelpPreview(payload);

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

initDashboardHelpPage();