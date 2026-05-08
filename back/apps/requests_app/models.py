from django.db import models
from apps.animals.models import Animal


class AdoptionRequest(models.Model):
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
    full_name = models.CharField("Имя", max_length=150)
    phone = models.CharField("Телефон", max_length=50)
    email = models.EmailField("Email", blank=True)
    city = models.CharField("Город", max_length=100, blank=True)
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

