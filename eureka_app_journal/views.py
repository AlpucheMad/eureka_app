# eureka_app/eureka_app_journal/views.py
from django.shortcuts import redirect, render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from eureka_app_journal.models import Journal
from eureka_app_journal.forms import JournalForm
from django.http import JsonResponse
from django.template.loader import render_to_string

@login_required
def list_journal_view(request):
    journals = Journal.objects.filter(user=request.user).values('id', 'name')
    return JsonResponse({'journals': list(journals)})


@login_required
def add_journal_view(request):
    if request.method == 'POST':
        journal_name = request.POST.get('name')
        
        if not journal_name:
            return JsonResponse({'success': False, 'message': "El nombre del libro no puede estar vacío."})

        journal = Journal(name=journal_name, user=request.user)
        journal.save()
        return JsonResponse({'success': True, 'message': "Libro creado exitosamente."})
    else:
        form = JournalForm()
        form_html = render_to_string('journal/journal_form.html', {'form': form}, request=request)
        return JsonResponse({'success': True, 'form_html': form_html})

@login_required
def edit_journal_view(request, id):
    journal = get_object_or_404(Journal, id=id, user=request.user)
    
    if request.method == 'POST':
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            journal_name = request.POST.get('name')
            journal.name = journal_name
            journal.save()
            return JsonResponse({'success': True, 'message': "Libro actualizado exitosamente."})
        else:
            form = JournalForm(request.POST, instance=journal)
            if form.is_valid():
                form.save()
                messages.success(request, "Libro actualizado exitosamente.")
                return redirect('new_entry_view')
    else:
        form = JournalForm(instance=journal)
        form_html = render_to_string('journal/journal_form.html', {'form': form, 'action': 'edit', 'journal': journal}, request=request)
        return JsonResponse({'success': True, 'form_html': form_html})

@login_required
def delete_journal_view(request, id):
    journal = get_object_or_404(Journal, id=id, user=request.user)
    journal.delete()
    return JsonResponse({'success': True, 'message': "Libro eliminado exitosamente."})