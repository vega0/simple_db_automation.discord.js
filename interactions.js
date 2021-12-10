
/**
 * The interactions table that contains all interaction objects created.
 */
var interactions = {}

/**
 * 
 * @param {*} cl - register (store) interaction class in interactions variable. 
 */
module.exports.registerInteraction = (cl) => {

    console.log("Registering Interaction " + cl.CommandName);

    interactions[cl.CommandName] = cl;
    //interactions.items.push(cl)
};

/**
 * Initialize interactions in specified guild.
 * @param {*} guild - where to initialize interaction classes stored in interactiions variable.
 */
module.exports.initializeInteractionObjects = (guild) => {
    console.log("Initializing Interactions in `" + guild.name + "`");
    Object.entries(interactions).forEach(([key, value]) => {
        console.log("\t/" + key + "\t\t\t [" + value.CommandDesc + "]");

        module.exports.initializeInteractionObjectInGuild (value, guild) ;
    } ) ;
}

/**
 * 
 * @param {class} i_obj - Class object to register.
 * @param {*} guild - guild where register command.
 * @returns 
 */
module.exports.initializeInteractionObjectInGuild = (i_obj, guild) => {

    if /*S*/ ( i_obj . GuildRestrictions !== undefined ) /* ?????? */
        if ( ! i_obj . GuildRestrictions  .   includes ( guild.id )  ||
             ! i_obj . GuildRestrictions  .   includes (guild.name) )
            // -------------------------------------------------
            return ;

    return guild . commands . create ( {
                name : i_obj.CommandName,
         description : i_obj.CommandDesc, } ) ;
}

global.bot.on('interactionCreate', async (interaction) => {

    if (!interaction.isCommand()) return ;

    const { commandName, options } = interaction ;

    console.log("Invoking command /" + commandName + " by `" + interaction.user.username + "`");

    var o;
    try {
        const class_object = interactions [ commandName ] ;
        
        o = new class_object ( interaction.channel, interaction.user ) ;
        o . interaction = interaction ;

        const ac = class_object . ActiveCommands ;

        if (true === class_object . OneUserOneInteractiveCommand )
            if (ac [ interaction.user.id ] === undefined)
                ac [ interaction.user.id ]  =  o
            else
            {
                return console . log ( " Passing new interaction. Active interaction found. " );
            }
    } catch (_val)
        { return console.log( _val ); }

    if (o instanceof U_ShashCommand)
    {
        o.on_command_call();

        if (!(o instanceof U_Interaction))
            interaction.reply("Command executed! (raw command.)")
    }

    if (o instanceof U_Interaction)
    {
        const reply_content = o.reply_content();
        interaction.reply(reply_content);

        var interaction_ids = [];

        reply_content.components.forEach(el => {
            el.components.forEach(el => {
                interaction_ids.push(el.custom_id);});});

        o.interaction_ids = interaction_ids ;

        const filter = (i) => {
            return interaction.user.id === i.user.id &&
                i.message.interaction.id == interaction.id ;
        }
        const collector = interaction.channel.createMessageComponentCollector({filter, time: o.constructor.InteractionTimeOut });

        o.collector = collector ;

        collector.on('collect', async i => {
            if (!interaction_ids.includes(i.customId))
                return;
            else
                collector.resetTimer();

            o .__last__interacted = i ;
    
            if (true === await o .on_interaction(i))
                o.update_last__interacted();
        } ) ;

        collector.on('end', collected => {
            console.log ( `Collected ${collected.size} items.`);

            o . on_interaction_end ( collected ) ;
            o . close ( ) ; // closing active object.
            o . edit( {
                content : "*Interaction finished.*",
                components : [ ] } ) ;
        } ) ;
    }
} ) ;

const { U_ShashCommand } = require ("./interactions/u_slashcommand.js");
const { U_Interaction } = require ("./interactions/u_interaction.js");
const { MenuRotation_Interaction } = require ("./interactions/u_menu.js");
module.exports.registerInteraction (U_ShashCommand);
module.exports.registerInteraction (U_Interaction);
module.exports.registerInteraction (MenuRotation_Interaction);

const {U_Keypad, U_Calc, U_MaxGrid} = require ("./interactions/u_keypad.js");

module.exports.registerInteraction (U_Keypad) ;
module.exports.registerInteraction (U_Calc) ;
module.exports.registerInteraction (U_MaxGrid) ;