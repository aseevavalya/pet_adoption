from django.db import models
from apps.animals.models import Animal


class AdoptionRequest(models.Model):
    class YesNo(models.TextChoices):
        YES = "yes", "Да"
        NO = "no", "Нет"

    class HomeType(models.TextChoices):
        HOUSE = "house", "Дом"
        APARTMENT = "apartment", "Квартира"

    class Attitude(models.TextChoices):
        POSITIVE = "positive", "Положительно"
        NEGATIVE = "negative", "Отрицательно"
        NEUTRAL = "neutral", "Все равно"

    class Status(models.TextChoices):
        NEW = "new", "Новая"
        IN_PROGRESS = "in_progress", "В работе"
        CONTACTED = "contacted", "Связались"
        APPROVED = "approved", "Одобрено"
        REJECTED = "rejected", "Отказ"
        CLOSED = "closed", "Закрыта"

    animal = models.ForeignKey(
        Animal,
        on_delete=models.CASCADE,
        related_name="adoption_requests",
        verbose_name="Животное",
    )
    full_name = models.CharField("ФИО", max_length=150)
    birth_date = models.DateField("Дата рождения", blank=True, null=True)
    phone = models.CharField("Телефон", max_length=50)
    email = models.EmailField("Email", blank=True)
    city = models.CharField("Город", max_length=100, blank=True)
    social_accounts = models.TextField("Аккаунты в соцсетях", blank=True)
    home_type = models.CharField(
        "Где будет проживать животное",
        max_length=20,
        choices=HomeType.choices,
        blank=True,
    )
    ventilation_safety = models.CharField(
        "Знает об опасности вертикального проветривания",
        max_length=10,
        choices=YesNo.choices,
        blank=True,
    )
    window_screens = models.TextField("Сетки на окнах / готовность установить", blank=True)
    vaccination_attitude = models.CharField(
        "Отношение к вакцинации",
        max_length=20,
        choices=Attitude.choices,
        blank=True,
    )
    self_walk_attitude = models.CharField(
        "Отношение к самовыгулу",
        max_length=20,
        choices=Attitude.choices,
        blank=True,
    )
    sterilization_attitude = models.CharField(
        "Отношение к стерилизации/кастрации",
        max_length=20,
        choices=Attitude.choices,
        blank=True,
    )
    treatment_budget = models.TextField("Средства на лечение в семейном бюджете", blank=True)
    return_reasons = models.TextField("Причины возврата животного", blank=True)
    home_updates = models.CharField(
        "Готовность высылать фото и видео-приветы",
        max_length=10,
        choices=YesNo.choices,
        blank=True,
    )
    home_delivery = models.CharField(
        "Подходит доставка питомца в новый дом",
        max_length=10,
        choices=YesNo.choices,
        blank=True,
    )
    message = models.TextField("Сообщение", blank=True)

    status = models.CharField("Статус", max_length=20, choices=Status.choices, default=Status.NEW)
    admin_comment = models.TextField("Комментарий администратора", blank=True)

    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Заявка на животное"
        verbose_name_plural = "Заявки на животных"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} → {self.animal.name}"

