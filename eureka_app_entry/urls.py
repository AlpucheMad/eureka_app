# eureka_app/eureka_entry_urls.py
from django.urls import path
from eureka_app_entry import views

urlpatterns = [
    # ENTRY/
    path('new/', views.new_entry_view, name='new_entry_view'),
    path('entries/', views.entries_view, name='entries_view'),
    path('details/<int:entry_id>/', views.entry_details_view, name='entry_details_view'),
    path('toggle-favorite/<int:entry_id>/', views.toggle_favorite_view, name='toggle_favorite_view'),
    path('delete/<int:entry_id>/', views.delete_entry_view, name='delete_entry_view'),
    path('filter/', views.entry_filter_view, name='entry_filter_view'),
]