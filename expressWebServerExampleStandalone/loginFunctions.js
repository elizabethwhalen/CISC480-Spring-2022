var crypto = require('crypto');
var argon2i = require('argon2-ffi').argon2i;

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
//connection
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

var MIN_PASSWORD_LENGTH = 8;
var MAX_PASSWORD_LENGTH = 160;
var users = {};
//default
app.get('/', (req,res) => {
  return res.sendStatus(200);
});

//create users
app.post('/signup', (req, res) => {

    if(!req.body){
      return res.sendStatus(400);
    }

    if (!req.body.username || !req.body.password) {
        return res.status(400).send('Missing username or password');
    }
    //this doesn't work- can't see users without query
    if (users[req.body.username] !== undefined) {
        return res.status(409).send('A user with the specified username already exists');
    }  
    if(req.body.password.length < MIN_PASSWORD_LENGTH || req.body.password > MAX_PASSWORD_LENGTH){
        return res.status(400).send('Password must be between ' + MIN_PASSWORD_LENGTH + ' and ' + MAX_PASSWORD_LENGTH + ' characters long');
    }

    crypto.randomBytes(16, function (err, salt) {
    if (err) throw err;
    argon2i.hash(req.body.password, salt, function (err, hash) {
      if (err) {throw err;}
    }).catch(err => {
      reject(err)
    }).then(hash => {
      query_db_post("insert into login values ?",[[[req.body.username, hash, 101104523, access_level=1]]],res)
    });
  });
  //res.redirect('/');
});

/*app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});*/

//login
app.post('/login', async function (req, res) {
    var encodedHash;
    //if (!req.body) { return res.sendStatus(400); }
  
    if (!req.body.username || !req.body.password) {
      return res.status(400).send('Missing username or password');
    }
  
    let encodedHashjson = await get_pass("SELECT pass from login where user_id="+con.escape(req.body.username),res);
    encodedHash = encodedHashjson[0].pass
    if (encodedHash === undefined) { return res.sendStatus(401); }
    argon2i.verify(encodedHash, req.body.password)  .then(correct => console.log(correct ? res.status(200).send('Welcome '+ req.body.username) : res.status(400).send('Incorrect password')));
  });

function query_db_post(query, data, res) {
  console.log(query, data)
  new Promise((resolve, reject) => {
      con.query(query, data, (err, result) => {
          if (err) {
              reject();
          } else {
              resolve(result)
          }
      });
  })
      //return json package
      .then(rows => {
          res.status(201).type('application/json').send([201,"Created",rows]);
      }).catch(err => {
          res.status(500).send("Error querying database");
      });
}
function query_db(query, res) {
    console.log(query)
    return new Promise( (resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                resolve("nope");
            } else {
                resolve(result)
            }
        });
    })
}
async function get_pass(query,res){
  let result = await query_db(query,res)
  return result
}
module.exports = app;