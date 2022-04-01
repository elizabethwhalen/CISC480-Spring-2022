// Filename: app.js
// Description: Main file for API server. Connects to MySQL database and facilitates HTTP requests.

// Load in NPM modules for express app and MySQL connection
var express = require('express');
var logger = require('morgan');
let cors = require('cors');
var mysql = require('mysql');

// Create the express app
var app = express();
app.use(express.json());
app.use(cors());

// Connection to the database team Azure DB
// Eventually we would like to replace this authentificaiton with tokens
var config =
{
    host: 'classy-schedule-database.mysql.database.azure.com';,
    user: 'db_test';,
    password: 'fA!6#_&eaU9-EaeJ';,
    database: 'db_dev';,
    port: 3306,
};

// Connect to the database
const con = new mysql.createConnection(config);
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

/*
  HTTP request handling section is below. This is where we handle GET, POST, PUT,
  and DELETE requests from the user.
*/

app.get('/getClasses', (req, res) => {
    // Construct the classes
    let query = "SELECT * FROM classes";

    // Make the database query
    new Promise( (resolve, reject) => {
      con.query(query, (err, result) => {
          if (err) {
            reject();
          } else {
            resolve(result)
          }
      });
    })
    .then(rows => {
      res.status(200).type('application/json').send(rows);
    }).catch(err => {
      res.status(500).send("Error querying database");
    });
});

app.get('/getDept', (req, res) => {
    // Construct the database
    let query = "SELECT * FROM dept";

    // Make the database query
    new Promise( (resolve, reject) => {
      con.query(query, (err, result) => {
          if (err) {
            reject();
          } else {
            resolve(result)
          }
      });
    })
    .then(rows => {
      res.status(200).type('application/json').send(rows);
    }).catch(err => {
      res.status(500).send("Error querying database");
    });
});

/* Need to rewrite these functions to return JSON instead of modifying view
app.get('/', (req, res) => {
    let query = "SELECT * FROM dept";
    let items = []
    con.query(query, (err, result) => {
        if (err) throw err;
        items = result
        console.log(items)
        res.render('index', {
            items: items
        })
    })
    console.log(items);
});

app.get('/classes:id', (req, res) => {
    let query = "SELECT * FROM class";
    let items = []
    console.log(req)
    let condition = req.query.dept_code
    if (condition){
        console.log(condition)
        condArray = condition.split(",");
        // Add to sql query
        query = query + " WHERE dept_code = '" + condArray.join("' OR dept_code = '")+ "'";
      }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err;
        items = result
        console.log(items)
        res.render('index', {
            items: items
        })
    })
    console.log(items);
});

app.post('/classes', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO class (dept_code, class_num, class_name) VALUES ?";
    data = [
        [req.body.dept,req.body.num, req.body.name]
    ]
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/classes:id')
});
*/

module.exports = app;
