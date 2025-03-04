# eureka_app/eureka_app_session/views.py
from django.shortcuts import redirect, render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm

# VISTA DEL LOGIN
def open_session(request):
    form = LoginForm()
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                form.add_error(None, "Error: Bad credentials.")
    
    return render(request, 'session/login.html', {'form': form})

# CERRAR SESION
@login_required
def close_session(request):
    logout(request)
    return redirect('login')