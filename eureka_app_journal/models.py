# eureka_app/eureka_app_journal/models.py 
from django.contrib.auth.models import User
from django.db import models

class Journal(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'eureka_app_journal'