const jwt = require('jsonwebtoken');
require('dotenv').config();
const error = require('./notFound.js');
const express = require('express');
const router = express.Router();
const secret = process.env.SECRET;

function requireAuth(req, res, next) { 
    const token = req.header("auth_token");

    try {
        const decoded = jwt.verify(token, secret);
        if (!decoded)
            return error.invalidToken(req, res);
        next();
    } catch(err) {
        error.isLoggedIn(req, res);
    }
}

module.exports = { requireAuth }
