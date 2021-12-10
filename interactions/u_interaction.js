const { U_ShashCommand } = require ("./u_slashcommand.js");

/**
 * The U (User 'Custom') Interaction class declaration.
 * Provide more interesting and useful options and functions to interaction object.
 */
 module.exports.U_Interaction = class U_Interaction extends U_ShashCommand
{
    static CommandName = "simple_interaction";
    static CommandDesc = "Simple Interaction Description.";

    /**
     * How much time to wait between interaction.
     */
    static InteractionTimeOut = 64000;

    /**
     * Timeout to waiting the user message typing.
     */
    static UserMessageReplyTimeOut = 180000;

    /**
     * 
     * @param {channel} channel - the discord guild channel object whre interaction created. 
     * @param {user} ___user  - the user that is in interaction .
     */
    constructor(channel, ___user)
    {
        super();
        this . channel = channel ; // channel where interaction is working.
        this . ___user = ___user ; // user, interaction working with. Primary value.

        this . content = "#THE_MESSAGE_CONTANT_OBJECT";
        this . ephemeral = true ;



        this.no_components = false ;
        this. no_embeds = false ;
    }

    /**
     * Request message contents from user.
     * @param {function} message_handler - message handler ths will be perform the messages written by interaction user .
     */
    request_input_message( message_handler )
    {
        this.channel.awaitMessages( {
            filter: (m) => m.author.id === this.___user.id,
            max: 1,
            time: this.constructor.UserMessageReplyTimeOut,
            errors: ['time']
        } ).then( (m) => { 
            this.request_input_message( message_handler ) ;
            this.collector.resetTimer(); // reset the interaction timer to prevent dropping while reading messages .
            message_handler (m.values().next().value) ;
        } ).catch(e => {
            console.log("EXCEPTION " + e);
            console.log(e);
        } );
    }

    /**
     * Replies the content in initial form to show the interaction objecct.
     * @returns {table} - Table contains embeds / components values.
     */
    build_reply_content()
    {
        var embeds = [], components = [];

        this.build_message(embeds, components);

        return {
            content    : this.content,
            ephemeral  : this.ephemeral,
                embeds : this.no_embeds ? [] :  embeds,
            components : this.no_components ? [] : components}
    }

    // /**
    //  * If build state is true, drops the flag to rebuild output.
    //  * @returns {this}
    //  */
    // update_build_state()
    // {
    //     this.last_replied_content = undefined ;
    //     return this;
    // }

    /**
     * Returns the table that contains message structure.
     * @returns {table}
     */
    reply_content()
    {
        // if (this.last_replied_content !== undefined)
        // {
        //     return this.last_replied_content ;
        // }
        // const result = this.build_reply_content();
        // this.last_replied_content = result ;
        // return result ;

        return this.build_reply_content();
    }

    async on_interaction(collect) {console.log("On Interaction Called.");}

    on_interaction_end(collected) {console.log("Collecte called.");}

    /**
     * 
     * @param {list} ____embeds - the embeds list object, builds messages structure .
     */
    build_____embeds (____embeds) {}

    /**
     * 
     * @param {list} components - the component list , builds when showing the message table . 
     */
    build_components (components) {
        // return components.push({"type" : 1, "components" : [
        //     {"style" : 1, "label" : "INTERACTION ELEMENT", "custom_id" : "setup_row_0_prev_button", disabled : false, type : 2}
        // ]});
    }

    /**
     * 
     * @param {list} embeds - embeds list .
     * @param {list} compon - component list .
     */
    build_message(embeds, compon)
    {
        this.build_____embeds(embeds)
        this.build_components(compon)
    }

    /**
     * Dummy functions is created for checking in menu for switching between.
     * @returns 
     */
    can_switch() {return true;}

    can_switch_prev() {return this.can_switch();}
    can_switch_next() {return this.can_switch();}

    /**
     * This method calls when the main state is switching from this state.
     */
    do_switch() {}


    build_selector_drop_down_menu(items_filler_callback, noreset = true)
    {
        const component = {
            "type" : 1, "components" : [{
                "custom_id": `row_0_select_0`,
                "options": [], // there is options.
                "min_values": 1, "max_values": 1, "type": 3
            }]
        }

        if (noreset === false)
        {
            component.components[0].options.push( {
                "label": `RESET SELECTED ROLES`,
                "value": `NULL`,
                "description": `Action's only allowed from authorized individual`,
                "default": false
            })
        }

        items_filler_callback(component.components[0].options);

        return component;
    }

    /**
     * Creates roles drop down selector menu item.
     * @returns 
     */
    build_roles_selector_drop_down()
    {
        return this.build_selector_drop_down_menu( (list) =>
        {
            this.channel.guild.roles.cache.map(role => role).forEach(role =>{
                let item = {
                    "label" : "ROLE: @" + role.name,
                    "value" : role.id,
                    "default" : false,
                };
    
                list.push(item);
            });
        } ) ;
    }

    /**
     * Updates last replied content state .
     */
    update_last__interacted()
    {
        return this.edit( this.reply_content() );
    }

    /**
     * Edit the current message .
     * @param {*} what 
     */
    edit( what )
    {
        const lt = this.__last__interacted ;

        if (lt.deffered || lt.replied)
           return lt .editReply( what );
        else
           return lt.update( what );
    }

    /**
     * Records on interactive users .
     */
    static ActiveCommands = {} ;

    /**
     * Only one interaction can perform one user / member . Global flag .
     */
    static OneUserOneInteractiveCommand = true ;

    /**
     * Close / finalize / finish interactions.
     */
    close()
    {
        const active_obj = this.constructor.ActiveCommands[this.___user.id] ;

        if (active_obj === this)
                    /* Deleting active command handler. */
            delete this.constructor.ActiveCommands[this.___user.id] ;
    }
}