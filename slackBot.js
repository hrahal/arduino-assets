"use strict";
var five = require("johnny-five");
var slackbot = require('node-slackbot');
var board = new five.Board();
var interval = 10000;
var botToken = 'xoxb-7654433348-NqFvmEsxjgT6OifKVNM3NObE';
var ledIndex = process.argv[2] || 13;

//add instapush to slackbot 
//insta check in app
board.on("ready", function () {

    var piezo = new five.Piezo(6),
        led = new five.Led.RGB({
            pins: {
                red: 11,
                green: 5,
                blue: 3
            }
        }),
        bot = new slackbot(botToken); 

    bot.use(function (msg, cb) {
        if (msg.type === 'message') {
            console.log(msg.user + ' said: ' + msg.text, msg);
            if (msg.text === 'turn on') {
                led.on();
                led.color("#FF0000");
                led.blink(500);
                piezo.play({
                    song: "C D F D A - A A A A G G G G - - C D F D G - G G G G F F F F - -",
                    beats: 1 / 4,
                    temp: 100
                });
            } else if (msg.text === 'turn off') {
                led.stop().off();
            }
        } 
        cb();
    });

    bot.connect();
});
