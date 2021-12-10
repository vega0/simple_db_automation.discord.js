const MongoClient = require("mongodb").MongoClient;

/**
 * Mongo Database Driver Base .
 */
class U_MongoDB
{
    /**
     * Constructor.
     * @param {string} address - the remote address to connect, default localhost. 
     */
    constructor(address = "mongodb://localhost:27017/")
    {
        const mongoClient = new MongoClient(address);

        this . connected  = false ; // the connected object's flag.
        this.client = mongoClient ; // mongo client exemplar .

        console.log( "Connection to Address " + address );

        this.address = address ;
        this.connect();
    }

    /**
     * Initiate connect.
     */
    connect()
    {
        if (this.connected) return ;

        this.client.connect( ( err, client ) => {
            if ( err )
            {
                /* make sure. */ this.close();

                return console . log ( err ) ;
            }

            console.log("Connected! err" , err);

            this . connected = true ;
            this . client = client ;
            this . on_connect ( client ) ;
        } ) ;
    }

    /**
     * Close function to close connection.
     */
    close()
    {
        this.client.close();
    }

    /**
     * Event method called when client connected to the server.
     */
    on_connect(client)
    {
        // const db = this.db("machinarium");
        // const collection = db.collection('temp');

        // console.log(collection.findOne( ));

        // collection.insertOne({ id : 1, data : "another test"}, (err, result) => {
        //     if (err) {
        //       console.log('Unable insert user: ', err)
        //       throw err
        //     }
        // } );

        // collection.findOne({}, function(err, result) {
        //     if (err) throw err;
        //     console.log(result) ; 
        // });


        // collection.drop();
    }

    /**
     * Returns the database object, if first argument is undefined, using self static field db_name.
     * @param {*} name - name of database object.
     * @returns 
     */
    db(name)
    {
        if (name === undefined)
        {
            name = this.constructor.db_name ;
        }

        return this.client.db(name);
    }

    /**
     * Default database name .
     */
    static db_name = "DefaultDriverDatabase"

    /**
     * Set/ Get Key Value from database default object.
     * @param {*} key 
     * @param {*} value 
     */
    set_get_key_value(key, value)
    {
        const coll = this.db().collection("KeyValues") ;

        coll.count( (err, count) => {
            if ("function" === typeof value)
                coll.find().forEach( (_value) => {
                    const result = _value.container[key];

                    /* Call the callback with the value. */
                    value ( result ) ;
                } ) ;
            else
                if (!err && count === 0 ) {
                    var t = {}; t [key] = value ;
                    coll.insertOne( { container : t } );
                } else 
                    coll.find().forEach( (_value) => {
                        _value.container[key] = value;
                        coll.updateOne({ "_id": _value._id}, {$set: _value} ) ;
                    } ) ;
        } ) ;
    }
}

module.exports.U_SetupSpecifiedDriver = class U_SetupSpecifiedDriver extends U_MongoDB
{
    /**
     * Constructor, includes and depends on guild.
     * @param {*} address 
     * @param {*} guild 
     */
    constructor(address, guild)
    {
        super(address);

        this.guild = guild;
    }

    /**
     * Specified Database name used for /setup command.
     */
    static db_name = "Interactions_Setup_Command"

    /**
     * Returns collection by name from specified database .
     * @param {*} name 
     * @returns 
     */
    collection_name(name)
    {
        return this.db(this.constructor.db_name + "_" + this.guild.id).collection(name);
    }

    /**
     * insert or get the collection value / values .
     * @param {string} collname - the collection name to operate with. 
     * @param {*} item_value - the item value to store or undefined to get result of collection.
     * @returns 
     */
    insert_or_get_items_string(collname, item_value, __cb)
    {
        const coll = this.collection_name(collname);

        if (item_value !== undefined)
            return coll.insertOne( { value : item_value } );
        else
            return coll.find();
    }

    /**
     * Add administrative role to the database .
     * @param {*} role 
     * @returns 
     */
    add_administrative_role(role)
    {
        return this.insert_or_get_items_string("AdministrativeRoles", role);
    }

    /**
     * 
     * @returns list - the administrative role id's list. 
     */
    get_administrative_roles(cb)
    {
        return this.insert_or_get_items_string("AdministrativeRoles");
    }

    /**
     * Drops administrative roles collection .
     * @returns 
     */
    drop_administrative_roles()
    {
        return this.collection_name("AdministrativeRoles").drop() ;
    }

    /**
     * Add's category list item . [EMOJI] [ROLE ID or @role] [Full name] [short hand tag]
     * {
                emoji :     cells[0], 
                role :     cells[1],
            full_name :     cells[2],
            short_tag :     cells[3]    } 
     * @param {*} item 
     * @returns 
     */
    add_category_item_element(item)
    {
        return this.insert_or_get_items_string("SetupCategories", item);
    }

    /**
     * Returns categories cursor.
     * @returns 
     */
    get_category_item_elements()
    {
        return this.insert_or_get_items_string("SetupCategories");
    }

    /**
     * Drops setup categories collection.
     * @returns 
     */
    drop_category_elements()
    {
        return this.collection_name("SetupCategories").drop() ;
    }

    /**
     * Sets category name.
     * @param {*} name 
     * @returns 
     */
    set_category_name_string(name)
    {
        this.set_get_key_value("category_name", name);
    }

    /**
     * Gets ctegory name.
     * @returns 
     */
    get_category_name_string(cb)
    {
        return this.set_get_key_value("category_name", cb) ;
    }
}