const HELP_API_URL = "http://127.0.0.1:8000/api/pages/help/";

function setText(id, value, fallback = "") {
  const node = document.getElementById(id);
  if (!node) return;
  node.textContent = value || fallback;
}

function setHtml(id, value, fallback = "") {
  const node = document.getElementById(id);
  if (!node) return;
  node.innerHTML = value || fallback;
}

function renderHelpList(value) {
  const node = document.getElementById("helpContent");
  if (!node) return;

  const items = String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!items.length) {
    node.innerHTML = `<li class="help-list-item"><span class="help-list-dot"></span><span>Здесь скоро появятся варианты помощи.</span></li>`;
    return;
  }

  node.innerHTML = items
    .map((item) => `<li class="help-list-item"><span class="help-list-dot"></span><span>${item}</span></li>`)
    .join("");
}

async function loadHelpPage() {
  try {
    const response = await fetch(HELP_API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const page = await response.json();

    setText("helpTitle", page.title, "Как помочь");
    setText("helpLead", page.lead, "Здесь скоро появится описание вариантов помощи.");
    setText("helpDonationTitle", page.donation_title, "Поддержать проект");
    setHtml("helpDonationDetails", page.donation_details, "<p>Здесь скоро появятся реквизиты и детали помощи.</p>");
    setText("helpDonationButton", page.button_text, "Связаться →");
    renderHelpList(page.content);
  } catch (error) {
    console.error("Не удалось загрузить страницу «Как помочь»", error);
  }
}

loadHelpPage();
