const functions = require('../user/user.query.js');
const express = require('express');
const error = require('../../middleware/notFound.js');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const secret = process.env.SECRET;

router.post("/register", async (req, res) => {
    const { email, name, firstname, password } = req.body
    if (email == null || password == null || firstname == null || name == null) {
        return error.badParameters(req, res);
    }
    const hashedPassword = await functions.hashPassword(password)
    const new_user = await functions.register(email, name, firstname, hashedPassword)
    if (new_user === null) {
        return res.status(400).send('\"msg\": Account already exists');
    }
    const token = jwt.sign({id: new_user.id}, secret, {
            expiresIn: '1h' // expires in 1 hours
    });
    return res.status(201).send('\"token\": ' + token);
})

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return error.badParameters(req, res);
    }
    const password_db = await functions.getPassword(email);
    if (password_db != null) {
        const validPass = await bcrypt.compare(password.toString(), password_db.password.toString());
        if(!validPass) {
            return res.status(400).send('\"msg\": \"Invalid Credentials\"');
        }
    }

    const user = await functions.login(email, password);
    if (user != null) {
        const token = jwt.sign({id: user.id}, secret, {
            expiresIn: '1h' // expires in 1 hours
    });
        global.current_user = email;
        return res.status(201).send('\"token\": ' + token);
    } else {
        return res.status(400).send('\"msg\": \"Invalid Credentials\"');
    }
})

module.exports = router;
