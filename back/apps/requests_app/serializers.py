from rest_framework import serializers
from .models import AdoptionRequest


class AdoptionRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdoptionRequest
        fields = [
            "animal",
            "full_name",
            "phone",
            "email",
            "city",
            "message",
        ]


class AdoptionRequestDashboardSerializer(serializers.ModelSerializer):
    animal_name = serializers.CharField(source="animal.name", read_only=True)
    animal_slug = serializers.CharField(source="animal.slug", read_only=True)

    class Meta:
        model = AdoptionRequest
        fields = [
            "id",
            "animal",
            "animal_name",
            "animal_slug",
            "full_name",
            "phone",
            "email",
            "city",
            "message",
            "status",
            "admin_comment",
            "created_at",
            "updated_at",
        ]


class AdoptionRequestDashboardUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdoptionRequest
        fields = ["status", "admin_comment"]
