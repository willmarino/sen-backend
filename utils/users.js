const jwt = require("jsonwebtoken");


const buildJWT = (email, password) => {
    return jwt.sign(
        { email, password },
        process.env.SECRET_KEY
    )
}


module.exports = {
    buildJWT,
}