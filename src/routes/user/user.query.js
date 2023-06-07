const pool = require('../../config/db.js')
const bcrypt = require('bcrypt');

module.exports.getUser = async function getUsers() {
    const result = await pool.query('SELECT * FROM user WHERE email = ?', [global.current_user])
    return result[0]
}

module.exports.getallUsers = async function getUsers() {
    const result = await pool.query('SELECT * FROM user')
    return result
}

module.exports.getUser_todos = async function getUser_todos() {
    const user_id = await pool.query('SELECT id FROM user WHERE email = ?', [global.current_user])
    const result = await pool.query('SELECT * FROM todo WHERE user_id = ?', [user_id[0][0].id])
    return result
}

module.exports.getUser_id = async function getUser_id(id) {
    const result = await pool.query('SELECT * FROM user WHERE id = ?', [id])
    return result[0]
}

module.exports.getUser_email = async function getUser_email(email) {
    const result = await pool.query('SELECT * FROM user WHERE email = ?', [email])
    return result[0]
}

module.exports.register = async function register(email, name, firstname, password) {
    const isvalid = await pool.query('SELECT email FROM user WHERE email = ?', [email]);
    if (isvalid[0][0] == null) {
        const result = await pool.query('INSERT INTO user (email, name, firstname, password) VALUES (?, ?, ?, ?)', [email, name, firstname, password])
        return result[0]
    } else {
        return null
    }
}

module.exports.login = async function login(email, password) {
    const isvalid = await pool.query('SELECT email FROM user WHERE email = ?', [email]);
    if (isvalid[0][0] != null) {
        return isvalid[0]
    } else {
        return null
    }
}

module.exports.updateUser = async function updateUser(email, password, firstname, name, id) {
    const isvalid = await pool.query('SELECT email FROM user WHERE email = ?', [email]);
    if (isvalid[0][0] == null) {
        const result = await pool.query('UPDATE user SET email = ?, password = ?, firstname = ?, name = ? WHERE id = ?', [email, password, firstname, name, id])
        return result[0];
    } else {
        return null;
    }
}

module.exports.deleteUser = async function deleteUser(id) {
    await pool.query('SET FOREIGN_KEY_CHECKS=OFF') //disabling foreign key
    const result = await pool.query('DELETE FROM user WHERE id = ?', [id])
    await pool.query('SET FOREIGN_KEY_CHECKS=ON') // enabling foreign key
    return result[0]
}

module.exports.getPassword = async function getPassword(email) {
    const result = await pool.query('SELECT password FROM user WHERE email = ?', [email])
    return result[0][0];
}

module.exports.hashPassword = async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

module.exports.getEmail = async function getEmail(id) {
    const result = await pool.query('SELECT email FROM user WHERE id = ?', [id]);
    if (result[0] != null) {
        return result[0][0];
    } else {
        return null;
    }
}