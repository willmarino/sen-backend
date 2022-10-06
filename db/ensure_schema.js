// const { databaseClient } = require("./connection");
const DB_CONNECTION_WRAPPER = require("./connection");


const ensureSchema = async () => {
    // console.log(databaseClient);
    try{
        await DB_CONNECTION_WRAPPER.connection.query(
            `CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(40) NOT NULL,
                password VARCHAR(100) NOT NULL,
                created_at timestamp DEFAULT NOW()
            )`
        )
        console.log("Success ensuring existence of users table");
    }catch(error){
        console.log("Failure ensuring schema");
        console.log(error);
    }
}

module.exports = ensureSchema;