from rest_framework import generics
from .models import Article
from .serializers import ArticleListSerializer, ArticleDetailSerializer


class ArticleListAPIView(generics.ListAPIView):
    serializer_class = ArticleListSerializer

    def get_queryset(self):
        return Article.objects.filter(is_published=True)


class ArticleDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ArticleDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Article.objects.filter(is_published=True)