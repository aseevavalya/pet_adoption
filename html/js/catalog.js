const API_BASE = "http://127.0.0.1:8000/api";
const MEDIA_BASE = "http://127.0.0.1:8000";

const animalList = document.getElementById("animalList");
const animalDetails = document.getElementById("animalDetails");
const filterSex = document.getElementById("filterSex");
const filterAge = document.getElementById("filterAge");
const filterColor = document.getElementById("filterColor");
const prevAnimalBtn = document.getElementById("prevAnimal");
const nextAnimalBtn = document.getElementById("nextAnimal");
const openDetailsBtn = document.getElementById("openDetails");

let animals = [];
let filteredAnimals = [];
let currentIndex = 0;

function apiImageUrl(path) {
  if (!path) return "img/about-project.png";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${MEDIA_BASE}${path}`;
}

function humanGender(value) {
  if (value === "male") return "мальчик";
  if (value === "female") return "девочка";
  return "не указан";
}

function humanAnimalType(value) {
  if (value === "cat") return "Кошка";
  if (value === "dog") return "Собака";
  return "Животное";
}

function inferAgeGroup(ageText = "") {
  const value = ageText.toLowerCase();
  if (!value) return "";
  if (value.includes("месяц") || value.includes("кот") || value.includes("щен")) return "котёнок";
  if (value.includes("год") || value.includes("года") || value.includes("лет")) {
    const numberMatch = value.match(/\d+/);
    const ageNumber = numberMatch ? Number(numberMatch[0]) : null;
    if (ageNumber !== null && ageNumber <= 1) return "молодой";
    if (ageNumber !== null && ageNumber <= 3) return "молодой";
    return "взрослый";
  }
  return "";
}

function animalColorText(animal) {
  return `${animal.breed || ""} ${animal.short_description || ""} ${animal.description || ""}`.toLowerCase();
}

async function fetchAnimals() {
  const response = await fetch(`${API_BASE}/animals/`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function createAdoptionRequest(payload) {
  const response = await fetch(`${API_BASE}/requests/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;

    try {
      const data = await response.json();
      message = JSON.stringify(data);
    } catch (_) {}

    throw new Error(message);
  }

  return response.json();
}

function getCardState(index, total) {
  if (index === currentIndex) return "is-active";

  if (index === currentIndex - 1 || (currentIndex === 0 && index === total - 1)) {
    return "is-prev";
  }

  if (index === currentIndex + 1 || (currentIndex === total - 1 && index === 0)) {
    return "is-next";
  }

  return "is-hidden";
}

function renderAnimals(list = filteredAnimals) {
  if (!animalList) return;

  if (!list.length) {
    animalList.innerHTML = '<p class="empty-state">По этим параметрам пока никого не найдено.</p>';
    return;
  }

  animalList.innerHTML = list.map((animal, index) => {
    const stateClass = getCardState(index, list.length);

    return `
      <article class="deck-card deck-card--media media-card ${stateClass}" data-id="${animal.id}"
      style="--card-image: url('${apiImageUrl(animal.main_image)}');">
        <div class="deck-card-frame media-card__frame">
          <img
            class="deck-card-image media-card__image"
            src="${apiImageUrl(animal.main_image)}"
            alt="${animal.name}"
          >

          <div class="deck-card-overlay media-card__overlay">
            <div class="deck-card-content media-card__content">
              <h3 class="deck-card-title media-card__title">${animal.name}</h3>
              <p class="deck-card-text media-card__text">
                ${animal.short_description || "Ищет дом и человека рядом."}
              </p>
              <div class="deck-card-meta">
                <span class="deck-card-meta-item">${animal.age_text || "Возраст уточняется"}</span>
                <span class="deck-card-meta-item">${humanAnimalType(animal.animal_type)}</span>
                <span class="deck-card-meta-item">${humanGender(animal.gender)}</span>
              </div>

              <button class="btn btn-primary deck-card-btn" type="button" data-open-animal="${animal.id}">
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  animalList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-animal]");
    if (!button) return;

    const animalId = Number(button.dataset.openAnimal);
    const foundIndex = filteredAnimals.findIndex((animal) => animal.id === animalId);
    if (foundIndex === -1) return;

    currentIndex = foundIndex;
    renderAnimals(filteredAnimals);
    openCurrentAnimalDetails();
  });
}

function showNextAnimal() {
  if (!filteredAnimals.length) return;
  currentIndex = (currentIndex + 1) % filteredAnimals.length;
  renderAnimals(filteredAnimals);
}

function showPrevAnimal() {
  if (!filteredAnimals.length) return;
  currentIndex = (currentIndex - 1 + filteredAnimals.length) % filteredAnimals.length;
  renderAnimals(filteredAnimals);
}

function renderRequestForm(animal) {
  return `
    <section class="adoption-request-panel">
      <div class="adoption-request-head">
        <span class="section-kicker">заявка</span>
        <h3>Хочу познакомиться с ${animal.name}</h3>
        <p>Расскажите о себе и условиях, в которых будет жить питомец. Это помогает нам бережно выбирать новый дом.</p>
      </div>

      <form class="adoption-request-form" id="adoptionRequestForm">
        <input type="hidden" name="animal" value="${animal.id}">

        <label>
          <span>ФИО *</span>
          <input class="request-input" type="text" name="full_name" required>
        </label>

        <label>
          <span>Дата рождения *</span>
          <input class="request-input" type="date" name="birth_date" required>
        </label>

        <label>
          <span>Телефон *</span>
          <input class="request-input" type="tel" name="phone" required>
        </label>

        <label>
          <span>Email</span>
          <input class="request-input" type="email" name="email">
        </label>

        <label>
          <span>Город</span>
          <input class="request-input" type="text" name="city">
        </label>

        <label class="request-field-full">
          <span>Аккаунты в соцсетях</span>
          <textarea class="request-textarea request-textarea--small" name="social_accounts" placeholder="Ссылки на VK, Telegram, Instagram или другие страницы"></textarea>
        </label>

        <label>
          <span>Где будет проживать животное? *</span>
          <select class="request-input request-select" name="home_type" required>
            <option value="">Выберите вариант</option>
            <option value="house">Дом</option>
            <option value="apartment">Квартира</option>
          </select>
        </label>

        <label>
          <span>Знаете ли вы об опасности вертикального проветривания? *</span>
          <select class="request-input request-select" name="ventilation_safety" required>
            <option value="">Выберите вариант</option>
            <option value="yes">Да</option>
            <option value="no">Нет</option>
          </select>
        </label>

        <label class="request-field-full">
          <span>Есть ли у вас сетки на окнах? Готовы ли установить, если нет? *</span>
          <textarea class="request-textarea request-textarea--small" name="window_screens" required></textarea>
        </label>

        <label>
          <span>Как вы относитесь к вакцинации? *</span>
          <select class="request-input request-select" name="vaccination_attitude" required>
            <option value="">Выберите вариант</option>
            <option value="positive">Положительно</option>
            <option value="negative">Отрицательно</option>
            <option value="neutral">Все равно</option>
          </select>
        </label>

        <label>
          <span>Как вы относитесь к самовыгулу? *</span>
          <select class="request-input request-select" name="self_walk_attitude" required>
            <option value="">Выберите вариант</option>
            <option value="positive">Положительно</option>
            <option value="negative">Отрицательно</option>
            <option value="neutral">Все равно</option>
          </select>
        </label>

        <label>
          <span>Как вы относитесь к стерилизации/кастрации? *</span>
          <select class="request-input request-select" name="sterilization_attitude" required>
            <option value="">Выберите вариант</option>
            <option value="positive">Положительно</option>
            <option value="negative">Отрицательно</option>
            <option value="neutral">Все равно</option>
          </select>
        </label>

        <label class="request-field-full">
          <span>Если животное заболеет, есть ли в семейном бюджете средства на лечение? *</span>
          <textarea class="request-textarea request-textarea--small" name="treatment_budget" required></textarea>
        </label>

        <label class="request-field-full">
          <span>Какие причины могут заставить вас вернуть животное? *</span>
          <textarea class="request-textarea request-textarea--small" name="return_reasons" required></textarea>
        </label>

        <label>
          <span>Готовы ли вы высылать фото и видео-приветы из дома? *</span>
          <select class="request-input request-select" name="home_updates" required>
            <option value="">Выберите вариант</option>
            <option value="yes">Да</option>
            <option value="no">Нет</option>
          </select>
        </label>

        <label>
          <span>Всех своих питомцев мы сами привозим в новый дом. Подходит ли вам это? *</span>
          <select class="request-input request-select" name="home_delivery" required>
            <option value="">Выберите вариант</option>
            <option value="yes">Да</option>
            <option value="no">Нет</option>
          </select>
        </label>

        <label class="request-field-full">
          <span>Сообщение</span>
          <textarea class="request-textarea" name="message" placeholder="Можно добавить любые важные детали или вопросы."></textarea>
        </label>

        <p class="request-form-note">
          Почему анкета такая большая? <a href="why-adoption-questionnaire.html">Прочитайте тут.</a>
        </p>

        <div class="request-form-actions">
          <button class="btn btn-primary" type="submit">Отправить заявку</button>
          <div class="request-form-status" id="requestFormStatus"></div>
        </div>
      </form>
    </section>
  `;
}

function openCurrentAnimalDetails() {
  const animal = filteredAnimals[currentIndex];
  if (!animalDetails || !animal) return;

  animalDetails.innerHTML = `
    <article class="animal-full-card animal-full-card--accent">
      <div class="surface-panel__body">
        <div class="animal-full-aside">
          <div class="animal-full-photo-wrap">
            <img src="${apiImageUrl(animal.main_image)}" alt="${animal.name}" class="animal-full-photo">
          </div>

          <button
            class="btn btn-primary animal-request-toggle"
            id="animalRequestToggle"
            type="button"
            aria-expanded="false"
            aria-controls="animalRequestPanel"
          >
            Оставить заявку
          </button>
        </div>

        <div class="animal-full-content">
          <div class="animal-full-content-main">
            <h2>${animal.name}</h2>

            <div class="animal-meta">
              <span>${humanAnimalType(animal.animal_type)}</span>
              <span>Возраст: ${animal.age_text || "уточняется"}</span>
              <span>Пол: ${humanGender(animal.gender)}</span>
              ${animal.city ? `<span>Город: ${animal.city}</span>` : ""}
              ${animal.breed ? `<span>Порода: ${animal.breed}</span>` : ""}
            </div>

            <div class="animal-block">
              <h3>Кратко</h3>
              <p>${animal.short_description || "Описание скоро появится."}</p>
            </div>

            <div class="animal-block animal-block--accent">
              <h3>История и подробности</h3>
              <p>${animal.description || "Подробное описание скоро появится."}</p>
            </div>

            <div class="animal-block">
              <h3>Что важно знать</h3>
              <div class="animal-meta">
                <span>${animal.vaccinated ? "Привит" : "Прививки уточняются"}</span>
                <span>${animal.sterilized ? "Стерилизован" : "Стерилизация уточняется"}</span>
                <span>${animal.good_with_kids ? "Ладит с детьми" : "Контакт с детьми уточняется"}</span>
                <span>${animal.good_with_animals ? "Ладит с животными" : "Контакт с животными уточняется"}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="animal-request-wrap hidden"
          id="animalRequestPanel"
        >
          ${renderRequestForm(animal)}
        </div>
      </div>
    </article>
  `;

  bindRequestForm(animal);
  bindRequestToggle();
  animalDetails.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindRequestToggle() {
  const toggleButton = document.getElementById("animalRequestToggle");
  const requestPanel = document.getElementById("animalRequestPanel");

  if (!toggleButton || !requestPanel) return;

  toggleButton.addEventListener("click", () => {
    const isHidden = requestPanel.classList.contains("hidden");

    requestPanel.classList.toggle("hidden", !isHidden);
    toggleButton.setAttribute("aria-expanded", String(isHidden));
    toggleButton.textContent = isHidden ? "Скрыть заявку" : "Оставить заявку";

    if (isHidden) {
      requestPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function bindRequestForm(animal) {
  const form = document.getElementById("adoptionRequestForm");
  const statusNode = document.getElementById("requestFormStatus");
  if (!form || !statusNode) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.animal = Number(payload.animal);

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Отправляем...";
      }

      statusNode.textContent = "";
      await createAdoptionRequest(payload);
      form.reset();
      form.querySelector('[name="animal"]').value = String(animal.id);
      statusNode.textContent = "Спасибо! Заявка отправлена. С вами свяжутся.";
      statusNode.className = "request-form-status is-success";
    } catch (error) {
      console.error(error);
      statusNode.textContent = "Не удалось отправить заявку. Проверьте поля и попробуйте ещё раз.";
      statusNode.className = "request-form-status is-error";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Отправить заявку";
      }
    }
  });
}

function openAnimalFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const animalSlug = params.get("animal");

  if (!animalSlug || !filteredAnimals.length) return;

  const foundIndex = filteredAnimals.findIndex(
    (animal) => animal.slug === animalSlug
  );

  if (foundIndex === -1) return;

  currentIndex = foundIndex;
  renderAnimals(filteredAnimals);
  openCurrentAnimalDetails();
}

function applyFilters() {
  const sex = filterSex?.value || "";
  const age = filterAge?.value || "";
  const color = filterColor?.value || "";

  filteredAnimals = animals.filter((animal) => {
    const animalSex = humanGender(animal.gender);
    const animalAgeGroup = inferAgeGroup(animal.age_text || "");
    const colorText = animalColorText(animal);

    const matchesSex = !sex || animalSex === sex;
    const matchesAge = !age || animalAgeGroup === age;
    const matchesColor = !color || colorText.includes(color.toLowerCase());
    return matchesSex && matchesAge && matchesColor;
  });

  currentIndex = 0;
  renderAnimals(filteredAnimals);

  if (!filteredAnimals.length && animalDetails) {
    animalDetails.innerHTML = "";
  }
}

async function initCatalog() {
  try {
    animals = await fetchAnimals();
    filteredAnimals = [...animals];
    renderAnimals(filteredAnimals);
    openAnimalFromUrl();
  } catch (error) {
    console.error(error);
    if (animalList) {
      animalList.innerHTML = '<p class="empty-state">Не удалось загрузить каталог. Проверьте, запущен ли бэкенд.</p>';
    }
  }
}

filterSex?.addEventListener("change", applyFilters);
filterAge?.addEventListener("change", applyFilters);
filterColor?.addEventListener("change", applyFilters);
nextAnimalBtn?.addEventListener("click", showNextAnimal);
prevAnimalBtn?.addEventListener("click", showPrevAnimal);

initCatalog();
