const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');


const db = mysql.createPool({
    host:'classy-schedule-database.mysql.database.azure.com',
    user:'db_test',
    password: 'fA!6#_&eaU9-EaeJ',
    database: 'class_schedule',
});
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


app.post('/AddClass', (req, res) => {

    const dept_code = req.body.dept_code;
    const class_num = req.body.class_num;
    const class_name = req.body.class_name;

    const sqlInsert = "INSERT INTO class (dept_code, class_num, class_name) VALUES (?,?,?)"
    db.query(sqlInsert, [dept_code, class_num, class_name], (err, result) => {
        console.log(err)
    });
});

app.listen(3000, () => {
    console.log("running on port 3000");
});