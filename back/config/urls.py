from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.common.auth_urls")),

    path("api/animals/", include("apps.animals.urls")),
    path("api/requests/", include("apps.requests_app.urls")),
    path("api/articles/", include("apps.articles.urls")),
    path("api/pages/", include("apps.pages.urls")),

    path("api/dashboard/animals/", include("apps.animals.dashboard_urls")),
    path("api/dashboard/requests/", include("apps.requests_app.dashboard_urls")),
    path("api/dashboard/articles/", include("apps.articles.dashboard_urls")),
    path("api/dashboard/pages/", include("apps.pages.dashboard_urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
