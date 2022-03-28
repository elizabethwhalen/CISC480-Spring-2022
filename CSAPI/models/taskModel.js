var mysql = require('mysql');
const fs = require('fs');

// Connection to the database team Azure DB
// Note: Web Dev team, use these connection parameters but instead of
// using the "courses" table, use "class" and "dept" for Monday's tasks.
let host = 'classy-schedule-database.mysql.database.azure.com';
let user = 'db_test';
let password = 'fA!6#_&eaU9-EaeJ';
let database = 'db_dev';
/*
// Local MySQL connection
let host = '127.0.0.1';
let user = 'root';
let password = '';
let database = 'benWebAppTest';
*/

var config =
{
    host: host, // i.e. 'classy-schedule-database.mysql.database.azure.com',
    user: user, // hidden
    password: password, // hidden
    database: database, // i.e. 'ben_web_app_test',
    port: 3306,
    ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
};

const con = new mysql.createConnection(config);

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
  /*let query ="CREATE TABLE IF NOT EXISTS courses (task_id int NOT NULL AUTO_INCREMENT, task VARCHAR(255) NOT NULL, status VARCHAR(255), PRIMARY KEY (task_id))";
  con.query(query, (err, result)=>{
      if (err) throw err;
      console.log(result)
  })*/
  // Don't need to create for our case

});
module.exports = con;
