from django.contrib import admin

from .models import Animal


@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ("name", "animal_type", "gender", "status", "is_published", "created_at")
    list_filter = ("animal_type", "gender", "status", "is_published")
    search_fields = ("name", "breed", "city")
    prepopulated_fields = {"slug": ("name",)}
# Register your models here.
