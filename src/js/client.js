(function () {
    var socket = io.connect(window.location.hostname + ':' + 3000);
    var $red = $('#red');
    var $green = $('#green');
    var $yellow = $('#yellow');

    function emitValueRed(status) {
        socket.emit('red', {
            status: status,
        });
    }
    function emitValueYellow(status) {
        socket.emit('yellow', {
            status: status,
        });
    }
    function emitValueGreen(status) {
        socket.emit('green', {
            status: status,
        });
    }

    $red.on('click', function () {
        // El "prop" obtiene el valor del checkbox true/false
        emitValueRed($red.prop('checked'));
    });
    $yellow.on('click', function () {
        // El "prop" obtiene el valor del checkbox true/false
        emitValueYellow($yellow.prop('checked'));
    });
    $green.on('click', function () {
        // El "prop" obtiene el valor del checkbox true/false
        emitValueGreen($green.prop('checked'));
    });


    socket.on('connect', function (data) {
        socket.emit('join', 'Client is connected!');
    });

    // CHAT
    /* socket.on('rgb', function (data) {
      var color = data.color;
      document.getElementById(color).value = data.value;
    }); */
    socket.on('red', function (data) {
        $red.attr('checked', data.status);
    });
    socket.on('yellow', function (data) {
        $yellow.attr('checked', data.status);
    });
    socket.on('green', function (data) {
        $green.attr('checked', data.status);
    });

    // PONDRÁ LOS VALORES POR DEFECTO DE SERVIDOR
    socket.on('defaultValuesRed', function (data) {
        $red.attr('checked', data.status);
    });
    socket.on('defaultValuesYellow', function (data) {
        $yellow.attr('checked', data.status);
    });
    socket.on('defaultValuesGreen', function (data) {
        $green.attr('checked', data.status);
    });

}());