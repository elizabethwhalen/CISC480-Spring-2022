// Filename: app.js
// Description: Main file for example web server. Connects to API server locally or in cloud (see var deployment).

// Load in NPM modeules for express app and MySQL connection
var createError = require('http-errors');     //
var express = require('express');             //
var path = require('path');                   //
var cookieParser = require('cookie-parser');  //
var logger = require('morgan');               // Log
let fs = require('fs');                       // Filesystem access
const hbs = require('express-handlebars');    // Dynamic HTML
const bodyParser = require("body-parser");    // Body parser
var http = require("http");

// Define vars
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// Local host testing or Azure - please check deployment var before deploying to Azure!!!
var deployment = "local" // "azure" when deployed to cloud
let apiHost = "http://classy-schedule-api.ddns.net";

// If we are connecting to local hosted API server
if deployment == "local" {
    apiHost = "http://localhost:4000"
}

// View engine (Handlebars) setup
// I think some of this can be trimmed down
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.engine('hbs', hbs.engine({
    helpers: {
        isCompleted: function (status) {
            if (status == "completed") {
                return true
            } else {
                return false
            }
        },
    },
    layoutsDir: './views/layouts',
    defaultLayout: 'main',
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

//
// EXPRESS APP SECTION
//
// We are no longer connecting directly to the database, but now we are connecting to the api.
//

//
// HELPER FUNCTION SECTION
//

// Example of how Web dev team may get depts
function getDept(){
    // Make HTTP connection settings
    let options = {
        host: apiHost,
        path: '/getDept',
        method: 'GET'
    };

    // Make HTTP request
    let req = http.request(options, (err, res) => {
        if (err) {
            console.log('problem with request: ' + e.message);
        }
    });

    // Print request result
    console.log(req);

    // write data to request body
    //req.write('data\n');
    //req.write('data\n');
    //req.end();
};

// Example of how Web dev team may view classes from a certain department
function getClass(dept_code){
    /**
    * Get class(es) via a HTTP request.
    *
    * See API documentation for full usage. The HTTP request will look something
    * like this: "http://getClass?dept_code=STAT,CISC,MATH"
    *
    * @param    {array}    dept_code    Deptartment codes of classes (can be a list with one element or no elements)
    * @return   ?
    */
    let path = "/getClass";

    // Condition where dept_code was provided
    if (dept_code) {
        path = path + "?dept_code=" + dept_code.join('&');
    }

    // Make HTTP connection settings
    let options = {
        host: apiHost,
        path: '/getClass',
        method: 'GET'
    };

    // Make HTTP request
    let req = http.request(options, (err, res) => {
        if (err) {
            console.log('problem with request: ' + e.message);
        }
    });

    // Print request result
    console.log(req);

    /* Make HTTP request
    let req = http.request(options, (err, res) => {
        if (err) {
            console.log('problem with request: ' + e.message);
        }
    });*/
}

// Example of how web dev team may insert a class
function addClass(dept_code, class_num, class_name) {
    /**
    * Add a class via a HTTP request.
    *
    * See API documentation for full usage. The HTTP request will look something
    * like this: "http://addClass?dept_code=STAT&class_num=101&class_name='Introduction to Statistics'"
    *
    * @param    {string}     dept_code   Deptartment code of class
    * @param    {string}     class_num   Class number
    * @param    {string}     class_name   Class name
    * @return   Path string for access
    */

    let path = "/dept_code="+dept_code+"&class_num="+class_num+"&class_name="+class_name;

    let options = {
        host: apiHost,
        path: path,
        method: 'POST'
    };

    // Make HTTP request
    let items = [];
    let req = http.request(options, (err, res) => {
        items = res;
        console.log(items)
        EXPRESSAPPRESULT.render('index', {
            items: items
        })
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
}

// Check for update (button click) in body...
//getDept();
//getClass();
//addClass();



// OLD DB requests
/*
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
