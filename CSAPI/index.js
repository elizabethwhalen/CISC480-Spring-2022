/*
Author: Ben Frey
Original Source: https://www.codingpanel.com/build-a-simple-web-application-using-node-js-mysql/
All Rights Reserved to the Original Owner

Description: Modified web app that can store events in a simple list by accessing
on of our MySQL databases (Team Database).
*/

// Import fs, express, hbs (HTML template format), body-parser
let fs = require('fs');
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require("body-parser");

// Initialize express as app
const app = express();

// Need to make connection
const con = require('./models/taskModel');

// User express to populate HTML templates
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
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

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
    con.query(query, [data], (err, result) => {
        if (err){
            console.log("")
        }
        else console.log(result);
    })
});

// port where app is served on Heroku platform, otherwise use port 5000.
// app.listen((process.env.PORT || 3000), () => {
app.listen(3000, () => {
    console.log('The web server has started on port '+3000);
});
