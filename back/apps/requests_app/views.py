from rest_framework import generics, viewsets, filters
from .models import AdoptionRequest
from .serializers import (
    AdoptionRequestCreateSerializer,
    AdoptionRequestDashboardSerializer,
    AdoptionRequestDashboardUpdateSerializer,
)
from rest_framework.permissions import IsAdminUser


class AdoptionRequestCreateAPIView(generics.CreateAPIView):
    queryset = AdoptionRequest.objects.all()
    serializer_class = AdoptionRequestCreateSerializer


class DashboardAdoptionRequestViewSet(viewsets.ModelViewSet):
    queryset = AdoptionRequest.objects.select_related("animal").all().order_by("-created_at")
    filter_backends = [filters.SearchFilter]
    search_fields = ["full_name", "phone", "email", "city", "message", "animal__name"]
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action in ["update", "partial_update"]:
            return AdoptionRequestDashboardUpdateSerializer
        return AdoptionRequestDashboardSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status_value = self.request.GET.get("status")
        animal_id = self.request.GET.get("animal")

        if status_value:
            queryset = queryset.filter(status=status_value)

        if animal_id:
            queryset = queryset.filter(animal_id=animal_id)

        return queryset
