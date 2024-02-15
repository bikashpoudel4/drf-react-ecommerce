from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from userauths import views as userauth_views
from store import views as store_views 


urlpatterns = [
    path('user/token/', userauth_views.MyTokenObtainPairView.as_view()),
    path('user/token/refresh/', TokenRefreshView.as_view()),
    path('user/register/', userauth_views.RegisterView.as_view()),
]