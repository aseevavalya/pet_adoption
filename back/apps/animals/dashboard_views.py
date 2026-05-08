from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Animal
from .dashboard_serializers import DashboardAnimalSerializer
from rest_framework.permissions import IsAdminUser


class DashboardAnimalViewSet(viewsets.ModelViewSet):
    queryset = Animal.objects.all().order_by("-created_at")
    serializer_class = DashboardAnimalSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [IsAdminUser]