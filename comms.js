const config = require('./config.json'); // Подключаем файл с параметрами и информацией
const Discord = require('discord.js'); // Подключаем библиотеку discord.js
const prefix = config.prefix; // «Вытаскиваем» префикс

// Команды //

function hello(robot, mess, args) {
    mess.reply("Hello!");
}

// Список команд //

var comms_list = [{
    name: "hello",
    out: hello,
    about: "Команда для приветствия!"
}];

// Name - название команды, на которую будет реагировать бот
// Out - название функции с командой
// About - описание команды 

module.exports.comms = comms_list;