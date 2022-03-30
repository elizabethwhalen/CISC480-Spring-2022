var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Import fs, express, hbs (HTML template format), body-parser
let fs = require('fs');
const hbs = require('express-handlebars');
const bodyParser = require("body-parser");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
});

// We are no longer connecting directly to the database, but now we are connecting to the api.
var http = require("http");

// Joe, we need each of these function names (~64) written out (with the variable options
// customized to the proper path and method you don't mind.
function getClasses(){
  var options = {
    host: 'http:/localhost:4000',
    port: 80,
    path: '/classes:id',
    method: 'GET'
  };

  var req = http.request(options, function(res) {
    console.log('I AM HERE');
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write('data\n');
  req.write('data\n');
  req.end();
};

getClasses();

/*
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
    layoutsDir: './views/layouts',
    defaultLayout: 'main',
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
*/



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
