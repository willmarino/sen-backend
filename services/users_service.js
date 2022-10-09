const bcrypt = require("bcryptjs");
const DB_CONNECTION_WRAPPER = require("../db/connection");
const { buildJWT } = require("../utils/users");


const registerUser = async (requestBody) => {
    console.log("Starting register user");

    const { email, password } = requestBody;

    // ensure email hasnt been used to create previous user
    let userNameSpaceTaken = false;
    try{
        const existingUsersResponse = await DB_CONNECTION_WRAPPER.connection.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )
        if(existingUsersResponse.rows.length > 0){
            userNameSpaceTaken = true;
            throw new Error("The email is already being used for an account");
        }
    }catch(e){
        if(userNameSpaceTaken){
            throw new Error("Email already in use");
        }else{
            console.log(`Failure to fetch existing users - \n${e}`);
            throw new Error("Unable to fetch users");
        }
    }

    // Hash password, insert user
    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log(encryptedPassword);
    try{
        await DB_CONNECTION_WRAPPER.connection.query(
            `INSERT INTO users (email, password) VALUES ($1, $2)`,
            [email, encryptedPassword],
        )
    }catch(e){
        console.log(e);
        throw new Error("Failure to insert into users table");
    }

    console.log("Success registering user, now building jwt");

    const jwt = buildJWT(email, password);
    return jwt;

}



const loginUser = async (requestBody) => {
    const { email, password } = requestBody;

    console.log(`Attempting login for ${email}`);

    let userResponse;
    let user;
    try{
        userResponse = await DB_CONNECTION_WRAPPER.connection.query(
            `
            SELECT * FROM users WHERE email = $1
            `,
            [ email ]
        )
        if(userResponse.rows.length === 0){
            throw new Error("Nonexistant credentials");    
        }
        user = userResponse.rows[0];
    }catch(e){
        throw new Error("Nonexistant credentials");
    }

    console.log(JSON.stringify(user, null, 4));

    let isCorrectPassword;
    try{
        isCorrectPassword = await bcrypt.compare(password, user.password);
    }catch(e){
        throw new Error("Incorrect password");
    }

    if(isCorrectPassword){
        return user;
    }else{
        throw new Error("Incorrect password");
    }

}





module.exports = {
    registerUser,
    loginUser
}