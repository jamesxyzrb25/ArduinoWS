'use strict';

const five = require('johnny-five');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const board = new five.Board();

app.use(express.static(__dirname + '/src'));
app.set('view engine','ejs');
app.get('/', function (req, res, next) {
    res.render(__dirname + '/src/index.ejs');
});

board.on('ready', function () {
    console.log('Arduino is ready.');

    // Initial state for the LED light
    let statusRed = { status: false };
    let statusYellow = { status: false };
    let statusGreen = { status: false };

    // Map pins to digital inputs on the board --> PWM
    let ledRed = new five.Led(12);
    let ledYellow = new five.Led(11);
    let ledGreen = new five.Led(10);

    let setStatusRed = function (data) {
        if (data.status == true) {
            ledRed.on();
        } else {
            ledRed.off();
        }
    };

    let setStatusYellow = function (data) {
        if (data.status == true) {
            ledYellow.on();
        } else {
            ledYellow.off();
        }
    };

    let setStatusGreen = function (data) {
        if (data.status == true) {
            ledGreen.on();
        } else {
            ledGreen.off();
        }
    };

    // Listen to the web socket connection
    io.on('connection', function (client) {
        client.on('join', function (handshake) {
            console.log(handshake);
            /*
            Emite la informacion que ya está guardada en el servidor al cliente
            para posteriormente ponerla en los campos
            */
            // NO USAR broadcast AQUÍ
            //client.emit('defaultValues', state);
            client.emit('defaultValuesRed', statusRed);
            client.emit('defaultValuesYellow', statusYellow);
            client.emit('defaultValuesGreen', statusGreen);
        });

        // Set initial state
        //setStateBrightness(state);
        setStatusRed(statusRed);
        setStatusYellow(statusYellow);
        setStatusGreen(statusGreen);

        client.on('red', function (data) {

            statusRed.status = data.status;

            // Set the new colors
            setStatusRed(statusRed);

            // Imprime en consola el cambio efectuado
            console.log(data);

            client.broadcast.emit('red', data);
        });

        // Listener checkbox
        client.on('yellow', function (data) {

            statusYellow.status = data.status;

            // Set the new colors
            setStatusYellow(statusYellow);

            // Imprime en consola el cambio efectuado
            console.log(data);

            client.broadcast.emit('yellow', data);
        });

        client.on('green', function (data) {

            statusGreen.status = data.status;

            // Set the new colors
            setStatusGreen(statusGreen);

            // Imprime en consola el cambio efectuado
            console.log(data);

            client.broadcast.emit('green', data);
        });

    });
});

const port = process.env.PORT || 3000;

server.listen(port);
console.log(`Server listening on http://localhost:${port}`);