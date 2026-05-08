from django.db import models


class AboutPage(models.Model):
    title = models.CharField("Заголовок", max_length=200, default="О проекте")
    lead = models.TextField("Краткое описание", blank=True)
    story_title = models.CharField("Заголовок истории", max_length=200, default="Как всё началось")
    story_content = models.TextField("Текст истории", blank=True)
    mission_title = models.CharField("Заголовок миссии", max_length=200, default="Почему это важно")
    mission_content = models.TextField("Текст миссии", blank=True)
    image = models.ImageField("Изображение", upload_to="pages/about/", blank=True, null=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Страница «О проекте»"
        verbose_name_plural = "Страница «О проекте»"

    def __str__(self):
        return "О проекте"


class HelpPage(models.Model):
    title = models.CharField("Заголовок", max_length=200, default="Чем помочь")
    lead = models.TextField("Подзаголовок / вводный текст", blank=True)
    content = models.TextField("Основной текст")
    donation_title = models.CharField("Заголовок блока пожертвований", max_length=200, blank=True)
    donation_details = models.TextField("Реквизиты / детали", blank=True)
    button_text = models.CharField("Текст кнопки", max_length=100, blank=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Страница «Как помочь»"
        verbose_name_plural = "Страница «Как помочь»"

    def __str__(self):
        return "Как помочь"


class SiteSettings(models.Model):
    site_name = models.CharField("Название сайта", max_length=200, default="МЫ ЗДЕСЬ")

    contacts_title = models.CharField("Заголовок страницы контактов", max_length=200, default="Связаться с нами")
    contacts_lead = models.TextField("Подзаголовок страницы контактов", blank=True)

    phone = models.CharField("Телефон", max_length=50, blank=True)
    email = models.EmailField("Email", blank=True)
    telegram = models.URLField("Telegram", blank=True)
    vk = models.URLField("VK", blank=True)
    instagram = models.URLField("Instagram", blank=True)

    donation_title = models.CharField("Заголовок блока пожертвований", max_length=200, default="Поддержать проект")
    donation_text = models.TextField("Текст блока пожертвований", blank=True)
    donation_card = models.CharField("Номер карты / IBAN", max_length=100, blank=True)
    donation_bank = models.CharField("Банк / BIC", max_length=100, blank=True)
    donation_receiver = models.CharField("Получатель", max_length=200, blank=True)
    donation_purpose = models.CharField("Назначение перевода", max_length=200, blank=True)
    donation_link = models.URLField("Ссылка на пожертвование", blank=True)

    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Контакты и настройки сайта"
        verbose_name_plural = "Контакты и настройки сайта"

    def __str__(self):
        return "Контакты и настройки сайта"

