from django.contrib import admin
from .models import AboutPage, HelpPage, SiteSettings


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "updated_at")
    fields = ("title", "story_content", "updated_at")
    readonly_fields = ("updated_at",)


@admin.register(HelpPage)
class HelpPageAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "updated_at")


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ("id", "site_name", "updated_at")
