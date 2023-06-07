require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT;
const userRoute = require('./routes/user/user');
const todosRoute = require('./routes/todos/todos');
const authRoute = require('./routes/auth/auth.js');
global.current_user = undefined;

// create the connection to database
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

app.use(express.json())
app.use("/", userRoute);
app.use("/todos", todosRoute);
app.use("/", authRoute);
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('\"msg\" : \"Internal server error\"')
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
