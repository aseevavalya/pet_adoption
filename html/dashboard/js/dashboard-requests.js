function dashboardHumanRequestStatus(value) {
  if (value === "new") return "Новая";
  if (value === "in_progress") return "В работе";
  if (value === "contacted") return "Связались";
  if (value === "approved") return "Одобрено";
  if (value === "rejected") return "Отказ";
  if (value === "closed") return "Закрыта";
  return value || "Без статуса";
}

function formatDashboardDate(value) {
  if (!value) return "Дата неизвестна";

  try {
    return new Date(value).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (_) {
    return value;
  }
}

async function initDashboardRequests() {
  await initDashboardLayout("");

  const listNode = document.getElementById("requestsList");
  const searchNode = document.getElementById("requestsSearch");
  const statusNode = document.getElementById("requestsStatusFilter");

  let requests = [];

  function getFilteredRequests() {
    const searchValue = (searchNode?.value || "").toLowerCase().trim();
    const statusValue = statusNode?.value || "";

    return requests.filter((request) => {
      const haystack = `
        ${request.full_name || ""}
        ${request.phone || ""}
        ${request.email || ""}
        ${request.city || ""}
        ${request.message || ""}
        ${request.animal_name || ""}
        ${request.admin_comment || ""}
      `.toLowerCase();

      const matchesSearch = haystack.includes(searchValue);
      const matchesStatus = !statusValue || request.status === statusValue;

      return matchesSearch && matchesStatus;
    });
  }

  function renderRequests() {
    const filtered = getFilteredRequests();

    listNode.innerHTML = filtered.length
      ? filtered.map((request) => `
          <article class="dashboard-request-card" data-request-id="${request.id}">
            <div class="dashboard-request-card__main">
              <h3 class="dashboard-request-card__title">${request.full_name}</h3>

              <div class="dashboard-request-card__meta">
                <span>${formatDashboardDate(request.created_at)}</span>
                <span>${request.phone || "Телефон не указан"}</span>
                ${request.email ? `<span>${request.email}</span>` : ""}
                ${request.city ? `<span>${request.city}</span>` : ""}
                ${request.animal_name ? `
                  <div class="dashboard-request-animal-wrap">
                    <span class="dashboard-request-animal-label">Животное:</span>
                    <a
                      class="dashboard-request-animal-link"
                      href="../catalog.html?animal=${request.animal_slug}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ${request.animal_name}
                    </a>
                  </div>
                ` : `<span class="dashboard-request-animal">Животное не выбрано</span>`}
              </div>

              <div class="dashboard-request-message-box">
                <div class="dashboard-request-message-label">Сообщение:</div>
                <div class="dashboard-request-card__message">${(request.message || "Пользователь ничего не написал.").trim()}</div>
              </div>
            </div>

            <div class="dashboard-request-card__sidebar">
              <div class="dashboard-request-box">
                <label class="dashboard-request-box__label" for="status-${request.id}">
                  Статус
                </label>
                <select
                  class="dashboard-request-select"
                  id="status-${request.id}"
                  data-status-id="${request.id}"
                >
                  <option value="new" ${request.status === "new" ? "selected" : ""}>Новая</option>
                  <option value="in_progress" ${request.status === "in_progress" ? "selected" : ""}>В работе</option>
                  <option value="contacted" ${request.status === "contacted" ? "selected" : ""}>Связались</option>
                  <option value="approved" ${request.status === "approved" ? "selected" : ""}>Одобрено</option>
                  <option value="rejected" ${request.status === "rejected" ? "selected" : ""}>Отказ</option>
                  <option value="closed" ${request.status === "closed" ? "selected" : ""}>Закрыта</option>
                </select>
                <p class="dashboard-request-status-note">
                  Сейчас: ${dashboardHumanRequestStatus(request.status)}
                </p>
              </div>

              <div class="dashboard-request-box">
                <label class="dashboard-request-box__label" for="comment-${request.id}">
                  Комментарий администратора
                </label>
                <textarea
                  class="dashboard-request-textarea"
                  id="comment-${request.id}"
                  data-comment-id="${request.id}"
                  placeholder="Например: созвонились, ждём ответ, договорились о встрече."
                >${request.admin_comment || ""}</textarea>
              </div>

              <div class="dashboard-request-actions">
                <button class="dashboard-btn" type="button" data-save-id="${request.id}">
                  Сохранить
                </button>
                <button
                  class="dashboard-mini-btn dashboard-mini-btn--danger"
                  type="button"
                  data-delete-id="${request.id}"
                >
                  Удалить
                </button>
              </div>
            </div>
          </article>
        `).join("")
      : `<p class="dashboard-empty">По этим параметрам заявок не найдено.</p>`;
  }

  async function getDashboardRequests(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query
    ? `${DASHBOARD_API_BASE}/dashboard/requests/?${query}`
    : `${DASHBOARD_API_BASE}/dashboard/requests/`;

  return dashboardRequest(url);
  }

  async function loadRequests() {
    try {
      requests = await getDashboardRequests();
      renderRequests();
    } catch (error) {
      console.error(error);
      listNode.innerHTML = `<p class="dashboard-empty">Не удалось загрузить заявки.</p>`;
    }
  }

  searchNode?.addEventListener("input", renderRequests);
  statusNode?.addEventListener("change", renderRequests);

  listNode.addEventListener("click", async (event) => {
    const saveButton = event.target.closest("[data-save-id]");

    if (saveButton) {
      const requestId = saveButton.dataset.saveId;
      const statusField = listNode.querySelector(`[data-status-id="${requestId}"]`);
      const commentField = listNode.querySelector(`[data-comment-id="${requestId}"]`);

      try {
        saveButton.disabled = true;
        saveButton.textContent = "Сохраняем...";

        const updated = await updateDashboardRequest(requestId, {
          status: statusField?.value || "new",
          admin_comment: commentField?.value || "",
        });

        requests = requests.map((item) =>
          String(item.id) === String(requestId)
            ? { ...item, ...updated }
            : item
        );

        renderRequests();
      } catch (error) {
        console.error(error);
        alert("Не удалось сохранить изменения по заявке.");
      }

      return;
    }

    const deleteButton = event.target.closest("[data-delete-id]");

    if (deleteButton) {
      const requestId = deleteButton.dataset.deleteId;
      const confirmed = window.confirm("Удалить заявку? Это действие нельзя быстро отменить.");

      if (!confirmed) return;

      try {
        await deleteDashboardRequest(requestId);
        requests = requests.filter((item) => String(item.id) !== String(requestId));
        renderRequests();
      } catch (error) {
        console.error(error);
        alert("Не удалось удалить заявку.");
      }
    }
  });

  await loadRequests();
}

initDashboardRequests();