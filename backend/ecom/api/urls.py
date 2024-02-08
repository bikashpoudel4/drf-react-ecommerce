from django.urls import path

from userauths import views as userauth_views
from store import views as store_views


urlpatterns = [
    path('user/token/', userauth_views.MyTokenObtainPairView.as_view()),
]
