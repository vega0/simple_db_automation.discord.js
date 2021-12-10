const Discord = require('discord.js');
const { U_Interaction } = require ("../interactions/u_interaction.js");

const {registerInteraction} = require ("../interactions.js") ;
const {ActiveSetupSpecifiedDriver} = require ("./interactions_setup.js");

let config = require('./../config.json');

/**
 * Command that gives possibility to member to select category / company .
 */
class SelectCompanyCategoryCommand extends U_Interaction
{
    static CommandName = "category";
    static CommandDesc = "SELECT THE COMPANY / CATEGORY TO BELONG TO.";

    static company_default_image = config.category_default_embed_url;

    constructor(...args)
    {
        super(...args);

        this.selected_item = undefined;
    }

    get_category_table(roleid)
    {
        var found;
        categories.forEach( ( t ) => {
            if (t.role === roleid)
                found = t;
        } ) ;

        return found;
    }

    format_category_table(t)
    {
        if (t === undefined)
        {
            t = this.selected_table ;
        }


        if ( t !== undefined)
            return t.full_name + " (" + t.short_tag + ") " + t.emoji + " " + t.role ;

        else
            return "undefined";
    }

    on_interaction(item)
    {
        console.log("On Company Interaction. " + item.values);
        this.no_components = true;
        this.selected_table = this.get_category_table(item.values[0]);

        console.log("Selected Table:");

        console.log(this.selected_table);

        this.close(); 
        return true;
    }

    on_interaction_end(collected)
    {
        console.log("On interaction end called. " + collected);
    }

    on_command_call()
    {
        super.on_command_call();
    }

    build_message(embeds, components) {

        var description = "Select the company you are part of and one of your admin's will confirm your role.";

        if (this.selected_table !== undefined)
        {
            description += "\n\n" + this.format_category_table();
        }

        embeds.push( {
            "type": "rich",
            "title": `Please select your company. `,
            "description": description,
            "color": 0xf90000,
            "image" : { url : this.constructor.company_default_image }
        } ) ;

        components.push( this.build_selector_drop_down_menu( (item) => {
            this.channel.guild.mongo_db.member_categories.forEach( ( t ) => {
                item.push ( {
                    "label" :  t.short_tag ,
                    "description" : t.full_name + " " + t.role,
                    "value" : t.role,
                    "default" : false,
                    "emoji": t.emoji //{"name": emoji_name, "id": emoji_id}
                } ) ;
            } ) ;
        } , true ) ) ;
    }
}

registerInteraction (SelectCompanyCategoryCommand);