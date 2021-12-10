module.exports.U_ShashCommand = class U_ShashCommand
{
    /**
     * command name / id by typing that can be called.
     */
    static CommandName = "simple_command";

    /**
     * Command description that shown in helper panel.
     */
    static CommandDesc = "Simple Command Description.";

    /**
     * Command call callback.
     */
    on_command_call()
    {
        console.log("Command /" + this.constructor.CommandName + " called.");
    }

    constructor()
    {
        this.interaction = undefined;
    }

    
    /**
     * Filter's interaction object.
     * @param {*} i 
     * @returns 
     */
     filter(i) 
     {
         return true;
     }
}