const CONTACTS_API_URL = "http://127.0.0.1:8000/api/pages/site-settings/";

function setContactsText(id, value, fallback = "") {
  const node = document.getElementById(id);
  if (!node) return;
  node.textContent = value || fallback;
}

function setContactLink(id, value, href) {
  const node = document.getElementById(id);
  if (!node) return;

  const valueNode = node.querySelector(".contact-value");
  if (valueNode) valueNode.textContent = value || "—";
  node.href = href || "#";
}

async function loadContactsPage() {
  try {
    const response = await fetch(CONTACTS_API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const page = await response.json();

    setContactsText("contactsTitle", page.contacts_title, "Связаться с нами");
    setContactsText("contactsLead", page.contacts_lead, "Здесь скоро появятся контактные данные.");

    setContactLink("contactVk", page.vk, page.vk);
    setContactLink("contactInstagram", page.instagram, page.instagram);
    setContactLink("contactTelegram", page.telegram, page.telegram);
    setContactLink("contactEmail", page.email, page.email ? `mailto:${page.email}` : "#");
    setContactLink("contactPhone", page.phone, page.phone ? `tel:${page.phone}` : "#");

    setContactsText("donationTitle", page.donation_title, "Поддержать проект");
    setContactsText("donationText", page.donation_text, "Здесь скоро появится информация о пожертвованиях.");
    setContactsText("donationReceiver", page.donation_receiver, "—");
    setContactsText("donationCard", page.donation_card, "—");
    setContactsText("donationBank", page.donation_bank, "—");
    setContactsText("donationPurpose", page.donation_purpose, "—");

    const donateBtn = document.getElementById("donateBtn");
    if (donateBtn && page.donation_link) donateBtn.href = page.donation_link;
  } catch (error) {
    console.error("Не удалось загрузить страницу «Контакты»", error);
  }
}

loadContactsPage();
