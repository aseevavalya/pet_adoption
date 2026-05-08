from rest_framework.routers import DefaultRouter
from .dashboard_views import DashboardAnimalViewSet

router = DefaultRouter()
router.register("", DashboardAnimalViewSet, basename="dashboard-animals")

urlpatterns = router.urls