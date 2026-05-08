function dashboardHumanAnimalType(value) {
  if (value === "cat") return "Кошка";
  if (value === "dog") return "Собака";
  return "Другое";
}

function dashboardHumanStatus(value) {
  if (value === "available") return "Ищет дом";
  if (value === "reserved") return "Забронирован";
  if (value === "adopted") return "Пристроен";
  if (value === "hidden") return "Скрыт";
  return value || "Без статуса";
}

function getStatusBadgeClass(value) {
  if (value === "available") return "dashboard-badge dashboard-badge--success";
  if (value === "reserved") return "dashboard-badge dashboard-badge--warning";
  if (value === "hidden") return "dashboard-badge dashboard-badge--danger";
  return "dashboard-badge";
}

async function initDashboardAnimals() {
  await initDashboardLayout("");

  const listNode = document.getElementById("animalsList");
  const searchNode = document.getElementById("animalsSearch");
  const statusNode = document.getElementById("animalsStatusFilter");

  let animals = [];

  function renderAnimals() {
    const searchValue = (searchNode?.value || "").toLowerCase().trim();
    const statusValue = statusNode?.value || "";

    const filtered = animals.filter((animal) => {
      const text = `${animal.name} ${animal.city || ""} ${animal.short_description || ""}`.toLowerCase();
      const matchesSearch = text.includes(searchValue);
      const matchesStatus = !statusValue || animal.status === statusValue;
      return matchesSearch && matchesStatus;
    });

    listNode.innerHTML = filtered.length
  ? filtered.map((animal) => `
      <article class="dashboard-row-card dashboard-row-card--compact">
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
          <p class="dashboard-row-card__desc">
            ${animal.short_description || "Описание пока не добавлено."}
          </p>

          <div class="dashboard-badges">
            <span class="dashboard-badge">${dashboardHumanAnimalType(animal.animal_type)}</span>
            <span class="${getStatusBadgeClass(animal.status)}">${dashboardHumanStatus(animal.status)}</span>
          </div>
        </div>

        <div class="dashboard-row-card__actions">
          <a class="dashboard-mini-btn" href="animal-form.html?id=${animal.id}">Редактировать</a>
          <button class="dashboard-mini-btn" type="button">Скрыть</button>
          <button
            class="dashboard-mini-btn dashboard-mini-btn--danger"
            type="button"
            data-delete-id="${animal.id}"
          >
            Удалить
          </button>
        </div>
      </article>
    `).join("")
  : `<p class="dashboard-empty">По этим параметрам ничего не найдено.</p>`;
  }

  try {
    animals = await getDashboardAnimals();
    renderAnimals();
  } catch (error) {
    console.error(error);
    listNode.innerHTML = `<p class="dashboard-empty">Не удалось загрузить животных.</p>`;
  }

  searchNode?.addEventListener("input", renderAnimals);
  statusNode?.addEventListener("change", renderAnimals);

  listNode.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-id]");
    if (!button) return;

    const animalId = button.dataset.deleteId;
    const confirmed = window.confirm("Удалить животное?");
    if (!confirmed) return;

    try {
      await deleteDashboardAnimal(animalId);
      animals = animals.filter((animal) => String(animal.id) !== String(animalId));
      renderAnimals();
    } catch (error) {
      console.error(error);
      alert("Не удалось удалить животное.");
    }
  });
}

initDashboardAnimals();