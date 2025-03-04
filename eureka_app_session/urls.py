# eureka_app/eureka_app_session/urls.py
from django.urls import path
from eureka_app_session import views

urlpatterns = [
    # ROOT
    path('', views.open_session, name='add_journal_view'), 

    # JOURNALS
    path('login/', views.open_session, name='login'),
    path('logout/', views.close_session, name='close_session')
]