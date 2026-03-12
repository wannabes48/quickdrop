from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # API Root
    path('', views.api_root, name='api_root'),
    
    # Authentication Routes
    path('register/', views.register, name='register'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('api/csrf/', views.get_csrf, name='api_csrf'),
    path('api/me/', views.api_current_user, name='api_me'),
    
    # Keeping update_profile if frontend implements it
    path('profile/update/', views.update_profile, name='update_profile'),

    # Django Built-in Auth Views (Optional)
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password_reset_confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password_reset_complete/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]
