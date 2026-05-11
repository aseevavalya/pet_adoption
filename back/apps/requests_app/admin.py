from django.contrib import admin
from .models import AdoptionRequest


@admin.register(AdoptionRequest)
class AdoptionRequestAdmin(admin.ModelAdmin):
    list_display = ("full_name", "animal", "phone", "home_type", "status", "created_at")
    list_filter = ("status", "home_type", "created_at")
    search_fields = ("full_name", "phone", "email", "social_accounts", "animal__name")
