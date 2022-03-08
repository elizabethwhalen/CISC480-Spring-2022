const express = require('express');
const app = express();
const mysql = require('mysql');

const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password: 'root',
    database: 'testdb',
});

app.get('/', (req, res) => {
    sqlquery = "insert"
    res.send('');
})

app.post('api/insert', (req, res)=>{
    const  sqlInsert = 'INSERT INTO table (dept, dept_num, dept_name)';
})

app.listen(3001, () => {
    console.log("running on port 3306");
})