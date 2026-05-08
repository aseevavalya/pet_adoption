from rest_framework import serializers
from .models import AboutPage, HelpPage, SiteSettings


class AboutPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = "__all__"


class HelpPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HelpPage
        fields = "__all__"


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = "__all__"
