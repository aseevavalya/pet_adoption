import json

from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET


@csrf_exempt
@require_POST
def admin_login_view(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Некорректный JSON."}, status=400)

    username = data.get("username", "").strip()
    password = data.get("password", "")

    user = authenticate(request, username=username, password=password)

    if not user:
      return JsonResponse({"error": "Неверный логин или пароль."}, status=400)

    if not user.is_staff and not user.is_superuser:
      return JsonResponse({"error": "Недостаточно прав."}, status=403)

    login(request, user)
    return JsonResponse({
        "ok": True,
        "username": user.username,
        "is_staff": user.is_staff,
    })


@require_POST
def admin_logout_view(request):
    logout(request)
    return JsonResponse({"ok": True})


@require_GET
def admin_me_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"authenticated": False}, status=401)

    if not request.user.is_staff and not request.user.is_superuser:
        return JsonResponse({"authenticated": False}, status=403)

    return JsonResponse({
        "authenticated": True,
        "username": request.user.username,
        "is_staff": request.user.is_staff,
    })