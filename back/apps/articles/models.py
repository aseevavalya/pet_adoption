from django.db import models
from django.utils import timezone


class Article(models.Model):
    CATEGORY_ADAPTATION = "adaptation"
    CATEGORY_CARE = "care"
    CATEGORY_HEALTH = "health"
    CATEGORY_BEHAVIOR = "behavior"
    CATEGORY_OTHER = "other"

    CATEGORY_CHOICES = [
        (CATEGORY_ADAPTATION, "Адаптация"),
        (CATEGORY_CARE, "Уход"),
        (CATEGORY_HEALTH, "Здоровье"),
        (CATEGORY_BEHAVIOR, "Поведение"),
        (CATEGORY_OTHER, "Другое"),
    ]

    title = models.CharField("Заголовок", max_length=200)
    slug = models.SlugField("Slug", unique=True)
    category = models.CharField("Категория", max_length=30, choices=CATEGORY_CHOICES, default=CATEGORY_OTHER)
    excerpt = models.TextField("Краткое описание", blank=True)
    content = models.TextField("Содержание")
    cover_image = models.ImageField("Обложка", upload_to="articles/", blank=True, null=True)

    is_published = models.BooleanField("Опубликовано", default=False)
    published_at = models.DateTimeField("Дата публикации", blank=True, null=True)

    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.is_published and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)
