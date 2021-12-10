const { U_Interaction } = require ("./u_interaction.js");

/**
 *  Menu rotation object interaction contains the rotation objects .
 * The control panel with prev / next buttons .
 */
module.exports.MenuRotation_Interaction = class MenuRotation_Interaction extends U_Interaction
{
    static CommandName = "menu_interaction";
    static CommandDesc = "Simple Menu Interaction Description.";

    constructor(chan, user)
    {
        super (chan, user);

        this.__interactions__ = [];
        this.__menu__number__ = 0;
        this.__prev_menu_number__ = 0;

        this.add_menu_object( new U_Interaction() ).content = "#1_ITEM";
        this.add_menu_object( new U_Interaction() ).content = "#2_ITEM";
        this.add_menu_object( new U_Interaction() ).content = "#3_ITEM";

        this.reset_buttons();

        this.no_buttons = false ;
    }

    reset_buttons()
    {
        this.prev_button = {"style" : 1, "label" : "<<",   "custom_id" : "prev_button", disabled : false, type : 2};
        this.edit_button = {"style" : 1, "label" : "EDIT", "custom_id" : "edit_button", disabled : false, type : 2};
        this.stop_button = {"style" : 1, "label" : "STOP", "custom_id" : "stop_button", disabled : false, type : 2};
        this.next_button = {"style" : 1, "label" : ">>",   "custom_id" : "next_button", disabled : false, type : 2};       
    }

    /**
     * 
     * @param {table} tbl
     */
    add_menu_object(obj)
    {
        this.__interactions__.push(obj)

        return obj;
    }

    /**
     * Returns active menu object, undefined is no active menu.
     * @returns {*}
     */
    active_object() {return this.__interactions__[this.__menu__number__] ;}

    build_reply_content()
    {
        const _item =  this.active_object();
        var content = _item.build_reply_content();
        // adding control panel.
        this.build_components(content.components);
        return content;
    }

    /**
     * Check is active current object can switch next.
     * @returns 
     */
    can_switch_next() {return this.active_object().can_switch_next();}

    /**
     * Check the menu object can switch previous.
     * @returns 
     */
    can_switch_prev() {return this.active_object().can_switch_prev();}

    /**
     * Check the current object can switch.
     * @returns 
     */
    can_switch() { return this.active_object().can_switch(); }

    async on_interaction(collect)
    {

        if ( (collect.customId === "prev_button" || collect.customId === "next_button") && this.can_switch() )
        {
            this.active_object().do_switch();
        }

        switch(collect.customId)
        {
            case "prev_button":
                if (this.can_switch()) this.__menu__number__ = Math.max(0, this.__menu__number__ - 1);
            break;
            case "next_button":
                if (this.can_switch()) this.__menu__number__ = Math.min(this.__interactions__.length - 1, this.__menu__number__ + 1)
            break;
            default:
                if (true === await this.active_object().on_interaction(collect))
                {
                    this.__prev_menu_number__ = -1 ; // make to update .
                }
            break;
        }

        if ( (this.__prev_menu_number__ !== this.__menu__number__) )
        {
            if (this.__prev_menu_number__ !== -1)

                this.reset_buttons(); // reset button changes to normal state.

            this.__prev_menu_number__ = this.__menu__number__ ;

            collect.update( this.reply_content() );
        }
    }

    on_interaction_end(collected) {
        console.log("Menu interaction ended.");
    }

    build_components (components) {
        if (this.no_buttons) return ;

        components.push({"type" : 1, "components" : [
            this.prev_button,
            this.edit_button,
            this.stop_button,
            this.next_button ]});
    }
}