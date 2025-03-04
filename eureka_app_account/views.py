# eureka_app/eureka_app_account/views.py
from django.shortcuts import redirect, render, redirect
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserForm, AccountUpdateForm, PasswordUpdateForm

# REGISTRO DE USUARIO
def account_register_view(request):
    form = UserForm()
    
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')

    return render(request, 'account/register.html', {'form': form})

# ACTUALIZACION DE USUARIO
@login_required
def account_update_view(request):
    user = request.user
    form = AccountUpdateForm(instance=user)
    
    if request.method == 'POST':
        form = AccountUpdateForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully.")
            return redirect('account_update_view')

    return render(request, 'account/update.html', {'form': form})


# CAMBIO PASSWORD USUARIO
@login_required
def account_update_password_view(request):
    user = request.user

    if request.method == 'POST':
        form = PasswordUpdateForm(user, request.POST)
        if form.is_valid():
            form.save()
            update_session_auth_hash(request, form.user)
            messages.success(request, "Password updated successfully.")
            return redirect('account_update_view')

    else:
        form = PasswordUpdateForm(user)

    return render(request, 'account/update_password.html', {'form': form})

