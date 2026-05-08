from django.db import models


class Animal(models.Model):
    class AnimalType(models.TextChoices):
        CAT = "cat", "Кошка"
        DOG = "dog", "Собака"
        OTHER = "other", "Другое"

    class Gender(models.TextChoices):
        MALE = "male", "Мальчик"
        FEMALE = "female", "Девочка"

    class Status(models.TextChoices):
        AVAILABLE = "available", "Ищет дом"
        RESERVED = "reserved", "Забронирован"
        ADOPTED = "adopted", "Пристроен"
        HIDDEN = "hidden", "Скрыт"

    name = models.CharField("Имя", max_length=100)
    slug = models.SlugField("Slug", unique=True)
    animal_type = models.CharField("Тип животного", max_length=20, choices=AnimalType.choices)
    gender = models.CharField("Пол", max_length=20, choices=Gender.choices)
    age_text = models.CharField("Возраст", max_length=100, blank=True)
    breed = models.CharField("Порода", max_length=100, blank=True)
    city = models.CharField("Город", max_length=100, blank=True)

    short_description = models.TextField("Краткое описание", blank=True)
    description = models.TextField("Полное описание")

    main_image = models.ImageField("Главное фото", upload_to="animals/", blank=True, null=True)

    status = models.CharField("Статус", max_length=20, choices=Status.choices, default=Status.AVAILABLE)

    is_published = models.BooleanField("Опубликовано", default=True)
    is_featured = models.BooleanField("Показывать на главной", default=False)

    vaccinated = models.BooleanField("Привит", default=False)
    sterilized = models.BooleanField("Стерилизован", default=False)
    good_with_kids = models.BooleanField("Ладит с детьми", default=False)
    good_with_animals = models.BooleanField("Ладит с животными", default=False)

    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Животное"
        verbose_name_plural = "Животные"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name