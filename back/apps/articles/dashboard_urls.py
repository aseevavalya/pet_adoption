from django.urls import path
from .dashboard_views import DashboardArticleListCreateAPIView, DashboardArticleDetailAPIView

urlpatterns = [
    path("", DashboardArticleListCreateAPIView.as_view(), name="dashboard-article-list-create"),
    path("<int:pk>/", DashboardArticleDetailAPIView.as_view(), name="dashboard-article-detail"),
]
