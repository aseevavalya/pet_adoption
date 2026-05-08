from django.urls import path
from .dashboard_views import (
    AboutPageDashboardAPIView, AboutPageDashboardDetailAPIView,
    HelpPageDashboardAPIView, HelpPageDashboardDetailAPIView,
    SiteSettingsDashboardAPIView, SiteSettingsDashboardDetailAPIView,
)

urlpatterns = [
    path("about/", AboutPageDashboardAPIView.as_view(), name="dashboard-about-page"),
    path("about/<int:pk>/", AboutPageDashboardDetailAPIView.as_view(), name="dashboard-about-page-detail"),
    path("help/", HelpPageDashboardAPIView.as_view(), name="dashboard-help-page"),
    path("help/<int:pk>/", HelpPageDashboardDetailAPIView.as_view(), name="dashboard-help-page-detail"),
    path("contacts/", SiteSettingsDashboardAPIView.as_view(), name="dashboard-contacts-page"),
    path("contacts/<int:pk>/", SiteSettingsDashboardDetailAPIView.as_view(), name="dashboard-contacts-page-detail"),
]
