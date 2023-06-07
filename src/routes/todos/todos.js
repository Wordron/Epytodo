const functions = require('./todos.query.js');
const error = require('../../middleware/notFound.js');
const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth.js');

router.get("/", requireAuth, async (req, res) => {
    if (global.current_user != undefined) {
        const todos = await functions.getTodos()
        res.status(200).send(todos[0])
    } else {
        error.isLoggedIn(req, res);
    }
})

router.get("/:id", requireAuth, async (req, res) => {
    const id = req.params.id

    if (global.current_user != undefined) {
        const existTodo = await functions.getTodo(id)
        if (existTodo == null) {
            error.notFound(req, res);
        }
        res.status(200).send(existTodo)
    } else {
        error.isLoggedIn(req, res);
    }
})

router.post("/", requireAuth, async (req, res) => {
    const { title, description, due_time, user_id, status } = req.body

    if (title == null || description == null || due_time == null || user_id == null) {
        return error.badParameters(req, res);
    }
    if (status == null || (status != "not started" && status != "in progress" && status != "todo" && status != "done")) {
        return error.badParameters(req, res);
    }
    if (global.current_user != undefined) {
        const new_todo = await functions.createTodo(title, description, due_time, user_id, status)
        res.status(201).send(new_todo[0])
    } else {
        error.isLoggedIn(req, res);
    }
})

router.put("/:id", requireAuth, async (req, res) => {
    const id = req.params.id
    const { title, description, due_time, user_id, status } = req.body

    if (title == null || description == null || due_time == null || user_id == null || status == null) {
        error.badParameters(req, res);
    }
    if (global.current_user != undefined) {
        const updated_todo = await functions.updateTodo(title, description, due_time, user_id, status, id)
        res.status(201).send(updated_todo[0])
    } else {
        error.isLoggedIn(req, res);
    }
})

router.delete("/:id", requireAuth, async (req, res) => {
    const id = req.params.id

    if (global.current_user != undefined) {
        const existTodo = await functions.getTodo(id)
        if (existTodo == null) {
            error.badParameters(req, res);
        }
        await functions.deleteTodo(id)
        res.status(202).send('\"msg\" : \"Successfully deleted record number: ' + id + '\n')
    } else {
        error.isLoggedIn(req, res);
    }
})

module.exports = router;
