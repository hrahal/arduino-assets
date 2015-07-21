"use strict";
var five = require("johnny-five");
var slackbot = require('node-slackbot');
var instapush = require('instapush');
var SerialPort = require("serialport").SerialPort;
var board = new five.Board();
var interval = 10000;
var botToken = 'xoxb-7654433348-NqFvmEsxjgT6OifKVNM3NObE';
var ledIndex = process.argv[2] || 13;
var tune =  "C D F D A -";
var insta_conf = {
    id: '55ad53fba4c48ad12c0924b6',
    secret: '48d184e15257ea762ef5112eff8050a4',
    token: '55ad50b2a4c48a562c0924b6'
};

//add instapush to slackbot 
//insta check in app
board.on("ready", function () {

    instapush.settings({
        id: insta_conf.id,
        secret: insta_conf.secret,
        token: insta_conf.token
    });

    var piezo = new five.Piezo(6),
        led = new five.Led.RGB({
            pins: {
                red: 11,
                green: 5,
                blue: 3
            }
        }),
        bot = new slackbot(botToken),
        notify = function (user, text) {
            instapush.notify({
                "event": "io",
                "trackers": {
                    "user": user,
                    "event": text
                }
            }, function (err, response) {
                console.log(err, response);
            });
        };


    bot.use(function (msg, cb) {
        if (msg.type === 'message') {
            console.log(msg.user + ' said: ' + msg.text, msg);
            if (msg.text === 'turn on') {
                led.on();
                led.color("#FF0000");
                led.blink(500);
                piezo.play({
                    song: tune,
                    beats: 1 / 4,
                    temp: 100
                });
                notify(msg.user, msg.text);
            } else if (msg.text === 'turn off') {
                led.stop().off();
                notify(msg.user, msg.text);
            }
        }
        cb();
    });
    bot.connect();
});
