from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Article
from .serializers import DashboardArticleSerializer


class DashboardArticleListCreateAPIView(generics.ListCreateAPIView):
    queryset = Article.objects.all().order_by("-created_at")
    serializer_class = DashboardArticleSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]


class DashboardArticleDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Article.objects.all()
    serializer_class = DashboardArticleSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]