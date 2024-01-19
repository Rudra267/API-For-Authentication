require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT;
require('./db_connection/db');
const cookieParser = require('cookie-parser')
const user = require('./routes/user');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/user',user);

app.listen(port, () => {
    console.log('app render on ' + `http://localhost:${port}`)
});

