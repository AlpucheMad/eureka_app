var SimpleAjax = {
    consumir: function (options) {
        return new Promise(function (resolve, reject) { 
            $.ajax({
                url: options.url,
                method: options.method || 'GET',
                dataType: options.dataType || 'json',
                data: options.data,
                headers: options.headers,
                success: function (response) {
                    if (options.dataType === 'json' && !response.success) {
                        Modal.alert.error(response.message || "Hubo un error en la operación.");
                        reject(response);
                    } else {
                        resolve(response);
                    }
                },
                error: function (xhr, status, error) {
                    Modal.alert.error("Error en la solicitud: " + (xhr.responseJSON?.message || error));
                    reject(xhr.responseJSON || error);
                }
            });
        });
    }
};