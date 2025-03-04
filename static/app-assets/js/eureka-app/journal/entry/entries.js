var Entries = (function () {
    var configRangoFechas = {
        startDate: moment().subtract(6, 'days'),
        endDate: moment(),
        minDate: '01/01/2020',
        maxDate: '31/12/3000',
        ranges: {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Últimos 7 Días': [moment().subtract(7, 'days'), moment()],
            'Últimos 30 Días': [moment().subtract(30, 'days'), moment()],
            'Mes Actual': [moment().startOf('month'), moment().endOf('month')],
            'Último Mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Todas': ['01/01/2000', '31/12/3000']
        },
        applyButtonClasses: 'btn-success',
        alwaysShowCalendars: true,
        showDropdowns: true,
        locale: {
            format: 'DD/MM/YYYY',
            separator: ' - ',
            firstDay: 1,
            applyLabel: 'Aceptar',
            cancelLabel: 'Cancelar',
            fromLabel: 'De',
            toLabel: 'Hasta',
            customRangeLabel: 'Rango Específico',
            weekLabel: 'Sem',
            daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            monthNames: [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ]
        }
    };

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const csrftoken = getCookie('csrftoken');

    function initDataTable() {
        if ($.fn.DataTable.isDataTable('#entriesTable')) {
            $('#entriesTable').DataTable().destroy();  // Destruir la instancia existente de DataTables
        }
    
        $('#entriesTable').DataTable({
            pageLength: 25,
            responsive: true,
            searching: true,
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sSearch": "Buscar:",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                }
            }
        });
    }

    function initFilters() {
        $('#rangoFecha').daterangepicker(configRangoFechas, function (start, end) {
            $('#rangoFecha').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
        });
    
        $('#btnEntriesFilter').off('click').on('click', function () {
            const fechaInicio = $('#rangoFecha').data('daterangepicker').startDate.format('YYYY-MM-DD');
            const fechaFin = $('#rangoFecha').data('daterangepicker').endDate.format('YYYY-MM-DD');
            const journalId = $('#selectJournal').val();
            const searchText = $('#search-text').val();
        
            console.log("Filtros aplicados:", { fechaInicio, fechaFin, journalId, searchText });  // Depuración
        
            SimpleAjax.consumir({
                url: '/entry/filter/',
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                data: {
                    fecha_inicio: fechaInicio,
                    fecha_fin: fechaFin,
                    journal_id: journalId,
                    search_text: searchText
                }
            }).then(function (response) {
                console.log("Respuesta del servidor:", response);  // Depuración
                if (response.success) {
                    console.log("HTML recibido:", response.html);  // Depuración
        
                    // Actualizar el contenido del tbody con el nuevo HTML
                    $('#entriesTable tbody').html(response.html);
                    console.log("Contenido de tbody después de la actualización:", $('#entriesTable tbody').html());  // Depuración
        
                    // Reinicializar DataTables y volver a bindear los eventos sobre las nuevas filas
                    initDataTable();
                    initEvents();
                } else {
                    console.error("Error en la respuesta del servidor:", response.message);
                }
            }).catch(function (error) {
                console.error('Error al filtrar las entradas:', error);
            });
        });
    }

    function initEvents() {
        // Abrir modal con detalles de la entrada
        $('#entriesTable').off('click', 'tr[data-entry-id]').on('click', 'tr[data-entry-id]', function (e) {
            if (!$(e.target).is('.favorite i, .bx-trash')) {
                const entryId = $(this).data('entry-id');
    
                SimpleAjax.consumir({
                    url: `/entry/details/${entryId}/`,
                    method: 'GET'
                }).then(function (response) {
                    let entry_date = moment(response.entry_date).format('DD/MM/YYYY - hh:mm A');
                    const modal = Modal.create({
                        id: 'entryModal',
                        title: response.title, // Título de la entrada
                        sizeClass: 'modal-lg',
                        okButtonText: 'Cerrar',
                        showOkButton: false, // Ocultar el botón "Guardar"
                        cancelButtonText: 'Cerrar', // Solo mostrar el botón "Cerrar"
                        content: `
                            <div class="row eureka-black bg-secondary bg-light p-1">
                                ${response.content}
                            </div>
                            <div class="text-left mt-2">
                                <small class="text-muted"><strong>${entry_date} - ${response.journal}</strong></small>
                            </div>
                        `
                    });
    
                    modal.modal('show');
                }).catch(function (error) {
                    console.error('Error al cargar los detalles de la entrada:', error);
                });
            }
        });

        $('#entriesTable').off('click', '.favorite i').on('click', '.favorite i', function (e) {
            e.stopPropagation();
            const $this = $(this);
            const entryId = $this.closest('tr').data('entry-id');
            const isFavorite = $this.hasClass('bxs-star');

            SimpleAjax.consumir({
                url: `/entry/toggle-favorite/${entryId}/`,
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                }
            }).then(function (response) {
                if (response.success) {
                    $this.toggleClass('bx-star bxs-star');
                    $this.closest('.favorite').toggleClass('warning');
                }
            }).catch(function (error) {
                console.error('Error al marcar como favorito:', error);
            });
        });

        // Eliminar entrada
        $('#entriesTable').on('click', '.bx-trash', function (e) {
            e.stopPropagation();
            const entryId = $(this).closest('tr').data('entry-id');
            Modal.alert.confirm(
                '¿Seguro que quieres eliminar esta entrada?',
                'No podrás recuperarla...',
                async function () {
                    SimpleAjax.consumir({
                        url: `/entry/delete/${entryId}/`,
                        method: 'POST',
                        headers: {
                            'X-CSRFToken': csrftoken
                        }
                    }).then(function (response) {
                        if (response.success) {
                            Modal.alert.success('Entrada eliminada', 'La entrada ha sido eliminada correctamente.', function () {
                                location.reload();
                            });
                        }
                    }).catch(function (error) {
                        console.error('Error al eliminar la entrada:', error);
                    });
                },
                'Cancelar',
                'Eliminar'
            );
        });
    }

    return {
        init: function () {
            initDataTable();
            initFilters();
            initEvents();
        }
    };
})();

$(document).ready(function () {
    Entries.init();
});
