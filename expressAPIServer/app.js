// Filename: app.js
// Description: Main file for API server. Connects to MySQL database and facilitates HTTP requests.

// Load in NPM modules for express app and MySQL connection
var express = require('express');
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
    host: 'classy-schedule-database.mysql.database.azure.com',
    user: 'db_test',
    password: 'fA!6#_&eaU9-EaeJ',
    database: 'db_dev',
    port: 3306,
};

// Connect to the database
const con = new mysql.createConnection(config);
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the MySQL database!");
});

/*
  HTTP request handling section is below. This is where we handle GET, POST, PUT,
  and DELETE requests from the user.
*/

app.get('/getDept', (req, res) => {
    // Construct the query
    let query = "SELECT * FROM dept";

    // Make the SQL query
    makeSQLQuery(res, query);
});

app.get('/getClass', (req, res) => {
    // Construct the query
    let query = "SELECT * FROM class";

    // Condition where dept_code was provided
    if (req.query.dept_code){
        let myArray = req.query.dept_code.split(",");
        query = query + " WHERE dept_code = '" + myArray.join("' OR dept_code = '")+ "'";
    }

    // Make the SQL query
    makeSQLQuery(res, query);
});

app.post('/addClass', (req, res) => {
    // Construct the query
    let query = "INSERT INTO class (dept_code, class_num, class_name) VALUES (?, ?, ?)";

    // Data from user HTTP request. We pass into makeSQLQuery to prevent injection.
    data = [req.query.dept_code, req.query.class_num, req.query.class_name];

    makeSQLQuery(res, query, data);
});

// Make an SQL query
function makeSQLQuery(res, query, data) {
    // Promise allows for other items to be completed simulatenously. Check out Javascript
    // promises for more information.
    new Promise( (resolve, reject) => {
        con.query(query, data, (err, result) => {
            if (err) {
                console.log(err)
                reject();
            } else {
                resolve(result)
            }
        });
    })
    .then(rows => {
        // Successful, send status 200 and resulting rows
        res.status(200).type('application/json').send(rows);
    }).catch(err => {
        // Not successful, send status 500, error
        res.status(500).send("Error querying database");
    });
}

module.exports = app;
