const Discord = require('discord.js');
const { U_Interaction } = require ("../interactions/u_interaction.js");
const { MenuRotation_Interaction } = require ("../interactions/u_menu.js");

class HarvestAdministrativeRoles extends U_Interaction
{
    constructor(channel, user)
    {
        super(channel, user);
        this.content = " ";
    }

    build_____embeds(embeds)
    {
        var description = "You will need at minimum 1 role(s) to start, Recommendation 2\
Reply with the @ role, or role id seperated by a space\
E.g. @Leadership @admin (do not list roles being requested in mass here).\n"

        this.channel.guild.mongo_db.administrative_roles.forEach(item => {
            description += "<@&" + item + ">\n";
        });
    
        embeds.push(new Discord.MessageEmbed({
            title: 'Please list administrative roles in order from highest to lowest',
            description : description, type: 'rich', color: 0x00FFFF, }))
    }

    build_components(components)
    {
        components.push(this.build_roles_selector_drop_down());
    }

    /**
     * Add administrative role . MongoDB involved.
     * @param {*} value 
     */
    _add_administrative_role(value)
    {
        if (this.channel.guild.mongo_db.administrative_roles.includes(value))
        
            return ;

        this.channel.guild.mongo_db.add_administrative_role(value);

    }

    async on_interaction(item)
    {
        if (item.customId !== "row_0_select_0") return ;
        if (this.channel.guild.mongo_db.administrative_roles.includes(item.values[0]))
            return ;

        if (item.values[0] !== "NULL")
            this._add_administrative_role(item.values[0]);
        else {
            this.content = " ";
            this.channel.guild.mongo_db.drop_administrative_roles();
        }

        return true ;
    }

    can_switch()
    {
        return this.channel.guild.mongo_db.administrative_roles . length !== 0;
    }
}

const getEmoji = require('get-random-emoji')
const faker = require("faker");

class HarvestGroupSpecifies extends U_Interaction
{
    constructor(chan, user)
    {
        super(chan, user);

        this.awaiting_messages = false;
    }

    can_switch() {return this.channel.guild.mongo_db.member_categories.length !== 0;}

    build_____embeds(embeds)
    {
        var description = `List the roles that will appear in the drop down menu, in this order:\
After you add the first you may continue adding more, or come back and click edit\
E.g. [EMOJI] [ROLE ID or @role] [Full name] [short hand tag]\n\
Example [${getEmoji()}][@Main Ember Application][${faker.company.companyName()}][evrrrne]\nAdded: \n`

        this.channel.guild.mongo_db.member_categories.forEach(item => {
            description += `${item.emoji} - '${item.role}' (${item.full_name}) [${item.short_tag}]\n`
        });

        embeds.push(new Discord.MessageEmbed({
            title : "What is the role(s) going to be requested? Click the 'EDIT' button and write messages in the format below.",
            description : description,
            type : "rich",
            color : 0x00ffff
        }));
    }

    on_interaction(item)
    {
        if (item.customId === "edit_button")
        {
            this.awaiting_messages = true ;
            this.menu.request_input_message( (m) => { this.on_message_written(m); } );
            this.menu.edit_button.style = 4;
            return true ;
        }
        else if (item.customId === "stop_button")
        {
            this.awaiting_messages = false;
            this.menu.edit_button.style = 1;
            return true;
        }
    }

    do_switch()
    {
        this.awaiting_messages = false;
    }

    on_message_written(m)
    {
        if (!this.awaiting_messages)
            return ;

        const cells = m.content.substr(1, m.content.length - 2).split(/\]\s*\[/);

        m.delete();

        cells[0] = cells[0].trim() ;
        cells[1] = cells[1].trim() ;
        cells[2] = cells[2].trim() ;
        cells[3] = cells[3].trim() ;

        const added_row = "\n[" + cells[0] + "][" + cells[1] + "][" + cells[2] + "][" + cells[3] + "]"; 

        const element = {
                emoji :     cells[0], 
                role :     cells[1],
            full_name :     cells[2],
            short_tag :     cells[3]    } 

        this.channel.guild.mongo_db.add_category_item_element(element);

        this.menu.update_last__interacted();
    }
}

class TheCategoryTicketsSetup extends U_Interaction
{
    constructor(channel, user)
    {
        super(channel, user);
    }

    can_switch() { return this.channel.guild.mongo_db.category_name.length !== 0; }

    on_interaction(item)
    {
        if (item.customId !== "edit_button") return ;
       
        this.menu.request_input_message( (m) => {
            this.channel.guild.mongo_db.set_category_name_string(m.content);

            this.menu.update_last__interacted();
            m.delete();
        });
        this.menu.edit_button.style = 4;
        return true ;
    }

    build_____embeds(embeds)
    {
        embeds.push( {
            "type": "rich",
            "title": `Have bot make a category, what do you want the name to be ?`,
            "description": `-This category will only be seen by the discord owner and people marked for answering the ticket/request.
-Recommendation: Role Request Confirmation
-Pressing [>>] Will give the recommendation
The actual is **${this.channel.guild.mongo_db.category_name}**.`,
            "color": 0x00F0FF
        } );
    }
}

class NewRoleReceiveSetup extends U_Interaction
{
    constructor(channel, user)
    {
        super(channel, user);
    }

    build_____embeds(embeds)
    {
        var description = `If you want to automate this and channel, for the panel and ticket just click next.`;

        if (this.channel.guild.mongo_db.selected_default_user_role !== undefined)
        {
            description += `\n\n\tThe selected role is <@&${this.channel.guild.mongo_db.selected_default_user_role}>.`
        }

        embeds.push( {
            "type": "rich",
            "title": `What role should new users joining receive? `,
            "description": description,
            "color": 0x00F0FF
        } );        
    }

    build_components(compoents)
    {
        compoents.push(this.build_roles_selector_drop_down());
    }

    on_interaction(item)
    {
        if (item.customId === "row_0_select_0")
        {
            const selected = item.values[0];

            console.log("Selected Role " + selected) ; 

            this.channel.guild.mongo_db.set_get_key_value("default_user_role", selected);

            this.menu.close() ;
            this.menu.no_buttons = true;
            this. no_components = true ;
            this.menu.update_last__interacted();

            // this.menu.edit ( { } );
        }
    }
}

class SetupMenu extends MenuRotation_Interaction
{
    static CommandName = "setup";
    static CommandDesc = "🤔 Main Setup Admin Interactible Menu.";

    constructor(channel, user)
    {
        super(channel, user);

        this.__interactions__ = [];

        this.add_menu_object(new HarvestAdministrativeRoles(channel, user)).menu = this;
        this.add_menu_object(new HarvestGroupSpecifies(channel, user)).menu = this;
        this.add_menu_object(new TheCategoryTicketsSetup(channel, user)).menu = this ;
        this.add_menu_object(new NewRoleReceiveSetup(channel, user)).menu = this ;
    }
}

const {registerInteraction} = require ("../interactions.js") ;

registerInteraction (SetupMenu);

const { U_SetupSpecifiedDriver } = require ("../mongo.driver.js") ;

class SpecifiedGuildDriver extends U_SetupSpecifiedDriver
{
    /**
     * Constructor with local fields.
     * @param {*} address 
     * @param {*} guild 
     */
    constructor(address, guild)
    {
        super(address, guild);
        /* ----------------------------- */
        this.administrative_roles = [];
        this.member_categories = [];
        this.cetegory_name = "" ;
        this.default_user_role = undefined;
    }

    /**
     * Called when data base ready .
     * @param {*} client 
     */
    on_connect(client)
    {
        this.get_administrative_roles().forEach (    (value) => { this.administrative_roles.push ( value.value ) ;} ) ;
        this.get_category_item_elements().forEach(   (value) => { this.member_categories.push(value.value);       } ) ;
        this.get_category_name_string(               (value) => { this.category_name = value ;                    } ) ;
        this.set_get_key_value("default_user_role",  (value) => { this.selected_default_user_role = value;        } ) ;
    }

    add_administrative_role(role) {super.add_administrative_role(role); this.administrative_roles.push(role);}
    drop_administrative_roles() {super.drop_administrative_roles(); this.administrative_roles = [];}
    add_category_item_element(category) {super.add_category_item_element(category); this.member_categories.push(category);}
    drop_category_elements() {super.drop_category_elements(); this.member_categories = [];}
    set_category_name_string(name) {super.set_category_name_string(name) ; this.cetegory_name = name ;}
}

global.bot.on("ready", ( ) => {
    console.log("Loading database drivers for guilds ->");

    global.bot.guilds.cache.map(guild => guild).forEach( guild => {
        console.log ( "\t\t\t For Guild `" + guild.name + "`" ) ;

        guild.mongo_db = new SpecifiedGuildDriver(undefined, guild) ;

        var news_role;
        guild.mongo_db . set_get_key_value("default_user_role", (value) => {
            if ( value === undefined ) return ;
            news_role = value ;
            // disable access for all channels / groups with specified role.
            guild.channels.cache.map(chan => chan).forEach ( (chan) => {
   
                if(chan.permissionsFor(value) !== null || chan.permissionsFor(value) !== undefined)
                    // pass the channel with permissions by given role .
                    return ;

                chan.permissionOverwrites.create( guild.roles.cache.get(value) , {
                    VIEW_CHANNEL : false
                } ) . then( channel => console.log(channel.id) ) .catch( console.error );
            } ) ;
        } ) ;

        guild.mongo_db .get_category_name_string( ( value ) => {
            if (value === undefined) return ;
            var found = false ;
            guild.channels.cache.map( chan => chan ).forEach ( (chan) => {
                if (chan.type !== "GUILD_CATEGORY") return ;
                if (chan.name  == value) found = true ;
            } ) ;

            if ( found ) return ;

            guild.channels.create(value, { type: "GUILD_CATEGORY" } ).then ( (category) => {
                guild.mongo_db.set_get_key_value("DefaultMemberAuditCategoryId", category.id) ;
                guild.mongo_db.set_get_key_value("DefaultMemberAuditCategoryId", (value) => {
                    console.log("Setted value is " + value);
                }) ;
                const role = guild.roles.cache.get( news_role ) ;
                category.permissionOverwrites.create( role , {VIEW_CHANNEL : true} ) ;
                guild . mongo_db . newbies_category = category ;
                console.log( "Created Category ID " + category.id );
                guild.channels.create ( "Introductionary.", {
                        parent : category.id, type : "text" } )
                .then ( (chan) => {
                    chan.permissionOverwrites.create( role , {VIEW_CHANNEL : true} ) ;
                    chan.permissionOverwrites.create(guild.roles.everyone, {VIEW_CHANNEL : false}) ;
                } );
            } ) ;
        } ) ;
    } ) ;
} ) ;

global.bot.on("guildMemberAdd", (member) => {
    // when new member is joining .

    console.log(member.user.username + " is joining the guild!");

    member.guild.mongo_db.set_get_key_value("DefaultMemberAuditCategoryId", (category_id) => {
        console.log("Creating personal text channel for " + category_id);
        member.guild.channels.create ( member.user.id, {
            parent : category_id, type : "text" } )
        .then ( (chan) => {
            chan.permissionOverwrites.create( member , {VIEW_CHANNEL : true});
            chan.permissionOverwrites.create( member.guild.roles.everyone, {VIEW_CHANNEL : false});
        } );
    });

    member.roles.add(member.guild.roles.cache.find(r => r.name === "UNKNOWN"));
} );