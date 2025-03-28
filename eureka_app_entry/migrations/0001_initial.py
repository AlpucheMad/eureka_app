# Generated by Django 4.2.7 on 2025-03-02 18:49

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('eureka_app_journal', '0002_alter_journal_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='Entry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('content', models.TextField(help_text='Contenido en HTML generado desde Quill.js')),
                ('entry_date', models.DateTimeField(default=django.utils.timezone.now, help_text='Fecha y hora de la entrada')),
                ('archived', models.BooleanField(default=False, help_text='Indica si la entrada está archivada')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('journal', models.ForeignKey(blank=True, help_text='Libro al que pertenece la entrada', null=True, on_delete=django.db.models.deletion.SET_NULL, to='eureka_app_journal.journal')),
            ],
            options={
                'db_table': 'eureka_app_entry',
            },
        ),
    ]
