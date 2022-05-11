let fs = require('fs');
let path = require('path');
let cors = require('cors');
// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');
let public_dir = path.join(__dirname, 'public');
let template_dir = path.join(__dirname, 'templates');
let db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');
let app = express();
app.use(express.json());
app.use(cors());
let port = 8000;
// Open sqlite3 database
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});
// GET /codes
app.get('/codes', (req, res) => {
    // Initial part of sql query
    sqlQuery = 'SELECT * FROM Codes';
    // Specific code(s) was(were) supplied ex: ?code=120,140
    let codes = req.query.code;
    if(codes){
      codeArray = codes.split(",");
      // Add to sql query
      sqlQuery = sqlQuery + " WHERE code = " + codeArray.join(" OR code = ");
    }
    // End of sql query statement
    sqlQuery += " ORDER BY code";
    // Make the database query
    new Promise( (resolve, reject) => {
        db.all(sqlQuery, (err, rows) => {
            if (err) {
                console.log(err); // error somewhere, cannot resolve promise
                reject();
            } else {
                resolve(rows); // rows were received, now resolve
            }
        });
    })
    .then(rows => {
      res.status(200).type('application/json').send(rows);
    }).catch(err => {
      res.status(500).send("Error querying database");
    });
});
// Get /neighborhoods
app.get('/neighborhoods', (req, res) => {
  // Initial part of sql query
  sqlQuery = 'SELECT * FROM Neighborhoods';
  // Specific code(s) was(were) supplied ex: ?id=11,14
  let ids = req.query.id;
  if(ids){
    idArray = ids.split(",");
    // Add to sql query
    sqlQuery = sqlQuery + " WHERE neighborhood_number = " + idArray.join(" OR neighborhood_number = ");
  }
  // End of sql query statement
  sqlQuery += " ORDER BY neighborhood_number";
  // Make the database query
  new Promise( (resolve, reject) => {
      db.all(sqlQuery, (err, rows) => {
          if (err) {
              console.log(err); // error somewhere, cannot resolve promise
              reject();
          } else {
              resolve(rows); // rows were received, now resolve
          }
      });
  })
  .then(rows => {
    res.status(200).type('application/json').send(rows);
  }).catch(err => {
    res.status(500).send("Error querying database");
  });
});
// Get /incidents
app.get('/incidents', (req, res) => {
  // Initial part of sql query
  var sqlQuery = 'SELECT * FROM Incidents';
  var params = [];
  // Specific query (logan and grant)
  //this case_number is not specifically needed, just using for testing purposes
  if(req.query.case_number){
    sqlQuery+= ' WHERE case_number= "'+req.query.case_number+'"';
  }
  if(req.query.neighborhood){
    nieghborhoodArray = req.query.neighborhood.split(",");
    sqlQuery += " WHERE neighborhood_number = " + nieghborhoodArray.join(" OR neighborhood_number = ");
  }
  if(req.query.grid){
    gridArray = req.query.grid.split(",");
    if(req.query.neighborhood){
      sqlQuery += " AND police_grid = " + gridArray.join(" OR police_grid = ");
    }else{
      sqlQuery += " WHERE police_grid = " + gridArray.join(" OR police_grid = ");
    }
  }
  if(req.query.code){
    codeArray = req.query.code.split(",");
    if(req.query.grid || req.query.neighborhood){
      sqlQuery += " AND code = " + codeArray.join(" OR code = ");
    }else{
      sqlQuery += " WHERE code = " + codeArray.join(" OR code = ");
    }
  }
  if(req.query.start_date && req.query.end_date){
    if(req.query.code || req.query.grid || req.query.neighborhood){
      sqlQuery += " AND date_time BETWEEN ? and ?";
      params.push(req.query.start_date);
      params.push(req.query.end_date);
    }else{
      sqlQuery += " WHERE date_time BETWEEN ? and ?";
      params.push(req.query.start_date);
      params.push(req.query.end_date);
    }
  }else if(req.query.end_date){
    if(req.query.code || req.query.grid || req.query.neighborhood){
      sqlQuery += " AND date_time <= ?";
      params.push(req.query.end_date);
    }else{
      sqlQuery += " WHERE date_time <= ?";
      params.push(req.query.end_date);
    }
  }else if(req.query.start_date){
    if(req.query.code || req.query.grid || req.query.neighborhood){
      sqlQuery += " AND date_time >= ?";
      params.push(req.query.start_date);
    }else{
      sqlQuery += " WHERE date_time >= ?" ;
      params.push(req.query.start_date);
    }
  }
  // End of sql query statement
  sqlQuery += " ORDER BY date_time";
  if(req.query.limit){
    sqlQuery += ' LIMIT '+req.query.limit;
  } else {
    sqlQuery += ' LIMIT 1000';
  }
  console.log(sqlQuery);
  // Make the database query
  new Promise( (resolve, reject) => {
      db.all(sqlQuery, params, (err, rows) => {
          if (err) {
              console.log(err); // error somewhere, cannot resolve promise
              reject();
          } else {
              resolve(rows); // rows were received, now resolve
          }
      });
  })
  .then(rows => {
    res.status(200).type('application/json').send(rows);
  }).catch(err => {
    res.status(500).send("Error querying database");
  });
});
// Put /new-incident
app.put('/new-incident', (req, res) =>{
    db.get('SELECT * FROM Incidents WHERE case_number = ?', [req.body.case_number], (err, row)=> {
        if(err || row !== undefined ) {
            res.status(500).type('txt').send('Error, could not insert incident');
        } else {
            db.run('INSERT INTO Incidents (case_number, date_time, code, incident, police_grid, neighborhood_number, block) VALUES(?, ?, ?, ?, ?, ?, ?)',[req.body.case_number, req.body.date_time, req.body.code, req.body.incident, req.body.police_grid, req.body.neighborhoood_number, req.body.block], (err) =>{
              if(err){
                console.log(err);
                res.status(500).type('txt').send('Error, could not insert incident');
              }else{
                res.status(200).type('txt').send('success');
              }
            });
        }
    });
});