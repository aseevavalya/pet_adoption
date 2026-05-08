from rest_framework.views import APIView
from rest_framework.response import Response
from .models import AboutPage, HelpPage, SiteSettings
from .serializers import AboutPageSerializer, HelpPageSerializer, SiteSettingsSerializer


class AboutPageAPIView(APIView):
    def get(self, request):
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
        return Response(AboutPageSerializer(obj).data)


class HelpPageAPIView(APIView):
    def get(self, request):
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
        return Response(HelpPageSerializer(obj).data)


class SiteSettingsAPIView(APIView):
    def get(self, request):
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
        return Response(SiteSettingsSerializer(obj).data)

