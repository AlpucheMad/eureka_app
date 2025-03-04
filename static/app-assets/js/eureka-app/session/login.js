// login.js

function autoCloseAlerts() {
    const $alerts = $('.alert[data-auto-close="true"]');

    $alerts.each(function () {
        const $alert = $(this);

        setTimeout(() => {
            $alert.addClass('fade-out');

            $alert.on('transitionend', function () {
                $alert.remove();
            });
        }, 3500);
    });
}

$(document).ready(autoCloseAlerts);