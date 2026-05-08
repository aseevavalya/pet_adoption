from rest_framework import serializers
from .models import Article


class ArticleListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "category_display",
            "excerpt",
            "cover_image",
            "published_at",
        ]


class ArticleDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "category_display",
            "excerpt",
            "content",
            "cover_image",
            "published_at",
        ]


class DashboardArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = "__all__"
