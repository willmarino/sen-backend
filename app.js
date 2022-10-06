const express = require("express");
const cors = require("cors");
const DB_CONNECTION_WRAPPER = require("./db/connection");
const ensureSchema = require("./db/ensure_schema");
const usersService = require("./services/users_service");

require("dotenv").config();

const server = express();
server.use(cors());
server.use(express.json());


server.post("/users/register", async (req, res) => {
    console.log(req.body);
    try{
        const jwt = await usersService.registerUser(req.body);
        res.status(200).send({ jwt });
    }catch(e){
        res.status(400).send({ message: e.message });
    }
})

server.post("/users/login", async (req, res) => {
    console.log(req.body);
    try{
        const jwt = await usersService.loginUser(req.body);
        res.status(200).send({ jwt });
    }catch(e){
        res.status(400).send({ message: e.message });
    }
})





server.listen(5000, async () => {
    console.log("DB connection established, API ready");
    await DB_CONNECTION_WRAPPER.connect();
    await ensureSchema();
})