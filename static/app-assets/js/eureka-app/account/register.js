// register.js

function toggleAnonymous(link) {
    const $firstNameField = $('input[name="first_name"]');
    const $lastNameField = $('input[name="last_name"]');

    if ($firstNameField.is(":visible")) {
        // Si los campos están visibles, los ocultamos y asignamos los valores
        $firstNameField.hide().val("Usuario");
        $lastNameField.hide().val("Anónimo");
        link.innerHTML = "<small><b>Quiero ser conocido...</b></small>";
    } else {
        // Si los campos están ocultos, los mostramos y restablecemos los valores
        $firstNameField.show().val("");
        $lastNameField.show().val("");
        link.innerHTML = "<small><b>Preferiría ser anónimo...</b></small>";
    }
}