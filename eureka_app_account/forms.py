# /eureka_app/forms.py
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordChangeForm
from django import forms
from eureka_app_journal.models import Journal
from eureka_app_entry.models import Entry

class UserForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'})
    )

    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Contraseña'}),
        label=''
    )

    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirmar Contraseña'}),
        label=''
    )

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre de Usuario'}),
            'first_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Apellido'}),
        }
        labels = {
            'username': '',
            'first_name': '',
            'last_name': '',
            'email': '',
        }

class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre de Usuario'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Contraseña'}))

class AccountUpdateForm(forms.ModelForm):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}))
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Nombre'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Apellido'}))
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']

class PasswordUpdateForm(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Anterior Contraseña'}))
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Nueva Contraseña'}))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirmar Nueva Contraseña'}))

class EntryForm(forms.ModelForm):
    # Se configura el formato esperado del campo de fecha (rango)
    entry_date = forms.DateTimeField(
        input_formats=['%d/%m/%Y - %I:%M %p'],
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'id': 'rangoFecha',
            'placeholder': 'DD/MM/YYYY - hh:mm A'
        })
    )
    
    class Meta:
        model = Entry
        fields = ['title', 'entry_date', 'content', 'journal', 'archived']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Título...',
                'id': 'title'
            }),
            'content': forms.HiddenInput(attrs={'id': 'hidden-content'}),
            'journal': forms.Select(attrs={
                'class': 'form-control',
                'id': 'selectJournal'
            }),
            'archived': forms.CheckboxInput(attrs={
                'class': 'form-check-input',
                'id': 'archived'
            }),
        }
        
class JournalForm(forms.ModelForm):
    class Meta:
        model = Journal
        fields = ['name']
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Nombre del libro...',
                'id': 'journalName',
                'required': True
            }),
        }
        labels = {
            'name': '',
        }