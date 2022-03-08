const express = require('express');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password: 'root',
    database: 'tsetdb',
});

app.get('/', (req, res) => {
    res.send('');
})

app.listen(3001, () => {
    console.log("running on port 3306");
})