const { Pool } = require("pg");

class DBConnectionWrapper{
    constructor(){
        this.connection = null;
    }

    async connect(){
        const pool = new Pool({
            connectionString: process.env.RDS_CONNECTION_STRING,
            max: 1,
        });
    
        try{
            this.connection = await pool.connect();
            console.log("Success connecting to the database");
        }catch(dbConnectionError){
            console.log("Failure connecting to the database");
            console.log(dbConnectionError);
        }
    }
}

const DB_CONNECTION_WRAPPER = new DBConnectionWrapper();
module.exports = DB_CONNECTION_WRAPPER;