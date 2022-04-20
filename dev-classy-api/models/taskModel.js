var mysql = require('mysql');
const fs = require('fs');

// Connection to the database team Azure DB
let host = 'classy-schedule-database.mysql.database.azure.com';
let user = 'db_test';
let password = 'fA!6#_&eaU9-EaeJ';
let database = 'cs_dev';
//let database = 'db_dev'; Only use for development Database Team

var config =
{
    host: host, // i.e. 'classy-schedule-database.mysql.database.azure.com',
    user: user, // hidden
    password: password, // hidden
    database: database,
    port: 3306,
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
