const functions = require('./user.query.js');
const express = require('express');
const error = require('../../middleware/notFound.js');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth.js');

function containsOnlyNumbers(str) {
    return /^\d+$/.test(str);
}

function checkforat(str) {
    let result = str.includes("@", 0);
    return result;
}

router.get("/user", requireAuth, async (req, res) => {
    if (global.current_user != undefined) {
        const user = await functions.getUser()
        res.status(200).send(user[0])
    } else {
        error.isLoggedIn(req, res);
    }
})

router.get("/user/todos", requireAuth, async (req, res) => {
    if (global.current_user != undefined) {
        const user = await functions.getUser_todos()
        res.status(200).send(user[0])
    } else {
        error.isLoggedIn(req, res);
    }
})

router.get("/users", requireAuth, async (req, res) => {
    if (global.current_user != undefined) {
        const all_users = await functions.getallUsers()
        res.status(200).send(all_users[0])
    } else {
        error.isLoggedIn(req, res);
    }
})

router.get("/users/:id", requireAuth, async (req, res) => {
    const id = req.params.id

    if (global.current_user != undefined) {
        const userEmail = await functions.getEmail(id)
        if (userEmail == null) {
            error.badParameters(req, res);
        }
        if (containsOnlyNumbers(id) === true) {
            const user = await functions.getUser_id(id)
            return res.status(200).send(user[0]);
        }
        if (containsOnlyNumbers(id) === false && checkforat(id) === true){
            const user = await functions.getUser_email(id)
            return res.status(200).send(user[0]);
        }
    } else {
        error.isLoggedIn(req, res);
    }
})

router.put("/users/:id", requireAuth, async (req, res) => {
    const id = req.params.id
    const { email, password, firstname, name } = req.body

    if (email == null || password == null || firstname == null || name == null) {
        return error.badParameters(req, res);
    }
    if (global.current_user != undefined) {
        const userEmail = await functions.getEmail(id)
        if (userEmail == null) {
            error.badParameters(req, res);
        }
        const new_user = await functions.updateUser(email, password, name, firstname, id)
        if (new_user === null) {
            return res.status(401).send('\"msg\": Account already exists');
        }
        const user = await functions.getUser_id(id)
        res.status(201).send(user[0])
    } else {
        error.isLoggedIn(req, res);
    }
})

router.delete("/users/:id", requireAuth, async (req, res) => {
    const id = req.params.id

    if (global.current_user != undefined) {
        const userEmail = await functions.getEmail(id)
        await functions.deleteUser(id)
        if (userEmail == null) {
            error.badParameters(req, res);
        }
        if (userEmail.email == global.current_user) {
            global.current_user = undefined;
        }
        res.status(202).send('\"msg\" : \"Successfully deleted record number: ' + id)
    } else {
        error.isLoggedIn(req, res);
    }
})

module.exports = router;
