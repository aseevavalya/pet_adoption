from django.urls import path
from .views import AnimalListAPIView, AnimalDetailAPIView

urlpatterns = [
    path("", AnimalListAPIView.as_view(), name="animal-list"),
    path("<slug:slug>/", AnimalDetailAPIView.as_view(), name="animal-detail"),
]