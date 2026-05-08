function getAnimalIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function transliterate(text) {
  const map = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };

  return text
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("");
}

function slugify(value) {
  return transliterate(value)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "")
    .replace(/\-\-+/g, "-");
}

function showPreview(imageUrl) {
  const previewImg = document.getElementById("animalImagePreview");
  const previewEmpty = document.getElementById("animalImagePreviewEmpty");

  if (!previewImg || !previewEmpty) return;

  previewImg.src = imageUrl;
  previewImg.hidden = false;
  previewEmpty.hidden = true;
}

function clearPreview() {
  const previewImg = document.getElementById("animalImagePreview");
  const previewEmpty = document.getElementById("animalImagePreviewEmpty");

  if (!previewImg || !previewEmpty) return;

  previewImg.removeAttribute("src");
  previewImg.hidden = true;
  previewEmpty.hidden = false;
}

function fillAnimalForm(form, animal) {
  form.name.value = animal.name || "";
  form.slug.value = animal.slug || "";
  form.animal_type.value = animal.animal_type || "";
  form.gender.value = animal.gender || "";
  form.age_text.value = animal.age_text || "";
  form.breed.value = animal.breed || "";
  form.city.value = animal.city || "";
  form.short_description.value = animal.short_description || "";
  form.description.value = animal.description || "";
  form.status.value = animal.status || "available";
  form.is_published.checked = Boolean(animal.is_published);
  form.vaccinated.checked = Boolean(animal.vaccinated);
  form.sterilized.checked = Boolean(animal.sterilized);
  form.good_with_kids.checked = Boolean(animal.good_with_kids);
  form.good_with_animals.checked = Boolean(animal.good_with_animals);

  if (animal.main_image) {
    showPreview(dashboardImageUrl(animal.main_image));
  } else {
    clearPreview();
  }
}

function collectAnimalPayload(form) {
  const formData = new FormData();

  formData.append("name", form.name.value.trim());
  formData.append("slug", form.slug.value.trim());
  formData.append("animal_type", form.animal_type.value);
  formData.append("gender", form.gender.value);
  formData.append("age_text", form.age_text.value.trim());
  formData.append("breed", form.breed.value.trim());
  formData.append("city", form.city.value.trim());
  formData.append("short_description", form.short_description.value.trim());
  formData.append("description", form.description.value.trim());
  formData.append("status", form.status.value);

  formData.append("is_published", String(form.is_published.checked));
  formData.append("vaccinated", String(form.vaccinated.checked));
  formData.append("sterilized", String(form.sterilized.checked));
  formData.append("good_with_kids", String(form.good_with_kids.checked));
  formData.append("good_with_animals", String(form.good_with_animals.checked));

  const imageFile = form.main_image?.files?.[0];
  if (imageFile) {
    formData.append("main_image", imageFile);
  }

  return formData;
}

async function initDashboardAnimalForm() {
  await initDashboardLayout("");

  const form = document.getElementById("animalForm");
  const heading = document.getElementById("animalFormHeading");
  const lead = document.getElementById("animalFormLead");
  const statusNode = document.getElementById("animalFormStatus");
  const submitBtn = document.getElementById("animalSubmitBtn");
  const imageInput = document.getElementById("animalMainImage");

  const animalId = getAnimalIdFromUrl();

  if (!form) return;

  form.name.addEventListener("input", () => {
    if (!form.slug.dataset.userEdited) {
      form.slug.value = slugify(form.name.value);
    }
  });

  form.slug.addEventListener("input", () => {
    form.slug.dataset.userEdited = "true";
  });

  imageInput?.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) {
      clearPreview();
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    showPreview(objectUrl);
  });

  if (animalId) {
    heading.textContent = "Редактировать животное";
    lead.textContent = "Измените данные карточки животного.";

    try {
      const animal = await getDashboardAnimalById(animalId);
      fillAnimalForm(form, animal);
    } catch (error) {
      console.error(error);
      statusNode.textContent = "Ошибка загрузки данных животного.";
      statusNode.className = "dashboard-form-status is-error";
    }
  } else {
    clearPreview();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = collectAnimalPayload(form);

    submitBtn.disabled = true;
    statusNode.textContent = animalId
      ? "Сохраняем изменения..."
      : "Создаём карточку...";
    statusNode.className = "dashboard-form-status";

    try {
      if (animalId) {
        await updateDashboardAnimal(animalId, payload);
        statusNode.textContent = "Изменения сохранены.";
      } else {
        await createDashboardAnimal(payload);
        statusNode.textContent = "Животное успешно добавлено.";
      }

      statusNode.className = "dashboard-form-status is-success";
      window.location.href = "animals.html";
      return;
    } catch (error) {
      console.error(error);
      statusNode.textContent = "Не удалось сохранить данные. Проверь обязательные поля, slug и файл изображения.";
      statusNode.className = "dashboard-form-status is-error";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

initDashboardAnimalForm();