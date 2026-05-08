from django.contrib import admin
from .models import AdoptionRequest


@admin.register(AdoptionRequest)
class AdoptionRequestAdmin(admin.ModelAdmin):
    list_display = ("full_name", "animal", "phone", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("full_name", "phone", "email", "animal__name")