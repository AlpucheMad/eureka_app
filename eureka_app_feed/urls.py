# eureka_app/eureka_app_feed/urls.py
from django.urls import path
from eureka_app_feed import views

urlpatterns = [
    # ROOT
    path('', views.feed_view, name='feed_view')
]