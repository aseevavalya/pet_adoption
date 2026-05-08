from django.urls import path
from .views import AdoptionRequestCreateAPIView

urlpatterns = [
    path("", AdoptionRequestCreateAPIView.as_view(), name="adoption-request-create"),
]