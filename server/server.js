// all required npm modules for backend connectivity
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

// connection to database
const db = mysql.createPool({
    host:'classy-schedule-database.mysql.database.azure.com',
    user:'db_test',
    password: 'fA!6#_&eaU9-EaeJ',
    database: 'class_schedule',
});
app.use(cors()); // initializing cors
app.use(express.json()); // initializing express
app.use(bodyParser.urlencoded({extended:true})); // initializing bodyParser

// http post call to the /AddClass api, allows us to add classes to database.
app.post('/AddClass', (req, res) => {

    // dynamic variables that change when post is executed.
    const dept_code = req.body.dept_code;
    const class_num = req.body.class_num;
    const class_name = req.body.class_name;

    // sql query 'INSERT' which adds the string representation of our variables into the database.
    // this will be modified to a json once database team gets their api on azure running.
    const sqlInsert = "INSERT INTO class (dept_code, class_num, class_name) VALUES (?,?,?)"
    db.query(sqlInsert, [dept_code, class_num, class_name], (err, result) => {
        console.log(err)
    });
    
});



// activates when server starts. logs the port that the server is running on, planning to switch to azure port.
app.listen(8080, () => {
    console.log("running on port 8080");
});