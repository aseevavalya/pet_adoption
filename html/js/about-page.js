const ABOUT_API_URL = "http://127.0.0.1:8000/api/pages/about/";

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

async function loadAboutPage() {
  try {
    const response = await fetch(ABOUT_API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const page = await response.json();

    setText("aboutTitle", page.title, "О НАС");
    setText("aboutStoryTitle", page.story_title, "История проекта");
    setHtml(
      "aboutStoryContent",
      page.story_content,
      "<p>Здесь скоро появится история проекта.</p>"
    );
  } catch (error) {
    console.error("Не удалось загрузить страницу «О нас»", error);
  }
}

loadAboutPage();
