var Modal = (function (Swal) {
    /**
     * Crea un modal con la configuración proporcionada.
     * @param {object} config - Configuración del modal.
     * @returns {object} - Objeto jQuery del modal.
     */
    function createModal(config) {
        // Validación básica de la configuración
        if (!config.id) {
            console.error("Se requiere un ID para el modal.");
            return null;
        }
    
        // Eliminar el modal si ya existe
        const existingModal = $('#' + config.id);
        if (existingModal.length > 0) {
            existingModal.remove();
        }
    
        // Configuración predeterminada
        config.hideHeader = config.hideHeader || false;
        config.hideFooter = config.hideFooter || false;
        config.modalNotCentered = config.modalNotCentered || false;
        config.sizeClass = config.sizeClass || '';
        config.title = config.title || '';
        config.content = config.content || '';
        config.contentFooter = config.contentFooter || '';
        config.cancelButtonText = config.cancelButtonText || 'Cerrar';
        config.okButtonText = config.okButtonText || 'Guardar';
        config.okButtonClass = config.okButtonClass || 'btn-success';
        config.showOkButton = config.showOkButton !== undefined ? config.showOkButton : true;
    
        // Crear el modal
        const modalHTML = `
            <div id="${config.id}" class="modal fade text-left" tabindex="-1" role="dialog" aria-labelledby="myModalLabel160" aria-hidden="true">
                <div class="modal-dialog ${!config.modalNotCentered ? 'modal-dialog-centered' : ''} modal-dialog-scrollable ${config.sizeClass}" role="document">
                    <div class="modal-content">
                        ${!config.hideHeader ? `
                            <div class="modal-header bg-eureka-black">
                                <h4 class="modal-title eureka-yellow" id="myModalLabel160"><b>${config.title}</b></h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <i class="bx bx-x"></i>
                                </button>
                            </div>
                        ` : ''}
                        <div class="modal-body">
                            ${config.content}
                        </div>
                        ${!config.hideFooter ? (config.contentFooter || `
                            <div class="modal-footer">
                                <button type="button" id="cancelModal" class="btn btn-light-secondary" data-dismiss="modal">
                                    <i class="bx bx-x d-block d-sm-none"></i>
                                    <span class="d-none d-sm-block">${config.cancelButtonText}</span>
                                </button>
                                ${config.showOkButton ? `
                                    <button id="okModal" type="submit" class="btn ${config.okButtonClass} ml-1">
                                        <i class="bx bx-check d-block d-sm-none"></i>
                                        <span class="d-none d-sm-block">${config.okButtonText}</span>
                                    </button>
                                ` : ''}
                            </div>
                        `) : ''}
                    </div>
                </div>
            </div>
        `;
    
        // Agregar el modal al DOM
        $('body').append(modalHTML);
        const modal = $('#' + config.id);
    
        // Manejar el cierre del modal
        modal.on('hidden.bs.modal', function () {
            modal.remove();
        });
    
        return modal;
    }

    /**
     * Muestra una alerta utilizando SweetAlert2.
     * @param {string} type - Tipo de alerta (error, success, warning, info).
     * @param {string} title - Título de la alerta.
     * @param {string} content - Contenido de la alerta.
     * @param {function} functionConfirm - Función a ejecutar si se confirma la alerta.
     * @param {object} options - Opciones adicionales para SweetAlert2.
     * @returns {Promise} - Promesa de SweetAlert2.
     */
    function showAlert(type, title, content, functionConfirm, options = {}) {
        const defaultOptions = {
            title: title || 'Procesamiento exitoso',
            text: content || '',
            type: type,
            animation: true,
            showCancelButton: type === 'warning' || type === 'info',
            confirmButtonColor: '#0783e8',
            confirmButtonText: options.confirmButtonText || 'Aceptar',
            cancelButtonText: options.cancelButtonText || 'Cerrar',
        };

        return Swal.fire({ ...defaultOptions, ...options }).then((result) => {
            if (result.value && functionConfirm) {
                functionConfirm();
            }
        });
    }

    return {
        loading: {
            open: function () { 
                $.blockUI({
                    message: '<div class="bx bx-revision icon-spin font-medium-2"></div>',
                    overlayCSS: {
                        backgroundColor: '#fff',
                        opacity: 0.8,
                        cursor: 'wait',
                    },
                    css: {
                        border: 0,
                        padding: 0,
                        backgroundColor: 'transparent',
                    },
                });
            },
            close: function () {
                $.unblockUI();
            },
        },
        alert: {
            error: function (title, content, functionConfirm) {
                return showAlert('error', title, content, functionConfirm);
            },
            success: function (title, content, functionConfirm) {
                return showAlert('success', title, content, functionConfirm);
            },
            confirm: function (title, content, functionConfirm, cancelButton, confirmButton) {
                return showAlert('warning', title, content, functionConfirm, {
                    cancelButtonText: cancelButton,
                    confirmButtonText: confirmButton,
                });
            },
            info: function (title, content, functionConfirm, confirmButton) {
                return showAlert('info', title, content, functionConfirm, {
                    confirmButtonText: confirmButton,
                });
            },
        },
        create: function (config) {
            const modal = createModal(config);
            if (modal) {
                modal.modal(config.show ? 'show' : 'hide');
            }
            return modal;
        },
        close: function (id) {
            const modal = $('#' + id);
            if (modal.length > 0) {
                modal.modal('hide');
            }
        },
    };
})(Swal);