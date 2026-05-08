from rest_framework import serializers
from .models import Animal


class DashboardAnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = [
            "id",
            "name",
            "slug",
            "animal_type",
            "gender",
            "age_text",
            "breed",
            "city",
            "short_description",
            "description",
            "main_image",
            "status",
            "is_published",
            "is_featured",
            "vaccinated",
            "sterilized",
            "good_with_kids",
            "good_with_animals",
            "created_at",
            "updated_at",
        ]