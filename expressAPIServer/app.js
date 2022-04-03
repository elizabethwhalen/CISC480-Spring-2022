var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(express.json());
app.use(cors());

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/


/**
Date: 03/29/22
Additional items below for DB connection
**/

// Need to make connection
const con = require('./models/taskModel');

app.get('/', (req, res) => {
    let query = "SELECT * FROM dept";
    let items = [];

    console.log(items);

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

app.get('/classes:id', (req, res) => {
    let query = "SELECT * FROM class";
    let items = []

    let condition = req.query.dept_code
    if (condition){
        condArray = condition.split(",");
        // Add to sql query
        query = query + " WHERE dept_code = '" + condArray.join("' OR dept_code = '")+ "'";
    };

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

app.post('/classes', (req, res) => {
    let query = "INSERT INTO class (dept_code, class_num, class_name) VALUES ?";
    data = [[req.body.dept,req.body.num, req.body.name]];

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

    res.redirect('/classes:id')
});

module.exports = app;
