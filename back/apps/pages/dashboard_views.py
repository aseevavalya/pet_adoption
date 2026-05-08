from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from .models import AboutPage, HelpPage, SiteSettings
from .serializers import AboutPageSerializer, HelpPageSerializer, SiteSettingsSerializer


class AboutPageDashboardAPIView(generics.ListCreateAPIView):
    serializer_class = AboutPageSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        obj, _ = AboutPage.objects.get_or_create(
            pk=1,
            defaults={
                "title": "О проекте",
                "lead": "Здесь скоро появится описание проекта.",
                "story_title": "Как всё началось",
                "story_content": "<p>Здесь скоро появится история проекта.</p>",
                "mission_title": "Почему это важно",
                "mission_content": "<p>Здесь скоро появится описание миссии проекта.</p>",
            },
        )
        return AboutPage.objects.filter(pk=obj.pk)


class AboutPageDashboardDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = AboutPage.objects.all()
    serializer_class = AboutPageSerializer
    permission_classes = [IsAdminUser]


class HelpPageDashboardAPIView(generics.ListCreateAPIView):
    serializer_class = HelpPageSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        obj, _ = HelpPage.objects.get_or_create(
            pk=1,
            defaults={
                "title": "Как помочь",
                "lead": "Здесь скоро появится описание вариантов помощи.",
                "content": "Разовая помощь\nПередержка\nКорм и лекарства\nИнформационная поддержка",
                "donation_title": "Поддержать проект",
                "donation_details": "Здесь скоро появятся реквизиты и детали помощи.",
                "button_text": "Связаться",
            },
        )
        return HelpPage.objects.filter(pk=obj.pk)


class HelpPageDashboardDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = HelpPage.objects.all()
    serializer_class = HelpPageSerializer
    permission_classes = [IsAdminUser]


class SiteSettingsDashboardAPIView(generics.ListCreateAPIView):
    serializer_class = SiteSettingsSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        obj, _ = SiteSettings.objects.get_or_create(
            pk=1,
            defaults={
                "site_name": "МЫ ЗДЕСЬ",
                "contacts_title": "Связаться с нами",
                "contacts_lead": "Здесь скоро появятся контактные данные.",
                "donation_title": "Поддержать проект",
                "donation_text": "Здесь скоро появится информация о пожертвованиях.",
            },
        )
        return SiteSettings.objects.filter(pk=obj.pk)


class SiteSettingsDashboardDetailAPIView(generics.RetrieveUpdateAPIView):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [IsAdminUser]

