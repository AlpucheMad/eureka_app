# eureka_app/views.py
from django.shortcuts import redirect, redirect
from django.contrib.auth.decorators import login_required

# REDIRECCIONANDO EN RAIZ
def redirect_session(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        return redirect('login')
    
# VISTA DEL INICIO
@login_required
def home(request):
    return redirect('new_entry_view')