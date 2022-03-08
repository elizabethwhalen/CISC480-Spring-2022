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
const con = require('./models/taskModel')

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

app.get('/:status/:id', (req, res) => {
    console.log(req.params)
    let query = "UPDATE Courses SET status='" + req.params.status + "' WHERE task_id=" + req.params.id
    con.query(query, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.redirect('/')
    })
});

app.get('/', (req, res) => {
    let query = "SELECT * FROM Courses";
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

app.post('/', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO Courses (task, status) VALUES ?";
    data = [
        [req.body.task, "ongoing"]
    ]
    con.query(query, [data], (err, result) => {
        if (err) throw err;
        console.log(result)
        res.redirect('/')
    })
});

app.get('/:id', (req, res) => {
    console.log(req.params)
    let query = "DELETE FROM Courses WHERE task_id=" + req.params.id
    con.query(query, (err, result) => {
        if (err) throw err;
        console.log(result)
        res.redirect('/')
    })
});

// port where app is served on Heroku platform, otherwise use port 5000.
// app.listen((process.env.PORT || 3000), () => {
app.listen(3000, () => {
    console.log('The web server has started on port '+3000);
});
