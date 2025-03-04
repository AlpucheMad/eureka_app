# eureka_app/eureka_app_journal/urls.py
from django.urls import path
from eureka_app_journal import views

urlpatterns = [
    # ROOT
    path('', views.add_journal_view, name='add_journal_view'), 

    # JOURNALS
    path('add/', views.add_journal_view, name='add_journal_view'),
    path('edit/<int:id>/', views.edit_journal_view, name='edit_journal_view'),
    path('delete/<int:id>/', views.delete_journal_view, name='delete_journal_view'),
    path('list/', views.list_journal_view, name='list_journal_view'),
]