# eureka_app/eureka_app_feed/views.py
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def feed_view(request):
    return render(request, 'journal/feed/feed.html')

