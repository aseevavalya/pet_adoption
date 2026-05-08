from rest_framework import generics
from .models import Animal
from .serializers import AnimalListSerializer, AnimalDetailSerializer


class AnimalListAPIView(generics.ListAPIView):
    serializer_class = AnimalListSerializer

    def get_queryset(self):
        queryset = Animal.objects.filter(is_published=True).exclude(status=Animal.Status.HIDDEN)

        animal_type = self.request.GET.get("animal_type")
        gender = self.request.GET.get("gender")
        status_value = self.request.GET.get("status")

        if animal_type:
            queryset = queryset.filter(animal_type=animal_type)

        if gender:
            queryset = queryset.filter(gender=gender)

        if status_value:
            queryset = queryset.filter(status=status_value)

        return queryset


class AnimalDetailAPIView(generics.RetrieveAPIView):
    serializer_class = AnimalDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Animal.objects.filter(is_published=True).exclude(status=Animal.Status.HIDDEN)