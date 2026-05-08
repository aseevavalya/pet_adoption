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

function fillContactsPreview(page) {
  const titleNode = document.getElementById("contactsPreviewTitle");
  const leadNode = document.getElementById("contactsPreviewLead");
  const dataNode = document.getElementById("contactsPreviewData");
  const donationTitleNode = document.getElementById("contactsPreviewDonationTitle");
  const donationTextNode = document.getElementById("contactsPreviewDonationText");
  const donationDetailsNode = document.getElementById("contactsPreviewDonationDetails");

  if (titleNode) titleNode.textContent = page.contacts_title || "—";
  if (leadNode) leadNode.textContent = page.contacts_lead || "—";

  if (dataNode) {
    const lines = [];

    if (page.phone) lines.push(`<p><strong>Телефон:</strong> ${page.phone}</p>`);
    if (page.email) lines.push(`<p><strong>Email:</strong> ${page.email}</p>`);
    if (page.telegram) lines.push(`<p><strong>Telegram:</strong> ${page.telegram}</p>`);
    if (page.vk) lines.push(`<p><strong>VK:</strong> ${page.vk}</p>`);
    if (page.instagram) lines.push(`<p><strong>Instagram:</strong> ${page.instagram}</p>`);

    dataNode.innerHTML = lines.length ? lines.join("") : "—";
  }

  if (donationTitleNode) donationTitleNode.textContent = page.donation_title || "—";
  if (donationTextNode) donationTextNode.textContent = page.donation_text || "—";

  if (donationDetailsNode) {
    const lines = [];

    if (page.donation_receiver) lines.push(`<p><strong>Получатель:</strong> ${page.donation_receiver}</p>`);
    if (page.donation_card) lines.push(`<p><strong>Карта / IBAN:</strong> ${page.donation_card}</p>`);
    if (page.donation_bank) lines.push(`<p><strong>Банк / BIC:</strong> ${page.donation_bank}</p>`);
    if (page.donation_purpose) lines.push(`<p><strong>Назначение:</strong> ${page.donation_purpose}</p>`);
    if (page.donation_link) lines.push(`<p><strong>Ссылка:</strong> ${page.donation_link}</p>`);

    donationDetailsNode.innerHTML = lines.length ? lines.join("") : "—";
  }
}

function fillContactsPageForm(form, page) {
  form.site_name.value = page.site_name || "";
  form.contacts_title.value = page.contacts_title || "";
  form.contacts_lead.value = page.contacts_lead || "";
  form.phone.value = page.phone || "";
  form.email.value = page.email || "";
  form.telegram.value = page.telegram || "";
  form.vk.value = page.vk || "";
  form.instagram.value = page.instagram || "";
  form.donation_title.value = page.donation_title || "";
  form.donation_text.value = page.donation_text || "";
  form.donation_receiver.value = page.donation_receiver || "";
  form.donation_card.value = page.donation_card || "";
  form.donation_bank.value = page.donation_bank || "";
  form.donation_purpose.value = page.donation_purpose || "";
  form.donation_link.value = page.donation_link || "";

  fillContactsPreview(page);
}

function collectContactsPagePayload(form) {
  return {
    site_name: form.site_name.value.trim(),
    contacts_title: form.contacts_title.value.trim(),
    contacts_lead: form.contacts_lead.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    telegram: form.telegram.value.trim(),
    vk: form.vk.value.trim(),
    instagram: form.instagram.value.trim(),
    donation_title: form.donation_title.value.trim(),
    donation_text: form.donation_text.value.trim(),
    donation_receiver: form.donation_receiver.value.trim(),
    donation_card: form.donation_card.value.trim(),
    donation_bank: form.donation_bank.value.trim(),
    donation_purpose: form.donation_purpose.value.trim(),
    donation_link: form.donation_link.value.trim(),
  };
}

function bindContactsLivePreview(form) {
  [
    "site_name",
    "contacts_title",
    "contacts_lead",
    "phone",
    "email",
    "telegram",
    "vk",
    "instagram",
    "donation_title",
    "donation_text",
    "donation_receiver",
    "donation_card",
    "donation_bank",
    "donation_purpose",
    "donation_link",
  ].forEach((fieldName) => {
    const field = form[fieldName];
    if (!field) return;

    field.addEventListener("input", () => {
      fillContactsPreview(collectContactsPagePayload(form));
    });
  });
}

async function initDashboardContactsPage() {
  await initDashboardLayout("");

  const form = document.getElementById("contactsPageForm");
  const statusNode = document.getElementById("contactsPageFormStatus");
  const submitBtn = document.getElementById("contactsPageSubmitBtn");

  if (!form) return;

  bindBlockToggles();
  bindContactsLivePreview(form);

  let pageId = null;

  try {
    const pages = await getDashboardContactsPages();

    if (Array.isArray(pages) && pages.length > 0) {
      const page = pages[0];
      pageId = page.id;
      fillContactsPageForm(form, page);
    } else {
      fillContactsPreview({});
    }
  } catch (error) {
    console.error(error);
    statusNode.textContent = `Не удалось загрузить данные страницы: ${error.message}`;
    statusNode.className = "dashboard-form-status is-error";
    fillContactsPreview({});
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = collectContactsPagePayload(form);

    submitBtn.disabled = true;
    statusNode.textContent = "Сохраняем...";
    statusNode.className = "dashboard-form-status";

    try {
      if (pageId) {
        await updateDashboardContactsPage(pageId, payload);
      } else {
        const createdPage = await createDashboardContactsPage(payload);
        pageId = createdPage.id;
      }

      fillContactsPreview(payload);

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

initDashboardContactsPage();