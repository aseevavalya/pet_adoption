from django.urls import path
from .views import AboutPageAPIView, HelpPageAPIView, SiteSettingsAPIView

urlpatterns = [
    path("about/", AboutPageAPIView.as_view(), name="about-page"),
    path("help/", HelpPageAPIView.as_view(), name="help-page"),
    path("site-settings/", SiteSettingsAPIView.as_view(), name="site-settings"),
]
