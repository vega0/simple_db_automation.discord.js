const Discord = require('discord.js');

const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MEMBERS] });

global . bot = bot ;

const { initializeInteractionObjects } = require ("./interactions.js");

require ("./invoke.commands.js");

const comms = require("./comms.js");
const fs = require('fs');

let config = require('./config.json');

bot.on("ready", () => {
    console.log("Bot `" + bot.user.username + "` online!");

    bot.guilds.cache.map(guild => guild).forEach( guild => {
        initializeInteractionObjects(guild);

        let  role  =  guild.roles.cache.find ( role => role.name === "UNKNOWN" ) ;

        if ( role !== undefined ) return ;
        
        console.log( "UNKNOWN role not found in " + guild.name + " guild. " );

        // Create a new role with data and a reason
        guild.roles.create( {
            name : "UNKNOWN",
            color: 0x10101,
            reason: 'The UNKNOWN role.',
        } ).then( console.log ).catch( console.error );
    } ) ;
} ) ;


bot.on('message', (msg) => { // Реагирование на сообщения

    if (msg.author == bot.user) return ;

    var comm = msg.content.trim() + " ";
    var comm_name = comm.slice(0, comm.indexOf(" "));
    var messArr = comm.split(" ");

    for (comm_count in comms.comms) {
        var comm2 = config.prefix + comms.comms[comm_count].name;
        if (comm2 == comm_name)
            comms.comms[comm_count].out(bot, msg, messArr);

    }
});

bot.login(config.token); // Авторизация бота