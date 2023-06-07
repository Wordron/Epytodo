const pool = require('../../config/db.js')

module.exports.getTodos = async function getTodos() {
    const result = await pool.query('SELECT * FROM todo')
    return result
}

module.exports.getTodo = async function getTodo(id) {
    const result = await pool.query('SELECT * FROM todo WHERE id = ?', [id])
    if (result[0] != null) {
        return result[0][0]
    } else {
        return null;
    }
}

module.exports.createTodo = async function createTodo(title, description, due_time, user_id, status) {
    await pool.query('SET FOREIGN_KEY_CHECKS=OFF') //disabling foreign key
    const temp = await pool.query('INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)', [title, description, due_time, user_id, status])
    await pool.query('SET FOREIGN_KEY_CHECKS=ON') // enabling foreign key
    const result = await pool.query('SELECT * FROM todo ORDER BY id DESC LIMIT 1')
    return result[0]
}

module.exports.updateTodo = async function updateTodo(title, description, due_time, user_id, status, id) {
    const temp = await pool.query('UPDATE todo SET title = ?, description = ?, due_time = ?, user_id = ?, status = ? WHERE id = ?', [title, description, due_time, user_id, status, id])
    const result = await pool.query('SELECT title, description, due_time, user_id, status FROM todo WHERE id = ?', [id])
    return result[0]
}

module.exports.deleteTodo = async function deleteTodo(id) {
    const result = await pool.query('DELETE FROM todo WHERE id = ?', [id])
    return result[0]
}
