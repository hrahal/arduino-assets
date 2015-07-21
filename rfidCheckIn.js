"use strict";
var five = require("johnny-five");
var instapush = require('instapush');
var serialport = require("serialport");
var SerialPort = require("serialport").SerialPort;
var board = new five.Board();
var interval = 10000;
var botToken = 'xoxb-7654433348-NqFvmEsxjgT6OifKVNM3NObE';
var ledIndex = process.argv[2] || 13;
var insta_conf = {
    id: '55ad53fba4c48ad12c0924b6',
    secret: '48d184e15257ea762ef5112eff8050a4',
    token: '55ad50b2a4c48a562c0924b6'
};

board.on("ready", function () {

    instapush.settings({
        id: insta_conf.id,
        secret: insta_conf.secret,
        token: insta_conf.token
    });

    var notify = function (user, text) {
        instapush.notify({
            "event": "io",
            "trackers": {
                "user": user,
                "event": text
            }
        }, function (err, response) {
            console.log(err, response);
        });
    },
        serialPort = new SerialPort("/dev/ttyACM0", {
            baudrate: 9600,
            parser: serialport.parsers.readline("\n")
        });

    serialPort.on('open', function () {
        console.log('open');
        serialPort.on('data', function (data) {
            if (data) {
                if (data.indexOf('tag-number') >= 0) {
                    var user = data.split(':')[1];
                    notify(user, "check in");
                }
            }
        });
    });
});
