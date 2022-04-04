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
var https = require("https");                 // For HTTPS requests
var http = require("http");                   // For HTTP requests

// Define vars
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

// Local host testing or Azure - please check deployment var before deploying to Azure!!!
var deployment = "local" // "azure" when deployed to cloud
var apiHost = "http://classy-schedule-api.ddns.net";

// If we are connecting to local hosted API server
if (deployment == "local") {
    apiHost = "http://localhost:4000"
}

// View engine (Handlebars) setup
// I think some of this can be trimmed down
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));

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
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

//
// EXPRESS APP SECTION
//
// We are no longer connecting directly to the database, but now we are connecting to the api.
//

app.get('/', (req, res) => {
    // Build the HTTP request
    let path = apiHost+"/getDept";

    // Declare vars
    var items = [];
    var data = [];
    //var rowItems = [];

    console.log(path);

    // Make HTTP request (see https://blog.logrocket.com/5-ways-to-make-http-requests-in-node-js/)
    http.get(path, result => {
        result.on('data', chunk => {
            data.push(chunk);
        });

        result.on('end', () => {
            console.log('HTTP API Response ended: ');
            items = JSON.parse(Buffer.concat(data).toString());
            console.log(items);

            // Render HTTP response to web page (its not janky HTML, its just express)
            res.render('index', {
                items: items
            });
        });
    }).on('error', err => {
      console.log('Error: ', err.message);
    });
});

app.get('/classes', (req, res) => {
    // Build the HTTP request
    let path = apiHost+"/getClass";

    // Department was added to input box, need to add to HTTP path
    let condition = req.query.dept_code
    if (condition){
        console.log(condition);
        let condArray = condition.split(",");
        // Add to path
        path = path + "?dept_code=" + condArray.join(",");
    }

    // Declare vars
    var items = [];
    var data = [];

    console.log(path);

    // Make HTTP request (see https://blog.logrocket.com/5-ways-to-make-http-requests-in-node-js/)
    http.get(path, result => {
        result.on('data', chunk => {
            data.push(chunk);
        });

        result.on('end', () => {
            console.log('HTTP API Response ended: ');
            items = JSON.parse(Buffer.concat(data).toString());
            console.log(items);

            // Render HTTP response to web page (its not janky HTML, its just express)
            res.render('index', {
                items: items
            });
        });
    }).on('error', err => {
      console.log('Error: ', err.message);
    });
});

app.post('/newClass', (req, res) => {
    // Build the HTTP request from data in the HTML body
    let path = apiHost+"/addClass?dept_code="+req.body.dept_code+"&class_num="+req.body.class_num+"&class_name="+req.body.class_name;

    // Declare vars
    var data = [];
    var items = [];

    console.log(path);

    // Make HTTP request (see https://blog.logrocket.com/5-ways-to-make-http-requests-in-node-js/)
    http.get(path, result => {
        result.on('data', chunk => {
            data.push(chunk);
        });

        result.on('end', () => {
            console.log('HTTP API Response ended: ');
            //items = JSON.parse(Buffer.concat(data).toString());
            //console.log(items);

            res.redirect('/classes')
        });
    }).on('error', err => {
      console.log('Error: ', err.message);
    });
});

/* Working!!! (see https://blog.logrocket.com/5-ways-to-make-http-requests-in-node-js/)
function getTest() {
    https.get('https://jsonplaceholder.typicode.com/users', res => {
      let data = [];
      const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code:', res.statusCode);
      console.log('Date in Response header:', headerDate);

      res.on('data', chunk => {
        data.push(chunk);
      });

      res.on('end', () => {
        console.log('Response ended: ');
        const users = JSON.parse(Buffer.concat(data).toString());

        for(user of users) {
          console.log(`Got user with id: ${user.id}, name: ${user.name}`);
        }
      });
    }).on('error', err => {
      console.log('Error: ', err.message);
    });
}
*/

//
// HELPER FUNCTION SECTION (DISREGARD FOR THIS WEEK)
//

/*
// Example of how Web dev team may get depts
function getDept(){
    // Make HTTP connection settings
    let options = {
        host: apiHost,
        path: '/getDept',
        method: 'GET'
    };
};

// Example of how Web dev team may view classes from a certain department
function getClass(dept_code){
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
}

// Example of how web dev team may insert a class
function addClass(dept_code, class_num, class_name) {
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
*/

module.exports = app;
