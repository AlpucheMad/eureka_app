# eureka_app/eureka_app_entry/views.py
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from eureka_app_entry.models import Entry
from eureka_app_journal.models import Journal
from django.utils import timezone
from datetime import datetime
from django.template.loader import render_to_string

@login_required
def new_entry_view(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        entry_date_str = request.POST.get('entry_date')
        journal_id = request.POST.get('journal')
        archived = request.POST.get('archived', False) == 'true'

        try:
            entry_date = datetime.strptime(entry_date_str, '%Y-%m-%d %H:%M:%S')
            entry_date = timezone.make_aware(entry_date)
        except ValueError as e:
            return JsonResponse({'success': False, 'message': 'Formato de fecha no válido.'}, status=400)

        journal = Journal.objects.get(id=journal_id)

        entry = Entry(
            title=title,
            content=content,
            entry_date=entry_date,
            journal=journal,
            archived=archived,
            user=request.user
        )
        entry.save()

        return JsonResponse({'success': True})

    journals = Journal.objects.filter(user=request.user)
    return render(request, 'journal/entry/new.html', {'journals': journals})

@login_required
def entries_view(request):
    journals = Journal.objects.all()
    entries = Entry.objects.all().order_by('-entry_date')

    grouped_entries = {}
    for entry in entries:
        date_str = entry.entry_date.strftime("%d/%m/%Y")
        if date_str not in grouped_entries:
            grouped_entries[date_str] = []
        grouped_entries[date_str].append(entry)

    sorted_dates = sorted(
        grouped_entries.keys(),
        key=lambda d: datetime.strptime(d, "%d/%m/%Y"),
        reverse=True
    )

    context = {
        'journals': journals,
        'grouped_entries': grouped_entries,
        'sorted_dates': sorted_dates,
    }
    return render(request, 'journal/entry/entries.html', context)

@login_required
def entry_details_view(request, entry_id):
    entry = Entry.objects.get(id=entry_id)
    context = {
        'title': entry.title,
        'journal': entry.journal.name,
        'entry_date': entry.entry_date.strftime('%d/%m/%Y %I:%M %p'),
        'content': entry.content,
        'is_favorite': entry.favorite
    }
    return JsonResponse(context)

@login_required
def toggle_favorite_view(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id, user=request.user)
    entry.favorite = not entry.favorite  # Cambia el estado de favorito
    entry.save()
    return JsonResponse({'success': True, 'is_favorite': entry.favorite})

@login_required
def delete_entry_view(request, entry_id):
    entry = get_object_or_404(Entry, id=entry_id, user=request.user)
    entry.delete()
    return JsonResponse({'success': True})

@login_required
def entry_filter_view(request):
    if request.method == 'POST':
        fecha_inicio = request.POST.get('fecha_inicio')
        fecha_fin = request.POST.get('fecha_fin')
        journal_id = request.POST.get('journal_id')
        search_text = request.POST.get('search_text')

        print(f"Filtros recibidos: fecha_inicio={fecha_inicio}, fecha_fin={fecha_fin}, journal_id={journal_id}, search_text={search_text}")

        entries = Entry.objects.filter(user=request.user)

        if fecha_inicio:
            try:
                fecha_inicio_obj = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                entries = entries.filter(entry_date__date__gte=fecha_inicio_obj)
                print(f"Filtro de fecha inicio aplicado: {fecha_inicio_obj}")
            except ValueError as e:
                print(f"Error al convertir fecha_inicio: {e}")
        else:
            print("No se aplicó filtro de fecha inicio (vacío)")

        if fecha_fin:
            try:
                fecha_fin_obj = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
                entries = entries.filter(entry_date__date__lte=fecha_fin_obj)
                print(f"Filtro de fecha fin aplicado: {fecha_fin_obj}")
            except ValueError as e:
                print(f"Error al convertir fecha_fin: {e}")
        else:
            print("No se aplicó filtro de fecha fin (vacío)")

        if journal_id and journal_id != '0':
            entries = entries.filter(journal_id=journal_id)
            print(f"Filtro de journal aplicado: journal_id={journal_id}")
        else:
            print("No se aplicó filtro de journal (vacío o igual a 0)")

        if search_text:
            entries = entries.filter(title__icontains=search_text)
            print(f"Filtro de búsqueda aplicado: search_text={search_text}")
        else:
            print("No se aplicó filtro de búsqueda (vacío)")

        print(f"Número de entradas filtradas: {entries.count()}")

        grouped_entries = {}
        for entry in entries:
            date_str = entry.entry_date.strftime("%d/%m/%Y")
            if date_str not in grouped_entries:
                grouped_entries[date_str] = []
            grouped_entries[date_str].append(entry)

        sorted_dates = sorted(
            grouped_entries.keys(),
            key=lambda d: datetime.strptime(d, "%d/%m/%Y"),
            reverse=True
        )

        print(f"Grouped entries: {grouped_entries}")
        print(f"Sorted dates: {sorted_dates}")

        html = render_to_string('journal/entry/entries_table.html', {
            'grouped_entries': grouped_entries,
            'sorted_dates': sorted_dates
        })

        print(f"HTML generado: {html}")

        return JsonResponse({'success': True, 'html': html})
    
    return JsonResponse({'success': False, 'message': 'Método no permitido'}, status=405)
