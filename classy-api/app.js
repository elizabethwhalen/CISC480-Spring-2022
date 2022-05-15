// The purpose of the app.js file is to setup a connection to the Azure DB and
// serve all submitted HTTP requests. Some key features of this file include:
// 1. We read in a hidden seed (for bcrypt) and a hidden password (for DB connection)
// 2. Allow users to login to the API, hash their password, and compare against hashed db in table
// 3. Allow users to update or query the Database through the use of HTTP Requests
//
// Authors: Joe Lambrecht, Gabbie Bolcer, Emma Torres, Jonas Bull, and Ben Frey
// Date: 11 May 2022

// Say hello!
//console.log("Welcome to the Database Team's API, nice to meet you! :)\n");

//
// Import packages and setup app
//

// Base packages
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const fs = require('fs')

// Login, token, and MFA (email sending) packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail');
//require('dotenv').config(); // This might be an issue moving forward on deployment

// Developmental setting: 0 for local dev, or 1 for production (Azure deployment) 
const dev = 1;

// Setup RESTful app
const app = express();

// Response in JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//
// Read in "hidden" files. The "hidden" directory should be in .gitignore but deployed to the server.
// public users should not be able to view this directory. We have left it in our github to not
// deter the progress of other teams.
//

// Read in Azure database password for our access account. Need callback 
// so that the database connection not make too early
let db_password;
function makeConnection(callback) {
    fs.readFile('./hidden/db_password.txt', (err, data) => {
        if (err) throw err;
        db_password = data.toString();
        callback(db_password);
    });
}
// Read in seed used for jwt. We don't need callback function because hashing
// doe not occur right when server is initiated.
let secretkey;
try {
    secretkey = fs.readFileSync('./hidden/jwt_seed.txt').toString();
} catch {
    throw "Server error: security issue. Please try again later";
}
// Read in API key used for sendgrid email
let sg_key;
try {
    sg_key = fs.readFileSync('./hidden/sg_key.txt').toString();
    sgMail.setApiKey(sg_key);
} catch {
    throw "Server error: security issue. Please try again later";
}

///
// Database Connection
//

let con;
makeConnection((password)=> {
    // Determine which schema we are modifying
    let schema = "cs_dev" // "db_dev" use for development Database Team

    // Connect to the Azure database
    const config =
    {
        host: 'classy-schedule-database.mysql.database.azure.com',
        user: 'db_test',
        password: password,
        database: schema,
        port: 3306,
    };

    // Create the connection and store in "con"
    con = new mysql.createConnection(config);
    con.connect(function(err) {
        if (err) throw err;
        /*
        console.log("Connected to database with the following information:"+
                    "\nHost: "+config.host+
                    "\nUser: "+config.user+
                    "\nPassword: "+config.password+
                    "\nDB Schema: "+config.database+
                    "\nPort: "+config.port+
                    "\n");
        */
    });
});

// Get help information from versioning file
app.get('/help', (req, res) => {
    res.send("https://github.com/elizabethwhalen/CISC480-Spring-2022/blob/db-dev/docs/versioning.md")
});

//
// *** v3 ***
//

//queries
async function db_get(query){ 
/*  Queries the database.

    Uses the previously made connection object as the database connection. Uses a Promise object to
    handle the query and any errors that may come from it.

    @since              3.0.0

    @param {String}     query     Query to send to the database. Should be valid SQL.

    @return{Object}  Returns Query Results
*/
    return new Promise( (resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result)
            }
        });
      })
}
async function db_post(query, data){
/*  Puts a record in the the database.

    Uses the previously made connection object as the database connection. Uses a Promise object to
    handle the query and any errors that may come from it. If the row is already in the table, the
    user is notified. Only users with a high enough access level can use db_post.

    @since              3.0.0

    @param {String}     query     Query to add row(s) to the database. Should be valid SQL.

    @return{Object}  Returns number of affected rows. 
*/
    return new Promise( (resolve, reject) => {
        con.query(query, [data], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result)
            }
        });
    })
}
async function db_delete(query){
/*  Deletes a record from the database.

    Uses the previously made connection object as the database connection. Uses a Promise object to
    handle the query and any errors that may come from it. Only users with a high enough access level
    can use db_delete.

    @since              3.0.0

    @param {String}     query     Query to delete rows from the database. Should be valid SQL.

    @return{Object}  Returns Query Results
*/
    return new Promise( (resolve, reject) => {
      con.query(query, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result)
          }
      });
    })
}
async function db_put(query, data){
/*  Updates a record in the database.

    Uses the previously made connection object as the database connection. Uses a Promise object to
    handle the query and any errors that may come from it.

    @since              3.0.0

    @param {String}     query     Query to send to the database. Should be valid SQL.

    @return{Object}  Returns Query Results
*/
    return new Promise( (resolve, reject) => {
      con.query(query, data, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result)
          }
      });
    })
}

function check_int_type(value, res, int_size = null){
/*
    Checks if a value is an integer and if the size fits within the column.

    Size is only checked in PUT and UPDATE. If a user is querying values that are too large in a GET or DELETE, 
    that is their own problem. If a wrong type or too large value is detected. The res object is thrown to 
    notifiy the user of their bad request.

    @since          v3

    @param          value       value to test if a number and smaller than the maximum allowed size by the column
    @param{Object}  res         res from the calling function to throw in the case of a failure
    @param{Integer} int_size    maximum size integer can be

    @returns        Returns nothing if no errors encountered.
*/
    try{
    } catch (e)
    {
        value = value;
    }
    console.log(value);
    if(isNaN(value)){
        throw res.status(400).send(`${value} is not the correct data type for the column`);
    };
    if(int_size){
        if(value.length > int_size){
            throw res.status(400).send(`${value} is not the correct size for the column`);
        }
    }
}

function check_str_type(value, res, str_size = null){
/*
    Checks if a value is a STR and if the size fits within the column. 

    Size is only checked in PUT and UPDATE. If a user is querying values that are too large in a GET or DELETE, 
    that is their own problem. 

    @since          v3

    @param          value       value to test if a string and smaller than the maximum allowed size by the column
    @param{Object}  res         res from the calling function to throw in the case of a failure
    @param{Integer} int_size    maximum size integer can be

    @returns        Returns nothing if no errors encountered.
*/
    if(typeof value !== 'string'){
        throw res.status(400).send(`${value} is not the correct data type for the column`);
    }
    if(str_size){
        if(value.length > str_size){
            throw res.status(400).send(`${value} is not the correct size for the column`);

        }
    }
}


//calls

//***BUILDING***
//view
//add
//update
//delete

//***CLASS***
//view
//add

//update
//delete

//***CLASS_FEATURE***
//view
//add
//update
//delete

//***DEPT***
//view
//add
//update
//delete

//***FACULTY***
//view
//add
//update
//delete

//***FACULTY_CLASS***
//view
//add
//update
//delete

//***FACULTY_FEATURE***
//view
//add
//update
//delete

//***FACULTY_OTHER_REQUEST***
//view
//add
//update
//delete

//***FACULTY_TIMESLOT***
//view
//add
//update
//delete

//***FEATURE***
//view
//add
//update
//delete


//***LOGIN***
var MIN_PASSWORD_LENGTH = 8;
var MAX_PASSWORD_LENGTH = 16;

//login
app.post('/v3/login', async function (req, res) {
    /*Query the login table to see if user should be granted access. As part of our initiative to implement 
    multi-factor authentication, this v3 method also requires the user to verify their login attempt by
    clicking a link sent to their email address.

    @since  v3

    @param{Object}      req     The request info. Needs to contain an email address and a 
                                password to be a valid query. 

    @return             nothing.
    */
    var passHashed;

    // If email or password is missing, notify the user.
    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Missing email or password');
    }

    // Query DB for matching username (email)
    let loginjson = await db_get("SELECT * from login where email="+con.escape(req.body.email));
    if (loginjson.length === 0) { return res.status(404).send("Account with that email does not exist"); }
    
    // Check for matching password hash in DB
    passHashed = loginjson[0].pass
    bcrypt.compare(req.body.password,passHashed)
    .then(correct => {
      if(correct){
        // If the email and hashed password combo were correct: 
        // (1) generate a token for the user login attempt
        // (2) send the user an email with an link request to verify their login
        // (3) if user clicks this link within 30 sec., their token will be returned to original HTTP request

        // Generate token based on login attempt and secretkey
        let token = jwt.sign(
          {user: loginjson[0]},
          secretkey,
          {
              algorithm: "HS256",
              expiresIn: 86400,
          });
        
        // Send email and wait up to 30 seconds for user to confirm their identity by clicking link that was emailed to them
        console.log("- User "+loginjson[0].email+" is requesting login and has been sent an email to verify their identity.")
        sendVerifyEmail(loginjson[0].email, token);
        let myTimeout = setTimeout(requestTimeout, 30000);

        // This HTTP request is made when the user clicks the link in their inbox (or possibly junk folder)
        app.get('/v3/authenticate/:token', (req2, res2) => {            
            if (req2.params.token == token){
                // Send the user their token
                console.log("- User "+loginjson[0].email+" has been granted login and has been sent a token.")
                res.status(200).send(token);
                
                // Update the webpage and clear countdown timer
                res2.status(200).send("Login attempt for user "+loginjson[0].email+" has been granted. The HTTP request will now be completed with a token.");
                clearTimeout(myTimeout); 
            } else {
                // Ran out of time
                requestTimeout();
                res2.status(401).send("Login attempt for user "+loginjson[0].email+" has been denied. Please try again.");
            }
        });

        // Timeout
        function requestTimeout() {
            // Deny user of login
            console.log("- User "+loginjson[0].email+" was denied login.")
            res.status(401).send("Authetication failure. Please try again later.");
        }
      }
      else {res.status(401).send('Incorrect password');}
    });
});
// email mfa function
function sendVerifyEmail(emailRecipient, token) {
    // Set link that will be used in button
    let link;
    if (dev == 0) {
        link = "http://localhost:3000/v3/authenticate/"+token;
    } else if (dev == 1) {
        link = "https://classy-dev.ddns.net/v3/authenticate/"+token;
    } else {
        link = "https://classy-api.ddns.net/v3/authenticate/"+token;
    }

    // Generate html of email (button appears not to work in stthomas OutLook, us link instead)
    //let html = 'You have 30 seconds to click the autheticate button below. Your HTTP request will then return with your token.<form action="'+link+'" method="get"><button type="submit" formmethod="get">Verify Login</button></form>';
    let html = 'You have 30 seconds to click the authetication link below. Your HTTP request will then return with your token.</br><a href="'+link+'">'+link+'</a>';

    // Create message to send to user
    const msg = {
      to: emailRecipient, 
      from: 'classyscheduledev01@gmail.com', // I need to get the email login and setup info from jonas for documentaiton purposes
      subject: 'Autheticate your Classy-Schedule API login request',
      html: html
    }

    sgMail
      .send(msg)
      .then((response) => {
        if (response[0].statusCode == 202) {
            console.log("- Email authentification request successfully dispatched to "+emailRecipient)
        } else {
            console.log("- There was an issue while sending an authentification request to "+emailRecipient+'\n')
        }
        //console.log(response[0].statusCode)
        //console.log(response[0].headers)
      })
      .catch((error) => {
        //console.error(error)
      })
}

//***MEETS***
//view
//add
//update
//delete

//***ROOM***
//view
//add
//update
//delete

//***ROOM_FEATURE***
//view
//add
//update
//delete

//***SECTION***
//view
//add
//update
//delete

//***TEACHES***
//view
//add
//update
//delete

//***TIMESLOT***
//view
//add
//update
//delete

//***TITLE***
//view
//add
//update
//delete


//
// *** v2 ***
//

//***BUILDING***
//view
app.get('/v2/building', (req, res) => {
/*  Query the building table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Any access_level can use this method.
    else{
        let query = "SELECT * FROM building";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code){
        building_code_array = building_code.split(",");
        for(let i = 0; i < building_code_array.length; i++){
            if(i > 0){
                query = query + " OR"
            }
            check_str_type(building_code_array[i], res);
            query = query + " building_code = " + con.escape(building_code_array[i]);
        }
        prev = true;
    };
    //where condition:building_name
    let building_name = req.query.building_name
    if (building_name){
        building_name_array = building_name.split(",");
        for(let i = 0; i < building_name_array.length; i++){
            if(i > 0){
                query = query + " OR"
            }
            check_str_type(building_name_array[i], res)
            query = query + " building_name = " + con.escape(building_name_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/building', (req, res) => {
/*  Adds a record to the building table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = "INSERT INTO building (building_code,building_name) VALUES ?";
        check_str_type(req.body.building_code, res, 5);
        check_str_type(req.body.building_name, res, 100);
        data = [
            [req.body.building_code,req.body.building_name]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/building/:building_code_id', (req, res) => {
/*  Updates a row in the building table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth

    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = 'UPDATE building SET building_code = COALESCE(?,building_code), building_name = COALESCE(?,building_name) WHERE building_code= '+con.escape(req.params.building_code_id)+'';
        check_str_type(req.body.building_code, res, 5);
        check_str_type(req.body.building_name, res, 100);

        data = [
            req.body.building_code,req.body.building_name
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/building/:building_code_id', (req, res) => {
/*  Delete a record from the building table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.building_code, res);
        check_str_type(req.body.building_name, res);
        let query = 'DELETE FROM building WHERE building_code= '+con.escape(req.params.building_code_id)+'';

        query_db_delete(query, res)
    }
});

//***CLASS***
//view
app.get('/v2/class', (req, res) => {
/*  Query the class table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Any access_level can use this method.
    else{
        let query = "SELECT * FROM class";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code){
        dept_code_array = dept_code.split(",");
        for(let i = 0; i < dept_code_array.length; i++){
            if(i > 0){
                query = query + " OR"
            }
            check_str_type(dept_code_array[i], res);
            query = query + " dept_code = " + con.escape(dept_code_array[i]);
        }
        prev = true;
    };
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num){
        class_num_array = class_num.split(",");
        for(let i = 0; i < class_num_array.length; i++){
            if(i > 0){
                query = query + " OR"
            }
            check_str_type(class_num_array[i], res);
            query = query + " class_num = " + con.escape(class_num_array[i]);
        }
        prev = true;
    };
    //where condition:class_name
    let class_name = req.query.class_name
    if (class_name){
        class_name_array = class_name.split(",");
        for(let i = 0; i < class_name_array.length; i++){
            if(i > 0){
                query = query + " OR"
            }
            check_str_type(class_name_array[i], res);
            query = query + " class_name = " + con.escape(class_name_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/class', (req, res) => {
/*  Adds a record to the class table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = "INSERT INTO class (dept_code,class_num,class_name) VALUES ?";
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_str_type(req.body.class_name, res, 100);
        data = [
            [req.body.dept_code,req.body.class_num,req.body.class_name]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/class/:dept_code_id/:class_num_id', (req, res) => {
/*  Updates a row in the class table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_str_type(req.body.class_name, res, 100);

        let query = 'UPDATE class SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), class_name = COALESCE(?,class_name) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';
        
        data = [
            req.body.dept_code,req.body.class_num,req.body.class_name
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/class/:dept_code_id/:class_num_id', (req, res) => {
/*  Delete a record from the class table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_str_type(req.body.class_name, res, 100);

        let query = 'DELETE FROM class WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

        query_db_delete(query, res)
    }
});

//***CLASS_FEATURE***
//view
app.get('/v2/class_feature', (req, res) => {
/*  Query the class_feature table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Any access_level can use this method.
    else{
        let query = "SELECT * FROM class_feature";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code){
        dept_code_array = dept_code.split(",");
        for(let i = 0; i < dept_code_array.length; i++){
            if(i > 0){
                query = query + " OR"
            }
            check_str_type(dept_code_array[i], res);
            query = query + " dept_code = " + con.escape(dept_code_array[i]);
        }
        prev = true;
    };
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num){
        class_num_array = class_num.split(",");
        for(let i = 0; i < class_num_array.length; i++){
            if(i > 0){
                query = query + " OR"
            }
            check_str_type(class_num_array[i], res);
            query = query + " class_num = " + con.escape(class_num_array[i]);
        }
        prev = true;
    };
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id){
        feature_id_array = feature_id.split(",");
        for(let i = 0; i < feature_id_array.length; i++){
            if(i > 0){
                query = query + " OR"
            }
            check_int_type(feature_id_array[i], res);
            query = query + " feature_id = " + con.escape(feature_id_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/class_feature', (req, res) => {
/*  Adds a record to the class_feature table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = "INSERT INTO class_feature (dept_code,class_num,feature_id) VALUES ?";
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.feature_id, res, 11);
        data = [
            [req.body.dept_code,req.body.class_num,req.body.feature_id]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/class_feature/:dept_code_id/:class_num_id/:feature_id_id', (req, res) => {
/*  Updates a row in the class_feature table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = 'UPDATE class_feature SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), feature_id = COALESCE(?,feature_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.feature_id, res, 11);
        data = [
            req.body.dept_code,req.body.class_num,req.body.feature_id
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/class_feature/:dept_code_id/:class_num_id/:feature_id_id', (req, res) => {
/*  Delete a record from the class_feature table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.feature_id, res, 11);
        
        let query = 'DELETE FROM class_feature WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

        query_db_delete(query, res)
    }
});

//***DEPT***
//view
app.get('/v2/dept', (req, res) => {
/*  Query the dept table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Any access_level can use this method.
    else{
        let query = "SELECT * FROM dept";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code){
        dept_code_array = dept_code.split(",");
        for(let i = 0; i < dept_code_array.length; i++){
            check_str_type(dept_code_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " dept_code = " + con.escape(dept_code_array[i]);
        }
        prev = true;
    };
    //where condition:dept_name
    let dept_name = req.query.dept_name
    if (dept_name){
        dept_name_array = dept_name.split(",");
        for(let i = 0; i < dept_name_array.length; i++){
            check_str_type(dept_name_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " dept_name = " + con.escape(dept_name_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/dept', (req, res) => {
/*  Adds a record to the dept table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = "INSERT INTO dept (dept_code,dept_name) VALUES ?";
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.dept_name, res, 5);
        data = [
            [req.body.dept_code,req.body.dept_name]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/dept/:dept_code_id', (req, res) => {
/*  Updates a row in the dept table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = 'UPDATE dept SET dept_code = COALESCE(?,dept_code), dept_name = COALESCE(?,dept_name) WHERE dept_code= '+con.escape(req.params.dept_code_id)+'';
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.dept_name, res, 5);
        
        data = [
            req.body.dept_code,req.body.dept_name
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/dept/:dept_code_id', (req, res) => {
/*  Delete a record from the dept table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.dept_code, res);
        check_str_type(req.body.dept_name, res);
        let query = 'DELETE FROM dept WHERE dept_code= '+con.escape(req.params.dept_code_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY***
//view
app.get('/v2/faculty', (req, res) => {
/*  Query the faculty table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Any access_level can use this method.
    else{
        let query = "SELECT * FROM faculty";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id){
        faculty_id_array = faculty_id.split(",");
        for(let i = 0; i < faculty_id_array.length; i++){
            check_int_type(faculty_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " faculty_id = " + con.escape(faculty_id_array[i]);
        }
        prev = true;
    };
    //where condition:faculty_first
    let faculty_first = req.query.faculty_first
    if (faculty_first){
        faculty_first_array = faculty_first.split(",");
        for(let i = 0; i < faculty_first_array.length; i++){
            check_str_type(faculty_first_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " faculty_first = " + con.escape(faculty_first_array[i]);
        }
        prev = true;
    };
    //where condition:faculty_last
    let faculty_last = req.query.faculty_last
    if (faculty_last){
        faculty_last_array = faculty_last.split(",");
        for(let i = 0; i < faculty_last_array.length; i++){
            check_str_type(faculty_last_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " faculty_last = " + con.escape(faculty_last_array[i]);
        }
        prev = true;
    };
    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id){
        title_id_array = title_id.split(",");
        for(let i = 0; i < title_id_array.length; i++){
            check_int_type(title_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " title_id = " + con.escape(title_id_array[i]);
        }
        prev = true;
    };
    //where condition:prev_load
    let prev_load = req.query.prev_load
    if (prev_load){
        prev_load_array = prev_load.split(",");
        for(let i = 0; i < prev_load_array.length; i++){
            check_int_type(prev_load_array[i], res); // TODO add double check type?
            if(i > 0){
                query = query + " OR"
            }
            query = query + " prev_load = " + con.escape(prev_load_array[i]);
        }
        prev = true;
    };
    //where condition:curr_load
    let curr_load = req.query.curr_load
    if (curr_load){
        curr_load_array = curr_load.split(",");
        for(let i = 0; i < curr_load_array.length; i++){
            check_int_type(curr_load_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " curr_load = " + con.escape(curr_load_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/faculty', (req, res) => {
/*  Adds a record to the faculty table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = "INSERT INTO faculty (faculty_id,faculty_first,faculty_last,title_id,prev_load,curr_load) VALUES ?";
        check_int_type(req.body.faculty_id, res, 11);
        check_str_type(req.body.faculty_first, res, 50);
        check_str_type(req.body.faculty_last, res, 50);
        check_int_type(req.body.title_id, res, 11);
        check_int_type(req.body.prev_load, res, 15);
        check_int_type(req.body.curr_load, res, 15);
        data = [
            [req.body.faculty_id,req.body.faculty_first,req.body.faculty_last,req.body.title_id,req.body.prev_load,req.body.curr_load]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty/:faculty_id_id', (req, res) => {
/*  Updates a row in the faculty table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = 'UPDATE faculty SET faculty_id = COALESCE(?,faculty_id), faculty_first = COALESCE(?,faculty_first), faculty_last = COALESCE(?,faculty_last), title_id = COALESCE(?,title_id), prev_load = COALESCE(?,prev_load), curr_load = COALESCE(?,curr_load) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+'';
        
        check_int_type(req.body.faculty_id, res, 11);
        check_str_type(req.body.faculty_first, res, 50);
        check_str_type(req.body.faculty_last, res, 50);
        check_int_type(req.body.title_id, res, 11);
        check_int_type(req.body.prev_load, res);
        check_int_type(req.body.curr_load, res);

        data = [
            req.body.faculty_id,req.body.faculty_first,req.body.faculty_last,req.body.title_id,req.body.prev_load,req.body.curr_load
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty/:faculty_id_id', (req, res) => {
/*  Delete a record from the faculty table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_int_type(req.body.faculty_id, res)
        let query = 'DELETE FROM faculty WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY_CLASS***
//view
app.get('/v2/faculty_class', (req, res) => {
/*  Query the faculty_class table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else if (payload.user.access_level<1){res.status(403).send("REQUEST DENIED- admin or faculty method only")}
    else{
        let query = "SELECT * FROM faculty_class";

        if(Object.keys(req.query).length > 0 | payload.user.access_level == 1){
            query = query + " WHERE"
        }
    //where condition:faculty_id
    //if user is faculty member, restrict view to their faculty_id
    if (payload.user.access_level == 1){
        faculty_id = payload.user.faculty_id
        query = query + " faculty_id = " + con.escape(faculty_id);
    }
    else if (req.query.faculty_id){
        faculty_id = req.query.faculty_id
        faculty_id_array = faculty_id.split(",");
        for(let i = 0; i < faculty_id_array.length; i++){
            check_int_type(faculty_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " faculty_id = " + con.escape(faculty_id_array[i]);
        }
        prev = true;
    };
    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code){
        dept_code_array = dept_code.split(",");
        for(let i = 0; i < dept_code_array.length; i++){
            check_str_type(dept_code_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " dept_code = " + con.escape(dept_code_array[i]);
        }
        prev = true;
    };
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num){
        class_num_array = class_num.split(",");
        for(let i = 0; i < class_num_array.length; i++){
            check_str_type(class_num_array, res, 5);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " class_num = " + con.escape(class_num_array[i]);
        }
        prev = true;
    };
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level){
        pref_level_array = pref_level.split(",");
        for(let i = 0; i < pref_level_array.length; i++){
            check_int_type(pref_level_array[i], res, 11);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " pref_level = " + con.escape(pref_level_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/faculty_class', (req, res) => {
/*  Adds a record to the faculty_class table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "INSERT INTO faculty_class (faculty_id,dept_code,class_num,pref_level) VALUES ?";
        check_int_type(req.body.faculty_id, res, 11);
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.pref_level, res, 11);
        data = [
            [req.body.faculty_id,req.body.dept_code,req.body.class_num,req.body.pref_level]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty_class/:faculty_id_id/:dept_code_id/:class_num_id', (req, res) => {
/*  Updates a row in the faculty_class table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE faculty_class SET faculty_id = COALESCE(?,faculty_id), dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';
        
        check_int_type(req.body.faculty_id, res, 11);
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.pref_level, res, 11);

        data = [
            req.body.faculty_id,req.body.dept_code,req.body.class_num,req.body.pref_level
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty_class/:faculty_id_id/:dept_code_id/:class_num_id', (req, res) => {
/*  Delete a record from the faculty_class table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        check_int_type(req.body.faculty_id, res);
        check_str_type(req.body.dept_code, res);
        check_str_type(req.body.class_num, res);
        check_int_type(req.body.pref_level, res);
        let query = 'DELETE FROM faculty_class WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY_FEATURE***
//view
app.get('/v2/faculty_feature', (req, res) => {
/*  Query the faculty_feature table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM faculty_feature";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id){
        faculty_id_array = faculty_id.split(",");
        for(let i = 0; i < faculty_id_array.length; i++){
            check_int_type(faculty_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " faculty_id = " + con.escape(faculty_id_array[i]);
        }
        prev = true;
    };
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id){
        feature_id_array = feature_id.split(",");
        for(let i = 0; i < feature_id_array.length; i++){
            check_int_type(feature_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " feature_id = " + con.escape(feature_id_array[i]);
        }
        prev = true;
    };
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level){
        pref_level_array = pref_level.split(",");
        for(let i = 0; i < pref_level_array.length; i++){
            check_int_type(pref_level_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " pref_level = " + con.escape(pref_level_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/faculty_feature', (req, res) => {
/*  Adds a record to the faculty_feature table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "INSERT INTO faculty_feature (faculty_id,feature_id,pref_level) VALUES ?";
        check_int_type(req.body.faculty_id, res, 11);
        check_int_type(req.body.feature_id, res, 11);
        check_int_type(req.body.pref_level, res, 11);
        data = [
            [req.body.faculty_id,req.body.feature_id,req.body.pref_level]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty_feature/:faculty_id_id/:feature_id_id', (req, res) => {
/*  Updates a row in the faculty_feature table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE faculty_feature SET faculty_id = COALESCE(?,faculty_id), feature_id = COALESCE(?,feature_id), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';
        check_int_type(req.body.faculty_id, res, 11);
        check_int_type(req.body.feature_id, res, 11);
        check_int_type(req.body.pref_level, res, 11);

        data = [
            req.body.faculty_id,req.body.feature_id,req.body.pref_level
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty_feature/:faculty_id_id/:feature_id_id', (req, res) => {
/*  Delete a record from the faculty_feature table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        check_int_type(req.body.faculty_id, res);
        check_int_type(req.body.feature_id, res);
        check_int_type(req.body.pref_level, res);
        let query = 'DELETE FROM faculty_feature WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY_OTHER_REQUEST***
//view
app.get('/v2/faculty_other_request', (req, res) => {
/*  Query the faculty_other_request table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM faculty_other_request";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id){
        faculty_id_array = faculty_id.split(",");
        for(let i = 0; i < faculty_id_array.length; i++){
            check_int_type(faculty_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " faculty_id = " + con.escape(faculty_id_array[i]);
        }
        prev = true;
    };
    //where condition:request
    let request = req.query.request
    if (request){
        request_array = request.split(",");
        for(let i = 0; i < request_array.length; i++){
            check_str_type(request_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " request = " + con.escape(request_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/faculty_other_request', (req, res) => {
/*  Adds a record to the faculty_other_request table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "INSERT INTO faculty_other_request (faculty_id,request) VALUES ?";
        check_int_type(req.body.faculty_id, res, 11);
        check_str_type(req.body.request, res, 130);
        data = [
            [req.body.faculty_id,req.body.request]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty_other_request/:faculty_id_id/:request_id', (req, res) => {
/*  Updates a row in the faculty_other_request table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE faculty_other_request SET faculty_id = COALESCE(?,faculty_id), request = COALESCE(?,request) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND request= '+con.escape(req.params.request_id)+'';
        check_int_type(req.body.faculty_id, res, 11);
        check_str_type(req.body.request, res, 130);
        data = [
            req.body.faculty_id,req.body.request
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty_other_request/:faculty_id_id/:request_id', (req, res) => {
/*  Delete a record from the faculty_other_request table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        check_int_type(req.body.faculty_id, res);
        check_str_type(req.body.request, res);
        let query = 'DELETE FROM faculty_other_request WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND request= '+con.escape(req.params.request_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY_TIMESLOT***
//view
app.get('/v2/faculty_timeslot', (req, res) => {
/*  Query the faculty_timeslot table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM faculty_timeslot";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id){
        faculty_id_array = faculty_id.split(",");
        for(let i = 0; i < faculty_id_array.length; i++){
            check_int_type(faculty_id_array[i], res, 11);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " faculty_id = " + con.escape(faculty_id_array[i]);
        }
        prev = true;
    };
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id){
        time_id_array = time_id.split(",");
        for(let i = 0; i < time_id_array.length; i++){
            check_int_type(time_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " time_id = " + con.escape(time_id_array[i]);
        }
        prev = true;
    };
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level){
        pref_level_array = pref_level.split(",");
        for(let i = 0; i < pref_level_array.length; i++){
            check_int_type(pref_level_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " pref_level = " + con.escape(pref_level_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/faculty_timeslot', (req, res) => {
/*  Adds a record to the faculty_timeslot table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "INSERT INTO faculty_timeslot (faculty_id,time_id,pref_level) VALUES ?";
        check_int_type(req.body.faculty_id, res, 11);
        check_int_type(req.body.time_id, res, 11);
        check_int_type(req.body.pref_level, res, 11);
        data = [
            [req.body.faculty_id,req.body.time_id,req.body.pref_level]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty_timeslot/:faculty_id_id/:time_id_id', (req, res) => {
/*  Updates a row in the faculty_timeslot table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE faculty_timeslot SET faculty_id = COALESCE(?,faculty_id), time_id = COALESCE(?,time_id), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';
        check_int_type(req.body.faculty_id, res, 11);
        check_int_type(req.body.time_id, res, 11);
        check_int_type(req.body.pref_level, res, 11);
        data = [
            req.body.faculty_id,req.body.time_id,req.body.pref_level
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty_timeslot/:faculty_id_id/:time_id_id', (req, res) => {
/*  Delete a record from the faculty_timeslot table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM faculty_timeslot WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';
        check_int_type(req.body.faculty_id, res);
        check_int_type(req.body.time_id, res);
        check_int_type(req.body.pref_level, res);
        query_db_delete(query, res)
    }
});

//***FEATURE***
//view
app.get('/v2/feature', (req, res) => {
/*  Query the feature table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Any access_level can use this method.
    else{
        let query = "SELECT * FROM feature";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id){
        feature_id_array = feature_id.split(",");
        for(let i = 0; i < feature_id_array.length; i++){
            check_int_type(feature_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " feature_id = " + con.escape(feature_id_array[i]);
        }
        prev = true;
    };
    //where condition:feature_name
    let feature_name = req.query.feature_name
    if (feature_name){
        feature_name_array = feature_name.split(",");
        for(let i = 0; i < feature_name_array.length; i++){
            check_str_type(feature_name_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " feature_name = " + con.escape(feature_name_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/feature', (req, res) => {
/*  Adds a record to the feature table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = "INSERT INTO feature (feature_id,feature_name) VALUES ?";
        check_int_type(feature_id, res, 11);
        check_str_type(feature_name, res, 100);
        data = [
            [req.body.feature_id,req.body.feature_name]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/feature/:feature_id_id', (req, res) => {
/*  Updates a row in the feature table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = 'UPDATE feature SET feature_id = COALESCE(?,feature_id), feature_name = COALESCE(?,feature_name) WHERE feature_id= '+con.escape(req.params.feature_id_id)+'';
        check_int_type(req.body.feature_id, res, 11);
        check_str_type(req.body.feature_name, res, 100);
        data = [
            req.body.feature_id,req.body.feature_name
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/feature/:feature_id_id', (req, res) => {
/*  Delete a record from the feature table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_int_type(req.body.feature_id, res, 11);
        check_str_type(req.body.feature_name, res, 100);
        let query = 'DELETE FROM feature WHERE feature_id= '+con.escape(req.params.feature_id_id)+'';

        query_db_delete(query, res)
    }
});

//***LOGIN***
//view
app.get('/v2/login', (req, res) => {
/*  Query the login table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        //let query = "SELECT * FROM login";
        let query = "SELECT user_id,email,faculty_id,access_level FROM login";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:user_id
    let user_id = req.query.user_id
    if (user_id){
        user_id_array = user_id.split(",");
        for(let i = 0; i < user_id_array.length; i++){
            check_str_type(user_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " user_id = " + con.escape(user_id_array[i]);
        }
        prev = true;
    };
    //where condition:pass
    let pass = req.query.pass
    if (pass){
        pass_array = pass.split(",");
        for(let i = 0; i < pass_array.length; i++){
            check_str_type(pass_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " pass = " + con.escape(pass_array[i]);
        }
        prev = true;
    };
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id){
        faculty_id_array = faculty_id.split(",");
        for(let i = 0; i < faculty_id_array.length; i++){
            check_int_type(faculty_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " faculty_id = " + con.escape(faculty_id_array[i]);
        }
        prev = true;
    };
    //where condition:access_level
    let access_level = req.query.access_level
    if (access_level){
        access_level_array = access_level.split(",");
        for(let i = 0; i < access_level_array.length; i++){
            check_int_type(access_level_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " access_level = " + con.escape(access_level_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add does not exist. use /v2/signup method.
//update
app.put('/v2/login/:email_id', (req, res) => {
/*  Updates a faculty_id or the access level in the login table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Access_level 2 (admin) or Access level 3 (temp setup) can use this method to update email, faculty_id, and access_level.
    else if (payload.user.access_level<2){res.status(403).send("REQUEST DENIED- admin method only")}

    else{
        console.log(req.body)
        let query = "INSERT INTO login (user_id,pass,faculty_id,access_level) VALUES ?";
        check_str_type(req.body.user_id, res, 100);
        check_str_type(req.body.faculty_id, res, 100);
        check_int_type(req.body.faculty_id, res, 11);
        check_int_type(req.body.faculty_id, res, 11);
        data = [
            req.body.email,req.body.faculty_id,req.body.access_level
        ]

        query_db_put(query, data, res)
    }
});
app.put('/v2/login/:email_id/change_password', async (req, res) => {
/*  Updates a password in the login table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const salt = await bcrypt.genSalt(10)
    try{ 
        hash = await bcrypt.hash(req.body.password, salt)
    } catch (err) {
        return res.status(500).send("Error encrypting data, please try again")
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Any access_level can use this method.
    else{
        let query = 'UPDATE login SET user_id = COALESCE(?,user_id), pass = COALESCE(?,pass), faculty_id = COALESCE(?,faculty_id), access_level = COALESCE(?,access_level) WHERE user_id= '+con.escape(req.params.user_id_id)+'';
        check_str_type(req.body.user_id, res, 100);
        check_str_type(req.body.faculty_id, res, 100);
        check_int_type(req.body.faculty_id, res, 11);
        check_int_type(req.body.faculty_id, res, 11);
        bcrypt.compare(req.body.password,payload.user.pass)
        .then(correct => {
            if(correct){ 
                let query = 'UPDATE login SET pass = COALESCE(?,pass) WHERE email= '+con.escape(req.params.email_id)+'';

                data = [
                    hash
                ]
                query_db_put(query, data, res)
            }
            else {res.status(401).send('Incorrect password')}
        });
    }
});
//delete
app.delete('/v2/login/:email_id', (req, res) => {
/*  Delete a record from the login table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.user_id, res)
        check_str_type(req.body.faculty_id, res);
        check_int_type(req.body.faculty_id, res);
        check_int_type(req.body.faculty_id, res);
        let query = 'DELETE FROM login WHERE user_id= '+con.escape(req.params.user_id_id)+'';

        query_db_delete(query, res)
    }
});

//***MEETS***
//view
app.get('/v2/meets', (req, res) => {
/*  Query the meets table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM meets";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code){
        dept_code_array = dept_code.split(",");
        for(let i = 0; i < dept_code_array.length; i++){
            check_str_type(dept_code_array[i]);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " dept_code = " + con.escape(dept_code_array[i]);
        }
        prev = true;
    };
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num){
        class_num_array = class_num.split(",");
        for(let i = 0; i < class_num_array.length; i++){
            check_str_type(class_num_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " class_num = " + con.escape(class_num_array[i]);
        }
        prev = true;
    };
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num){
        section_num_array = section_num.split(",");
        for(let i = 0; i < section_num_array.length; i++){
            check_int_type(section_num_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " section_num = " + con.escape(section_num_array[i]);
        }
        prev = true;
    };
    //where condition:semester
    let semester = req.query.semester
    if (semester){
        semester_array = semester.split(",");
        for(let i = 0; i < semester_array.length; i++){
            check_str_type(semester_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " semester = " + con.escape(semester_array[i]);
        }
        prev = true;
    };
    //where condition:draft
    let draft = req.query.draft
    if (draft){
        draft_array = draft.split(",");
        for(let i = 0; i < draft_array.length; i++){
            check_int_type(draft_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " draft = " + con.escape(draft_array[i]);
        }
        prev = true;
    };
    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code){
        building_code_array = building_code.split(",");
        for(let i = 0; i < building_code_array.length; i++){
            check_str_type(building_code_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " building_code = " + con.escape(building_code_array[i]);
        }
        prev = true;
    };
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num){
        room_num_array = room_num.split(",");
        for(let i = 0; i < room_num_array.length; i++){
            check_str_type(room_num_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " room_num = " + con.escape(room_num_array[i]);
        }
        prev = true;
    };
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id){
        time_id_array = time_id.split(",");
        for(let i = 0; i < time_id_array.length; i++){
            check_int_type(time_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " time_id = " + con.escape(time_id_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/meets', (req, res) => {
/*  Adds a record to the meets table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        console.log(req.body)
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.section_num, res, 11);
        check_str_type(req.body.semester, res, 15);
        check_int_type(req.body.draft, res, 11);
        check_str_type(req.body.building_code, res, 5);
        check_str_type(req.body.room_num, res, 5);
        check_int_type(req.body.time_id, res, 11);
        let query = "INSERT INTO meets (dept_code,class_num,section_num,semester,draft,building_code,room_num,time_id) VALUES ?";
        data = [
            [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.building_code,req.body.room_num,req.body.time_id]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/meets/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:building_code_id/:room_num_id/:time_id_id', (req, res) => {
/*  Updates a row in the meets table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.section_num, res, 11);
        check_str_type(req.body.semester, res, 15);
        check_int_type(req.body.draft, res, 11);
        check_str_type(req.body.building_code, res, 5);
        check_str_type(req.body.room_num, res, 5);
        check_int_type(req.body.time_id, res, 11);
        let query = 'UPDATE meets SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), time_id = COALESCE(?,time_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

        data = [
            req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.building_code,req.body.room_num,req.body.time_id
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/meets/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:building_code_id/:room_num_id/:time_id_id', (req, res) => {
/*  Delete a record from the meets table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.dept_code, res);
        check_str_type(req.body.class_num, res);
        check_int_type(req.body.section_num, res);
        check_str_type(req.body.semester, res);
        check_int_type(req.body.draft, res);
        check_str_type(req.body.building_code, res);
        check_str_type(req.body.room_num, res);
        check_int_type(req.body.time_id, res);
        let query = 'DELETE FROM meets WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

        query_db_delete(query, res)
    }
});

//***ROOM***
//view
app.get('/v2/room', (req, res) => {
/*  Query the room table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM room";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code){
        building_code_array = building_code.split(",");
        for(let i = 0; i < building_code_array.length; i++){
            check_str_type(building_code_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " building_code = " + con.escape(building_code_array[i]);
        }
        prev = true;
    };
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num){
        room_num_array = room_num.split(",");
        for(let i = 0; i < room_num_array.length; i++){
            check_str_type(room_num_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " room_num = " + con.escape(room_num_array[i]);
        }
        prev = true;
    };
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity){
        capacity_array = capacity.split(",");
        for(let i = 0; i < capacity_array.length; i++){
            check_int_type(capacity_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " capacity = " + con.escape(capacity_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/room', (req, res) => {
/*  Adds a record to the room table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = "INSERT INTO room (building_code,room_num,capacity) VALUES ?";
        check_str_type(req.body.building_code, res, 5);
        check_str_type(req.body.room_num, res, 5);
        check_int_type(req.body.capacity, res, 11);
        data = [
            [req.body.building_code,req.body.room_num,req.body.capacity]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/room/:building_code_id/:room_num_id', (req, res) => {
/*  Updates a row in the room table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = 'UPDATE room SET building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), capacity = COALESCE(?,capacity) WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+'';
        check_str_type(req.body.building_code, res, 5);
        check_str_type(req.body.room_num, res, 5);
        check_int_type(req.body.capacity, res, 11);
        data = [
            req.body.building_code,req.body.room_num,req.body.capacity
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/room/:building_code_id/:room_num_id', (req, res) => {
/*  Delete a record from the room table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.building_code, res, 5);
        check_str_type(req.body.room_num, res, 5);
        check_int_type(req.body.capacity, res, 11);
        let query = 'DELETE FROM room WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+'';

        query_db_delete(query, res)
    }
});

//***ROOM_FEATURE***
//view
app.get('/v2/room_feature', (req, res) => {
/*  Query the room_feature table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM room_feature";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code){
        building_code_array = building_code.split(",");
        for(let i = 0; i < building_code_array.length; i++){
            check_str_type(building_code_array[i], res, 5);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " building_code = " + con.escape(building_code_array[i]);
        }
        prev = true;
    };
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num){
        room_num_array = room_num.split(",");
        for(let i = 0; i < room_num_array.length; i++){
            check_str_type(room_num_array[i], res, 5);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " room_num = " + con.escape(room_num_array[i]);
        }
        prev = true;
    };
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id){
        feature_id_array = feature_id.split(",");
        for(let i = 0; i < feature_id_array.length; i++){
            check_int_type(feature_id_array[i], res, 11);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " feature_id = " + con.escape(feature_id_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/room_feature', (req, res) => {
/*  Adds a record to the room_feature table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.building_code, res, 5);
        check_str_type(req.body.room_num, res, 5);
        check_int_type(req.body.feature_id, res, 11);
        let query = "INSERT INTO room_feature (building_code,room_num,feature_id) VALUES ?";
        data = [
            [req.body.building_code,req.body.room_num,req.body.feature_id]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/room_feature/:building_code_id/:room_num_id/:feature_id_id', (req, res) => {
/*  Updates a row in the room table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = 'UPDATE room_feature SET building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), feature_id = COALESCE(?,feature_id) WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';
        check_str_type(req.body.building_code, res, 5);
        check_str_type(req.body.room_num, res, 5);
        check_int_type(req.body.feature_id, res, 11);
        data = [
            req.body.building_code,req.body.room_num,req.body.feature_id
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/room_feature/:building_code_id/:room_num_id/:feature_id_id', (req, res) => {
/*  Delete a record from the room_feature table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.building_code, res);
        check_str_type(req.body.room_num, res);
        check_int_type(req.body.feature_id, res);
        let query = 'DELETE FROM room_feature WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

        query_db_delete(query, res)
    }
});

//***SECTION***
//view
app.get('/v2/section', (req, res) => {
/*  Query the section table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM section";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code){
        dept_code_array = dept_code.split(",");
        for(let i = 0; i < dept_code_array.length; i++){
            check_str_type(dept_code_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " dept_code = " + con.escape(dept_code_array[i]);
        }
        prev = true;
    };
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num){
        class_num_array = class_num.split(",");
        for(let i = 0; i < class_num_array.length; i++){
            check_str_type(class_num_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " class_num = " + con.escape(class_num_array[i]);
        }
        prev = true;
    };
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num){
        section_num_array = section_num.split(",");
        for(let i = 0; i < section_num_array.length; i++){
            check_int_type(section_num_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " section_num = " + con.escape(section_num_array[i]);
        }
        prev = true;
    };
    //where condition:semester
    let semester = req.query.semester
    if (semester){
        semester_array = semester.split(",");
        for(let i = 0; i < semester_array.length; i++){
            check_str_type(semest_array[i], res, 15);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " semester = " + con.escape(semester_array[i]);
        }
        prev = true;
    };
    //where condition:draft
    let draft = req.query.draft
    if (draft){
        draft_array = draft.split(",");
        for(let i = 0; i < draft_array.length; i++){
            check_int_type(draft_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " draft = " + con.escape(draft_array[i]);
        }
        prev = true;
    };
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity){
        capacity_array = capacity.split(",");
        for(let i = 0; i < capacity_array.length; i++){
            check_int_type(capacity_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " capacity = " + con.escape(capacity_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/section', (req, res) => {
/*  Adds a record to the section table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = "INSERT INTO section (dept_code,class_num,section_num,semester,draft,capacity) VALUES ?";
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.seciton_num, res, 11);
        check_str_type(req.body.semester, res, 15);
        check_int_type(req.body.draft, res, 11);
        check_int_type(req.body.capacity, res, 11);
        data = [
            [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.capacity]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/section/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id', (req, res) => {
/*  Updates a row in the section table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = 'UPDATE section SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), capacity = COALESCE(?,capacity) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+'';
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.seciton_num, res, 11);
        check_str_type(req.body.semester, res, 15);
        check_int_type(req.body.draft, res, 11);
        check_int_type(req.body.capacity, res, 11);
        data = [
            req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.capacity
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/section/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id', (req, res) => {
/*  Delete a record from the section table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.dept_code, res);
        check_str_type(req.body.class_num, res);
        check_int_type(req.body.seciton_num, res);
        check_str_type(req.body.semester, res);
        check_int_type(req.body.draft, res);
        check_int_type(req.body.capacity, res);
        let query = 'DELETE FROM section WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+'';

        query_db_delete(query, res)
    }
});

//***TEACHES***
//view
app.get('/v2/teaches', (req, res) => {
/*  Query the teaches table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM teaches";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code){
        dept_code_array = dept_code.split(",");
        for(let i = 0; i < dept_code_array.length; i++){
            check_str_type(dept_code_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " dept_code = " + con.escape(dept_code_array[i]);
        }
        prev = true;
    };
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num){
        class_num_array = class_num.split(",");
        for(let i = 0; i < class_num_array.length; i++){
            check_str_type(class_num_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " class_num = " + con.escape(class_num_array[i]);
        }
        prev = true;
    };
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num){
        section_num_array = section_num.split(",");
        for(let i = 0; i < section_num_array.length; i++){
            check_int_type(section_num_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " section_num = " + con.escape(section_num_array[i]);
        }
        prev = true;
    };
    //where condition:semester
    let semester = req.query.semester
    if (semester){
        semester_array = semester.split(",");
        for(let i = 0; i < semester_array.length; i++){
            check_int_type(semester_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " semester = " + con.escape(semester_array[i]);
        }
        prev = true;
    };
    //where condition:draft
    let draft = req.query.draft
    if (draft){
        draft_array = draft.split(",");
        for(let i = 0; i < draft_array.length; i++){
            check_int_type(draft_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " draft = " + con.escape(draft_array[i]);
        }
        prev = true;
    };
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id){
        faculty_id_array = faculty_id.split(",");
        for(let i = 0; i < faculty_id_array.length; i++){
            check_int_type(faculty_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " faculty_id = " + con.escape(faculty_id_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/teaches', (req, res) => {
/*  Adds a record to the teaches table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = "INSERT INTO teaches (dept_code,class_num,section_num,semester,draft,faculty_id) VALUES ?";
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.section_num, res, 11);
        check_str_type(req.body.semester, res, 15);
        check_int_type(req.body.draft, res, 11);
        check_int_type(req.body.facutly_id, res, 11);
        data = [
            [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.faculty_id]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/teaches/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:faculty_id_id', (req, res) => {
/*  Updates a row in the teaches table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        let query = 'UPDATE teaches SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), faculty_id = COALESCE(?,faculty_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND faculty_id= '+con.escape(req.params.faculty_id_id)+'';
        check_str_type(req.body.dept_code, res, 5);
        check_str_type(req.body.class_num, res, 5);
        check_int_type(req.body.section_num, res, 11);
        check_str_type(req.body.semester, res, 15);
        check_int_type(req.body.draft, res, 11);
        check_int_type(req.body.facutly_id, res, 11);
        data = [
            req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.faculty_id
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/teaches/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:faculty_id_id', (req, res) => {
/*  Delete a record from the teaches table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_str_type(req.body.dept_code, res);
        check_str_type(req.body.class_num, res);
        check_int_type(req.body.section_num, res);
        check_str_type(req.body.semester, res);
        check_int_type(req.body.draft, res);
        check_int_type(req.body.facutly_id, res);
        let query = 'DELETE FROM teaches WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND faculty_id= '+con.escape(req.params.faculty_id_id)+'';

        query_db_delete(query, res)
    }
});

//***TIMESLOT***
//view
app.get('/v2/timeslot', (req, res) => {
/*  Query the timeslot table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM timeslot";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id){
        time_id_array = time_id.split(",");
        for(let i = 0; i < time_id_array.length; i++){
            check_int_type(time_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " time_id = " + con.escape(time_id_array[i]);
        }
        prev = true;
    };
    //where condition:day_of_week
    let day_of_week = req.query.day_of_week
    if (day_of_week){
        day_of_week_array = day_of_week.split(",");
        for(let i = 0; i < day_of_week_array.length; i++){
            check_int_type(day_of_week_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " day_of_week = " + con.escape(day_of_week_array[i]);
        }
        prev = true;
    };
    //where condition:time_start
    let time_start = req.query.time_start
    if (time_start){
        time_start_array = time_start.split(",");
        for(let i = 0; i < time_start_array.length; i++){
            // TODO: add type check for time
            if(i > 0){
                query = query + " OR"
            }
            query = query + " time_start = " + con.escape(time_start_array[i]);
        }
        prev = true;
    };
    //where condition:time_end
    let time_end = req.query.time_end
    if (time_end){
        time_end_array = time_end.split(",");
        for(let i = 0; i < time_end_array.length; i++){
            // TODO: add type check for time
            if(i > 0){
                query = query + " OR"
            }
            query = query + " time_end = " + con.escape(time_end_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/timeslot', (req, res) => {
/*  Adds a record to the timeslot table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_int_type(req.body.time_id, res, 11);
        check_int_type(req.body.day_of_week, res, 11);
        let query = "INSERT INTO timeslot (time_id,day_of_week,time_start,time_end) VALUES ?";
        data = [
            [req.body.time_id,req.body.day_of_week,req.body.time_start,req.body.time_end]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/timeslot/:time_id_id', (req, res) => {
/*  Updates a row in the timeslot table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_int_type(req.body.time_id, res, 11);
        check_int_type(req.body.day_of_week, res, 11);
        let query = 'UPDATE timeslot SET time_id = COALESCE(?,time_id), day_of_week = COALESCE(?,day_of_week), time_start = COALESCE(?,time_start), time_end = COALESCE(?,time_end) WHERE time_id= '+con.escape(req.params.time_id_id)+'';

        data = [
            req.body.time_id,req.body.day_of_week,req.body.time_start,req.body.time_end
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/timeslot/:time_id_id', (req, res) => {
/*  Delete a record from the timeslot table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_int_type(req.body.time_id, res);
        check_int_type(req.body.day_of_week, res);
        let query = 'DELETE FROM timeslot WHERE time_id= '+con.escape(req.params.time_id_id)+'';

        query_db_delete(query, res)
    }
});

//***TITLE***
//view
app.get('/v2/title', (req, res) => {
/*  Query the title table.

    If no values are passed in req.query a `SELECT *` query with no WHERE clause will be 
    run. If values are passed in req.query, a `SELEECT *` query will be run with a WHERE
    clause to filter values from the table.

    @since  v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM title";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id){
        title_id_array = title_id.split(",");
        for(let i = 0; i < title_id_array.length; i++){
            check_int_type(title_id_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " title_id = " + con.escape(title_id_array[i]);
        }
        prev = true;
    };
    //where condition:title_name
    let title_name = req.query.title_name
    if (title_name){
        title_name_array = title_name.split(",");
        for(let i = 0; i < title_name_array.length; i++){
            check_str_type(title_name, res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " title_name = " + con.escape(title_name_array[i]);
        }
        prev = true;
    };
    //where condition:max_load
    let max_load = req.query.max_load
    if (max_load){
        max_load_array = max_load.split(",");
        for(let i = 0; i < max_load_array.length; i++){
            check_int_type(max_load_array[i], res);
            if(i > 0){
                query = query + " OR"
            }
            query = query + " max_load = " + con.escape(max_load_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/title', (req, res) => {
/*  Adds a record to the title table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record.

    @ since v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_int_type(req.body.title_id, res, 11);
        check_str_type(req.body.title_name, res, 30);
        check_int_type(req.body.max_load, res, 15);
        let query = "INSERT INTO title (title_id,title_name,max_load) VALUES ?";
        data = [
            [req.body.title_id,req.body.title_name,req.body.max_load]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/title/:title_id_id', (req, res) => {
/*  Updates a row in the title table.

    All primary keys in the table must be present with valid values (a valid value depends 
    on the type and size of the column) in req.body to successfully update the record. If
    values are not passed for non-primary key columns, NULL will be inserted in that column 
    in the row. If a value is passed it must be a valid value for the column. If a user 
    does not have a high enough access level to update a table, their request will be denied.

    @since      v0

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_int_type(req.body.title_id, res, 11);
        check_str_type(req.body.title_name, res, 30);
        check_int_type(req.body.max_load, res, 15);
        let query = 'UPDATE title SET title_id = COALESCE(?,title_id), title_name = COALESCE(?,title_name), max_load = COALESCE(?,max_load) WHERE title_id= '+con.escape(req.params.title_id_id)+'';

        data = [
            req.body.title_id,req.body.title_name,req.body.max_load
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/title/:title_id_id', (req, res) => {
/*  Delete a record from the building table.

    All primary keys in the table must be present in req.body to successfully 
    select and subsequently delete the record. If a user does not have a high 
    enough access level to delete records from a table, their request will be 
    denied.

    @since v0

    @param{Object}      req     The request info. Needs to contain a header with
                                a token and primary key columns and their values 
                                in req.body
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    //auth verified. Only access_level 2 (admin) can use this method.
    else if (payload.user.access_level!=2){res.status(403).send("REQUEST DENIED- admin method only")}
    else{
        check_int_type(req.body.title_id, res);
        check_str_type(req.body.title_name, res);
        check_int_type(req.body.max_load, res);
        let query = 'DELETE FROM title WHERE title_id= '+con.escape(req.params.title_id_id)+'';

        query_db_delete(query, res)
    }
});


    // query database
function query_db_get(query, res){
/*  Queries the database.

    Uses the previously made connection object as the database connection. Uses a Promise object to
    handle the query and any errors that may come from it.

    @since              2.0.0

    @param {String}     query     Query to send to the database. Should be valid SQL.

    @return{Object}     Returns json containing 'a status code with query results
*/
    new Promise( (resolve, reject) => {
      con.query(query, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result)
          }
      });
    })
    //return json package
    .then(rows => {
      res.status(200).type('application/json').send(rows);
    }).catch(err => {
        error_status = sql_error(err)
        res.status(error_status[0]).send(error_status[1]);
    });
}

function query_db_add(query, data, res){ 
/*  Puts a record in the the database.

    Uses the previously made connection object as the database connection. Uses a Promise object to
    handle the query and any errors that may come from it. If the row is already in the table, the
    user is notified. Only users with a high enough access level can use db_post.

    @since              2.0.0

    @param {String}     query     Query to add row(s) to the database. Should be valid SQL.

    @return{Object}     Returns a status code with a message saying the entry was added successfully
                        or the error message if it failed
*/
    new Promise( (resolve, reject) => {
      con.query(query, [data], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result)
          }
      });
    })
    //return json package
    .then(result => {
      res.status(200).send("Entry added successfully");
    }).catch(err => {
        error_status = sql_error(err)
        res.status(error_status[0]).send(error_status[1]);
    });
}

    // query database
function query_db_delete(query, res){
/*  Deletes a record from the database.

    Uses the previously made connection object as the database connection. Uses a Promise object to
    handle the query and any errors that may come from it. Only users with a high enough access level
    can use db_delete.

    @since              2.0.0

    @param {String}     query     Query to delete rows from the database. Should be valid SQL.

    @return{Object}     Returns JSON containing a status code with a message saying the either the 
                        record was not found or the error message.
*/
    new Promise( (resolve, reject) => {
      con.query(query, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result)
          }
      });
    })
    //return json package
    .then(result => {
        if (result.affectedRows == 0){res.status(404).send("Record not found")}
        res.status(200).send("Entry deleted successfully");
    }).catch(err => {
        error_status = sql_error(err)
        res.status(error_status[0]).send(error_status[1]);
    });
}

    // query database
function query_db_put(query, data, res){
/*  Updates a record in the database.

    Uses the previously made connection object as the database connection. Uses a Promise object to
    handle the query and any errors that may come from it.

    @since              2.0.0

    @param {String}     query     Query to send to the database. Should be valid SQL.

    @return{Object}     Returns JSON containing a status code with a message saying the record was not 
                        found, no changes were made, the record was updated successfully, or the error 
                        message.
*/
    new Promise( (resolve, reject) => {
      con.query(query, data, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result)
          }
      });
    })
    //return json package
    .then(result => {
        if (result.affectedRows == 0){return res.status(404).send("Record not found")}
        else if (result.changedRows == 0){return res.status(200).send("No change made")}
        return res.status(200).send("Record updated successfully");
    }).catch(err => {
        error_status = sql_error(err)
        return res.status(error_status[0]).send(error_status[1]);
    });
}

function sql_error(err) {
/*  Formats SQL errors thrown from database.

    @since              v2.0.0

    @param {Object}     err     Error from the database. Contains multiple attributes

    @return List        Returns list containing a status code and an error message
*/
    err_code = err.code
    if (err_code === "ER_ROW_IS_REFERENCED_2"){return [409,"Bad Request- referential integrity would be violated"]}
    if (err_code === "ER_NO_REFERENCED_ROW_2"){return [404,"The entry you are trying to access does not exist"]}
    if (err_code === "ER_DUP_ENTRY"){return [409,"Entry already exists"]}
    else {
        return [500,"Unknown error- send this to DB team: "+err]
    }
}

// ****login****
MIN_PASSWORD_LENGTH = 8;
MAX_PASSWORD_LENGTH = 16;
users = {};

//create users
app.post('/v2/signup', async (req, res) => {
/*  Adds a record to the login table.

    All columns in the table must be present with valid values (a valid value depends on
    the type and size of the column) in req.body to successfully add the record. Passwords
    will be stored in the database after they have been salted and hashed.

    @ since v2

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and all columns in the table with valid values in req.body

    @returns            nothing. 

*/
    if(!req.body){
      return res.sendStatus(400);
    }

    if (!req.body.email || !req.body.password) {
        return res.status(400).send('Missing email or password'); 
    }

    let loginemail = await db_get("SELECT * from login where email="+con.escape(req.body.email));
    if (!(loginemail.length === 0)) { return res.status(409).send('Email is already associated with an account'); } //which version, this or res send

    if(req.body.password.length < MIN_PASSWORD_LENGTH || req.body.password.length > MAX_PASSWORD_LENGTH){
        return res.status(400).send('Password must be between ' + MIN_PASSWORD_LENGTH + ' and ' + MAX_PASSWORD_LENGTH + ' characters long');
    }

    if(req.body.email.length > 130){
        return res.status(400).send("Email too long, please try again");
    }

const salt = await bcrypt.genSalt(10)
try{ hash = await bcrypt.hash(req.body.password, salt)
} catch (err) {return res.status(500).send("Error encrypting data, please try again")}
query_db_add("INSERT INTO login VALUES ?",[[ req.body.email, hash, req.body.faculty_id, access_level=0, tmp=null]],res)
});

//login
app.post('/v2/login', async function (req, res) {
/*  Query the login table to see if user should be granted access.

    @since  v2

    @param{Object}      req     The request info. Needs to contain an email address and a 
                                password to be a valid query. 

    @return             nothing.
*/
    var passHashed;
    //if (!req.body) { return res.sendStatus(400); }

    if (!req.body.email || !req.body.password) {
      return res.status(400).send('Missing email or password');
    }

    let loginjson = await db_get("SELECT * from login where email="+con.escape(req.body.email));
    if (loginjson.length === 0) { return res.status(404).send("Account with that email does not exist"); } 
    passHashed = loginjson[0].pass
    bcrypt.compare(req.body.password,passHashed)
    .then(correct => {
      if(correct){
        let token = jwt.sign(
          {user: loginjson[0]},
          secretkey,
          {
              algorithm: "HS256",
              expiresIn: 86400,
          });
        res.status(200).send(token)
      }
      else {res.status(401).send('Incorrect password')}
    });
});

function verify(token){
/*  Verify a valid token was passed in the header.

    @param{String}      token       token given to the user upon login

    @returns            Returns a list containing a status code and the payload if the token was
                        valid or an error message if the token was not valid.
*/
	// if the cookie is not set, return an unauthorized error
	if (!token) {
		return [401,"Unauthorized no token"]
	}
	var payload
	try {
		// Parse the JWT string and store the result in `payload`.
		// Note that we are passing the key in this method as well. This method will throw an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
		payload = jwt.verify(token, secretkey)
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			// if the error thrown is because the JWT is unauthorized, return a 401 error
			return [401,"Unauthorized error"]
		}
		// otherwise, return a bad request error
		return [401,"Unauthorized no token"]
	}
  return [200,payload]
}

// populate schedule
app.get('/v3/meets/ext', (req, res) =>{
/*  Query returns information about a section by gathering attributes from the meets,
    class, timeslot, room, teaches, and faculty tables in the database.

    since  v3

    @param{Object}      req     The request info. Needs to contain a header with a token
                                and can optionally contain column names with values to 
                                filter values in the query.

    @return             nothing.
*/
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    const verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        const query = `SELECT DISTINCT
                                m.dept_code,
                                m.class_num,
                                m.section_num,
                                c.class_name,
                                ts.time_start,
                                ts.time_end,
                                ts.day_of_week,
                                r.building_code,
                                r.room_num,
                                t.faculty_id,
                                f.faculty_first,
                                f.faculty_last
                            FROM
                                meets m
                            INNER JOIN 
                                class c ON m.class_num = c.class_num
                                AND m.dept_code = c.dept_code
                            INNER JOIN 
                                timeslot ts ON m.time_id = ts.time_id
                            INNER JOIN 
                                room r ON m.room_num = r.room_num 
                                AND m.building_code = r.building_code
                            INNER JOIN
                                teaches t ON m.class_num = t.class_num
                                AND m.dept_code = t.dept_code
                            INNER JOIN
                                faculty f ON t.faculty_id = f.faculty_id
        `
        query_db_get(query, res);
    }
});

module.exports = app;
