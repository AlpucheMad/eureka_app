# /eureka_app/eureka_app_entry/models.py 
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from eureka_app_journal.models import Journal

class Entry(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(help_text="Contenido en HTML generado desde Quill.js")
    entry_date = models.DateTimeField(default=timezone.now, help_text="Fecha y hora de la entrada")
    journal = models.ForeignKey(Journal, on_delete=models.SET_NULL, null=True, blank=True, help_text="Libro al que pertenece la entrada")
    archived = models.BooleanField(default=False, help_text="Indica si la entrada está archivada")
    favorite = models.BooleanField(default=False, help_text="Indica si la entrada está marcada como favorita")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, help_text="Usuario que creó la entrada")  # Campo user
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'eureka_app_entry'