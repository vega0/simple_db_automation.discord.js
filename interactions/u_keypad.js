const { U_Interaction } = require ("./u_interaction.js");

var crypto = require('crypto');


require ("./../extends.js")

module.exports.U_Keypad = class U_Keypad extends U_Interaction
{
    static CommandName = "keypad";
    static CommandDesc = "Simple Keypad Interaction Object.";

    constructor(channel, user)
    {
        super(channel, user);

        this.__pin_code = '';
    }

    build_components(components)
    {
        components.push({"type" : 1, "components" : [
            {"style" : 1, "label" : "[ 1 ]", "custom_id" : "number_1", disabled : false, type : 2},
            {"style" : 1, "label" : "[ 2 ]", "custom_id" : "number_2", disabled : false, type : 2},
            {"style" : 1, "label" : "[ 3 ]", "custom_id" : "number_3", disabled : false, type : 2}
        ]});
        components.push({"type" : 1, "components" : [
            {"style" : 1, "label" : "[ 4 ]", "custom_id" : "number_4", disabled : false, type : 2},
            {"style" : 1, "label" : "[ 5 ]", "custom_id" : "number_5", disabled : false, type : 2},
            {"style" : 1, "label" : "[ 6 ]", "custom_id" : "number_6", disabled : false, type : 2}
        ]});
        components.push({"type" : 1, "components" : [
            {"style" : 1, "label" : "[ 7 ]", "custom_id" : "number_7", disabled : false, type : 2},
            {"style" : 1, "label" : "[ 8 ]", "custom_id" : "number_8", disabled : false, type : 2},
            {"style" : 1, "label" : "[ 9 ]", "custom_id" : "number_9", disabled : false, type : 2}
        ]});
        components.push({"type" : 1, "components" : [
            {"style" : 4, "label" : "C [*]", "custom_id" : "service_c", disabled : false, type : 2},
            {"style" : 1, "label" : "[ 0 ]", "custom_id" : "number_0", disabled : false, type : 2},
            {"style" : 3, "label" : "E [#]", "custom_id" : "service_n", disabled : false, type : 2}
        ]});
    }

    on_interaction(item)
    {
        if (item.customId.includes("number_"))
        {
            const number_ch = item.customId.charAt(item.customId.length - 1);

            this.__pin_code += number_ch;
        }
        else if (item.customId == "service_c")
            this.__pin_code = "";

        else if (item.custom_id == "service_n")
            this.on_pin_accept(this.__pin_code);

        this.update_last__interacted();
    }

    build_____embeds(embeds)
    {

        var description = `ENTERED PIN (${this.__pin_code.length}) #`;


        description += '#'.repeat(this.__pin_code.length);

        var hash = crypto.createHash('md5').update(this.__pin_code).digest('hex').toUpperCase();

        embeds.push( {
            "type": "rich",
            "title": `THE KEYPAD MENU`,
            "description": description + `
    PH :\n ${hash}
    `,
            "color": 0x00F0FF
        } );
    }

    /**
     * Called when pincode entered.
     * @param {*} pin 
     */
    on_pin_accept(pin)
    {

    }
}

module.exports.U_Calc = class U_Calc extends U_Interaction
{
    static CommandName = "calc";
    static CommandDesc = "Simple Keypad Interaction Object.";

    constructor(channel, user)
    {
        super(channel, user);

        this.__pin_code = '';
    }

    build_components(components)
    {
        components.push({"type" : 1, "components" : [
            {"style" : 1, "label" : "DEG", "custom_id" : "button_deg", disabled : false, type : 2},
            {"style" : 1, "label" : "F-E", "custom_id" : "button_FE", disabled : false, type : 2},
        ]});
        components.push({"type" : 1, "components" : [
            {"style" : 1, "label" : "MC", "custom_id" : "button_mc", disabled : false, type : 2},
            {"style" : 1, "label" : "MR", "custom_id" : "button_mr", disabled : false, type : 2},
            {"style" : 1, "label" : "M+", "custom_id" : "button_mp", disabled : false, type : 2},
            {"style" : 1, "label" : "M-", "custom_id" : "button_mm", disabled : false, type : 2},
            {"style" : 1, "label" : "MS", "custom_id" : "button_ms", disabled : false, type : 2}
        ]});
        components.push({"type" : 1, "components" : [
            {"style" : 1, "label" : "2(nd)", "custom_id" : "button_2nd", disabled : false, type : 2},
            {"style" : 1, "label" : "Pi", "custom_id" : "button_pi", disabled : false, type : 2},
            {"style" : 1, "label" : "e", "custom_id" : "button_eps", disabled : false, type : 2},
            {"style" : 1, "label" : "CE", "custom_id" : "button_ce", disabled : false, type : 2},
            {"style" : 1, "label" : "<=", "custom_id" : "button_backspace", disabled : false, type : 2},
        ]});
        components.push({"type" : 1, "components" : [
            {"style" : 1, "label" : "x^2", "custom_id" : "button_x_quad", disabled : false, type : 2},
            {"style" : 1, "label" : "1/x", "custom_id" : "button_1dx", disabled : false, type : 2},
            {"style" : 1, "label" : "|x|", "custom_id" : "button_modulo", disabled : false, type : 2},
            {"style" : 1, "label" : "exp", "custom_id" : "button_exp", disabled : false, type : 2},
            {"style" : 1, "label" : "mod", "custom_id" : "button_mod", disabled : false, type : 2},
        ]});
        components.push({"type" : 1, "components" : [
            {"style" : 1, "label" : "s2(x)", "custom_id" : "button_x_sqrt", disabled : false, type : 2},
            {"style" : 1, "label" : "(", "custom_id" : "button_br1", disabled : false, type : 2},
            {"style" : 1, "label" : ")", "custom_id" : "button_br2", disabled : false, type : 2},
            {"style" : 1, "label" : "n!", "custom_id" : "button_n!", disabled : false, type : 2},
            {"style" : 1, "label" : "/", "custom_id" : "button_div", disabled : false, type : 2},
        ]});
        // components.push({"type" : 1, "components" : [
        //     {"style" : 1, "label" : "x^y", "custom_id" : "button_x_sqrt", disabled : false, type : 2},
        //     {"style" : 1, "label" : "7", "custom_id" : "number_7", disabled : false, type : 2},
        //     {"style" : 1, "label" : "8", "custom_id" : "number_8", disabled : false, type : 2},
        //     {"style" : 1, "label" : "9", "custom_id" : "number_9", disabled : false, type : 2},
        //     {"style" : 1, "label" : "X", "custom_id" : "button_mult", disabled : false, type : 2},
        // ]});
    }

    on_interaction(item)
    {
        if (item.customId.includes("number_"))
        {
            const number_ch = item.customId.charAt(item.customId.length - 1);

            this.__pin_code += number_ch;
        }
        else if (item.customId == "service_c")
            this.__pin_code = "";

        else if (item.custom_id == "service_n")
            this.on_pin_accept(this.__pin_code);

        this.update_last__interacted();
    }

    build_____embeds(embeds)
    {
    }
}

module.exports.U_MaxGrid = class U_MaxGrid extends U_Interaction
{
    static CommandName = "max_grid";
    static CommandDesc = "The maximum button grid.";

    constructor(channel, user)
    {
        super(channel, user);

        this.__pin_code = '';
    }

    generate_buttons()
    {
        var components = [];
        for (var i = 0; i < 5; i++) {
            var _components = [];
            for (var j = 0; j < 5; j ++)
                _components.push({
                    style : Math.floor(1 + Math.random() * (5 - 1)),
                    label : `#`,
                    custom_id : `row_${i}_${j}`,
                    disabled : false,
                    type : 2 });
    
            components.push({"type" : 1, "components" : _components});
        }

        this.components = components ;

        return components;
    }

    get_grid_item(x, y)
    {
        var item_founded ;
        this.components.forEach( row => {
            row.components.forEach( item => {
                if (item.custom_id !== `row_${y}_${x}`)
                    return ;
                item_founded = item;
            });
        });

        return item_founded ? item_founded : false;
    }

    build_components(components)
    {
        if (!this.components)
        {
            this.generate_buttons();
        }

        this.components.forEach( item => {
            components.push( item ); } );
    }


    get_item_x_y(item)
    {
        const l = item.custom_id.split('_') ;
        const   x = parseInt(l [2]),
                y = parseInt(l [1]);

        return [x, y];
    }

    on_interaction(item)
    {
        console . log (   item.customId  ) ;
        const l = item.customId.split('_') ;
        const x = parseInt(l [2]), y = parseInt(l [1]);

        //console.log(this.calc_valuality_at( x, y));

        this . perform_valualities ( x,  y) ;

        this . update_last__interacted (  ) ;
    }

    calc_valuality_at(x, y, T = {iterated : []})
    {
        const item = this.get_grid_item(x, y);

        if (item === undefined || T.iterated.includes(item.custom_id) )
            return ;

        T.iterated.push(item.custom_id);
        var harvest_next = false ;
        if (T.initial === undefined) {
            T.initial = item.style ;
            T.value = 1;
            harvest_next = true;
        }
        else if (item.style === T.initial) {
            T.value += 1;
            harvest_next = true;
        }
        if (harvest_next) {
            this.calc_valuality_at(x, y - 1, T);
            this.calc_valuality_at(x, y + 1, T);
            this.calc_valuality_at(x - 1, y, T);
            this.calc_valuality_at(x + 1, y, T);
        }

        return T;
    }

    perform_valualities(x, y)
    {
        const action = this.get_grid_item(x, y);

        const items = [
            this.get_grid_item(x - 1, y),
            this.get_grid_item(x + 1, y),
            this.get_grid_item(x, y - 1),
            this.get_grid_item(x, y + 1) ];

        var max_valuable_item, max_valuable_value = 0;

        items.forEach( (item) => {
            if ( item        ===         false ) return ;
            if ( item.style  ===  action.style ) return ;

            const xy = this.get_item_x_y( item );
            
            const T = this.calc_valuality_at( xy[0], xy[1] );

            if ( T.value > max_valuable_value )
            {
                max_valuable_value = T.value;
                max_valuable_item = item;
            }
        } );

        if (max_valuable_item !== undefined)
            action.style = max_valuable_item.style;
        //console.log(action);
        //console.log(max_valuable_item);
    }
}