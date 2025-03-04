# /eureka_app/eureka_app_journal/forms.py
from django import forms
from .models import Journal

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