var NewEntry = (function () {
    var configRangoFechas = {
        singleDatePicker: true,
        startDate: moment(),
        timePicker: true,
        timePicker24Hour: true,
        autoApply: true,
        showCustomRangeLabel: false,
        opens: "center",
        minDate: '01/01/2025',
        maxDate: moment(),
        applyButtonClasses: 'btn-dark',
        alwaysShowCalendars: true,
        locale: {
            format: 'DD/MM/YYYY - hh:mm A',
            firstDay: 1,
            applyLabel: 'Aceptar',
            cancelLabel: 'Cancelar',
            weekLabel: 'Sem',
            daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
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

    var quill;

    setTimeout(function() {
        if ($(".compose-editor").length) {
            quill = new Quill(".compose-editor", {
                theme: "snow",
                placeholder: "Escribe algo...",
                modules: {
                    toolbar: "#toolbar"
                }
            });
            quill.root.style.fontSize = "large";
        } else {
            console.warn("Quill.js: No se encontró el contenedor '.compose-editor'.");
        }
    }, 100);

    function updateDateTime() {
        const now = moment().format('DD/MM/YYYY - hh:mm A');
        $('#rangoFecha').val(now);
    }

    function resetForm() {
        $('#title').val('');
        quill.root.innerHTML = '';
        $('#selectJournal').val('0');
        updateDateTime(); // Actualiza la fecha y hora al momento actual
    }

    async function saveEntry(archived = false) {
        const title = $('#title').val();
        const content = quill.root.innerHTML;
        const entryDate = moment($('#rangoFecha').val(), 'DD/MM/YYYY - hh:mm A').format('YYYY-MM-DD HH:mm:ss'); // Formato correcto
        const journal = $('#selectJournal').val();

        if (!title || !content || !entryDate || !journal) {
            Modal.alert.error('Por favor, complete todos los campos.');
            return;
        }

        try {
            const response = await SimpleAjax.consumir({
                url: '/entry/new/',
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken
                },
                data: {
                    title: title,
                    content: content,
                    entry_date: entryDate,
                    journal: journal,
                    archived: archived
                }
            });

            if (response.success) {
                Modal.alert.success('Entrada guardada exitosamente.').then(() => {
                    resetForm();
                });
            } else {
                throw new Error(response.message || "Hubo un error al guardar la entrada.");
            }
        } catch (error) {
            Modal.alert.error(error.message || "Hubo un error al guardar la entrada.");
        }
    }

    return {
        init: function () {
            // Inicializar el datepicker
            $('#rangoFecha').daterangepicker(
                configRangoFechas,
                function (start) {
                    $('#rangoFecha').val(start.format('DD/MM/YYYY - hh:mm A'));
                }
            );

            // Actualizar la fecha y hora al momento actual
            $('.btn-dark').on('click', function () {
                updateDateTime();
            });

            // Manejar el botón Limpiar
            $("#btn-limpiar").off('click').on("click", function () {
                resetForm();
            });

            // Manejar el botón Archivar
            $("#btn-archivar").off('click').on("click", function () {
                saveEntry(true);
            });

            // Manejar el botón Guardar
            $("#btn-guardar").off('click').on("click", function () {
                saveEntry(false);
            });
        }
    };
})();

$(document).ready(function(){
    NewEntry.init();
});