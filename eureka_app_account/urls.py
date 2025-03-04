# eureka_app/urls.py
from django.urls import path
from eureka_app_account import views

urlpatterns = [
    # ROOT
    path('', views.account_update_view, name='redirect'), 
    path('update/', views.account_update_view, name='account_update_view'),
    path('register/', views.account_register_view, name='account_register_view'),
    path('update/password/', views.account_update_password_view, name='account_update_password_view')
]