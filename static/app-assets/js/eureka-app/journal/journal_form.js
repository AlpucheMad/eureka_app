// app-assets/js/eureka-app/journal/journal_form.js
var JournalForm = (function () {
    var urlJournal = "/journal/";

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

    function handleError(error, message) {
        console.error(message, error);
        Modal.alert.error(message);
    }

    async function getJournalForm(action, modal, journalId) {
        if (journalId < 0 || journalId == undefined || journalId == '') journalId = 0;
        
        let url = journalId <= 0 ? urlJournal + action + '/' : urlJournal + action + '/' + journalId + '/';
        try {
            const response = await SimpleAjax.consumir({
                type: 'GET',
                url: url,
                headers: { "X-CSRFToken": csrftoken },
                dataType: 'json'
            });
    
            if (response.success && response.form_html) {
                modal.find('.modal-body').html(response.form_html);
            } else {
                throw new Error("Error al cargar el formulario.");
            }
        } catch (error) {
            handleError(error, "Error en la solicitud:");
        }
    }

    async function postJournalForm(action, journalId, formData, modal) {
        let url = journalId <= 0 ? urlJournal + action + '/' : urlJournal + action + '/' + journalId + '/';

        try {
            const response = await SimpleAjax.consumir({
                url: url,
                method: 'POST',
                data: { name: formData },
                headers: { "X-CSRFToken": csrftoken },
                dataType: 'json'
            });

            if (response.success) {
                if (modal) modal.modal('hide');
                Modal.alert.success(response.message || "Operación exitosa.").then(() => {
                    window.location.reload();
                });
            } else {
                throw new Error(response.message || "Hubo un error en la operación.");
            }
        } catch (error) {
            handleError(error, "Error en la solicitud:");
        }
    }

    async function showJournalModal(action, journalId) {
        let okButtonClass = '';
        let okButtonText = '';
        let modalTitle = '';
        let deleted = false;

        switch (action) {
            case 'add':
                okButtonClass = 'btn-success';
                okButtonText = 'Guardar';
                modalTitle = 'Nuevo Libro';
                journalId = 0;
                break;

            case 'edit':
                okButtonClass = 'btn-primary';
                okButtonText = 'Guardar';
                modalTitle = 'Editar Libro';
                break;

            case 'delete':
                okButtonClass = 'btn-danger';
                okButtonText = 'Eliminar';
                modalTitle = 'Eliminar Libro';
                Modal.alert.confirm(
                    '¿Seguro que quieres eliminar este libro?',
                    'Podría tener dentro cientos de entradas...',
                    async function () {
                        await postJournalForm(action, journalId, '', null);
                    },
                    'Cancelar',
                    'Eliminar'
                );
                deleted = true;
                break;
        }

        if (!deleted) {
            const modal = Modal.create({
                id: 'journalModal',
                title: modalTitle,
                sizeClass: 'modal-sm',
                okButtonClass: okButtonClass,
                okButtonText: okButtonText
            });

            modal.on('shown.bs.modal', async function () {
                await getJournalForm(action, modal, journalId);

                $('#okModal').off('click').on('click', async function () {
                    const journalName = $('#journalName').val();
                    if (!journalName) {
                        Modal.alert.error("Nombre del libro requerido");
                        return;
                    }
                    await postJournalForm(action, journalId, journalName, modal);
                });
            });

            modal.modal('show');
        }
    }

    return {
        init: function () {
            $('.dropdown-menu > .journal-menu-item').off('click').on('click', function () {
                showJournalModal($(this).data('action'), $('#selectJournal').val());
            });
        }
    };
})();

$(document).ready(function(){
    JournalForm.init();
});