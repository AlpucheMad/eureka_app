# eureka_app/urls.py
from django.contrib import admin
from django.urls import path, include
from eureka_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # ROOT
    path('', views.redirect_session, name='redirect'), 
    
    # HOME
    path('home/', views.home, name='home'),
    
    # SESION
    path('session/', include('eureka_app_session.urls')),
    
    # ACCOUNT
    path('account/', include('eureka_app_account.urls')),

    # JOURNALS
    path('journal/', include('eureka_app_journal.urls')),
    
    # ENTRY
    path('entry/', include('eureka_app_entry.urls')),
    
    # ENTRY
    path('feed/', include('eureka_app_feed.urls')),
    
    
]