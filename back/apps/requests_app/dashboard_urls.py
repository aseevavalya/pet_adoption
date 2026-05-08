from rest_framework.routers import DefaultRouter
from .views import DashboardAdoptionRequestViewSet

router = DefaultRouter()
router.register("", DashboardAdoptionRequestViewSet, basename="dashboard-requests")

urlpatterns = router.urls
