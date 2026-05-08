function dashboardHumanRequestStatus(value) {
  if (value === "new") return "Новая";
  if (value === "in_progress") return "В работе";
  if (value === "contacted") return "Связались";
  if (value === "approved") return "Одобрено";
  if (value === "rejected") return "Отказ";
  if (value === "closed") return "Закрыта";
  return value || "Без статуса";
}

function dashboardHumanAnimalType(value) {
  if (value === "cat") return "Кошка";
  if (value === "dog") return "Собака";
  return value || "Животное";
}

function dashboardHumanAnimalStatus(value) {
  if (value === "available") return "Ищет дом";
  if (value === "reserved") return "Забронирован";
  if (value === "adopted") return "Дома";
  if (value === "treatment") return "На лечении";
  return value || "Статус не указан";
}

function dashboardRequestBadgeClass(value) {
  if (value === "new") return "dashboard-badge dashboard-badge--warning";
  if (value === "in_progress") return "dashboard-badge dashboard-badge--danger";
  if (value === "approved") return "dashboard-badge dashboard-badge--success";
  return "dashboard-badge";
}

async function initDashboardIndex() {
  await initDashboardLayout("Административная панель");

  const animalsCountNode = document.getElementById("animalsCount");
  const draftArticlesCountNode = document.getElementById("draftArticlesCount");
  const newRequestsCountNode = document.getElementById("newRequestsCount");
  const latestAnimalsNode = document.getElementById("latestAnimals");
  const latestRequestsNode = document.getElementById("latestRequests");

  try {
    const [animals, articles, requests] = await Promise.all([
      getDashboardAnimals(),
      getDashboardArticles(),
      getDashboardRequests(),
    ]);

    if (animalsCountNode) {
      animalsCountNode.textContent = animals.length;
    }

    if (draftArticlesCountNode) {
      const draftArticles = articles.filter((article) => !article.is_published);
      draftArticlesCountNode.textContent = draftArticles.length;
    }

    if (newRequestsCountNode) {
      const newRequests = requests.filter((request) => request.status === "new");
      newRequestsCountNode.textContent = newRequests.length;
    }

    if (latestAnimalsNode) {
      const latestAnimals = animals.slice(0, 3);

      latestAnimalsNode.innerHTML = latestAnimals.length
        ? latestAnimals.map((animal) => `
            <div class="dashboard-row-card dashboard-row-card--compact">
              <div class="dashboard-row-card__image-wrap">
                <img
                  class="dashboard-row-card__image"
                  src="${dashboardImageUrl(animal.main_image)}"
                  alt="${animal.name}"
                  onerror="this.parentElement.classList.add('is-fallback'); this.removeAttribute('src');"
                >
              </div>

              <div>
                <h3 class="dashboard-row-card__title">${animal.name}</h3>
                <p class="dashboard-row-card__meta">
                  ${animal.age_text || "Возраст уточняется"} · ${animal.city || "Город не указан"}
                </p>

                <div class="dashboard-badges">
                  <span class="dashboard-badge">${dashboardHumanAnimalType(animal.animal_type)}</span>
                  <span class="dashboard-badge dashboard-badge--success">${dashboardHumanAnimalStatus(animal.status)}</span>
                </div>
              </div>

              <div class="dashboard-row-card__actions">
                <a class="dashboard-mini-btn" href="animal-form.html?id=${animal.id}">Открыть</a>
              </div>
            </div>
          `).join("")
        : `<p class="dashboard-empty">Пока нет животных для отображения.</p>`;
    }

    if (latestRequestsNode) {
      const latestRequests = requests.slice(0, 3);

      latestRequestsNode.innerHTML = latestRequests.length
        ? latestRequests.map((request) => `
            <div class="dashboard-row-card dashboard-row-card--compact dashboard-row-card--request">
              <div>
                <h3 class="dashboard-row-card__title">${request.full_name || "Без имени"}</h3>
                <p class="dashboard-row-card__meta">
                  ${request.city || "Город не указан"} · ${request.phone || "Телефон не указан"}
                </p>
                <p class="dashboard-row-card__desc">
                  ${request.animal?.name ? `Заявка на: ${request.animal.name}` : "Животное не указано"}
                </p>

                <div class="dashboard-badges">
                  <span class="${dashboardRequestBadgeClass(request.status)}">
                    ${dashboardHumanRequestStatus(request.status || "new")}
                  </span>
                </div>
              </div>

              <div class="dashboard-row-card__actions">
                <a class="dashboard-mini-btn" href="requests.html">Открыть</a>
              </div>
            </div>
          `).join("")
        : `<p class="dashboard-empty">Пока нет заявок для отображения.</p>`;
    }
  } catch (error) {
    console.error(error);

    if (latestAnimalsNode) {
      latestAnimalsNode.innerHTML = `<p class="dashboard-empty">Не удалось загрузить животных.</p>`;
    }

    if (latestRequestsNode) {
      latestRequestsNode.innerHTML = `<p class="dashboard-empty">Не удалось загрузить заявки.</p>`;
    }
  }
}

initDashboardIndex();