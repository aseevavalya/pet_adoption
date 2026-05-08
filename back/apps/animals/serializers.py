from rest_framework import serializers
from .models import Animal


class AnimalListSerializer(serializers.ModelSerializer):
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
            "main_image",
            "status",
        ]


class AnimalDetailSerializer(serializers.ModelSerializer):
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
            "vaccinated",
            "sterilized",
            "good_with_kids",
            "good_with_animals",
        ]