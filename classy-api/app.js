//
// Import packages and setup app
//

// Base packages
var express = require('express');
var path = require('path');
var mysql = require('mysql');

// Login and token packages
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')
const secretkey = "secretkey" //CHANGETHIS

// Setup RESTful app
var app = express();

// Response in JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

///
// Database Connection
//

// Determine which schema we are modifying
let schema = "cs_dev" // "db_dev" use for development Database Team

// Connection to the database team Azure DB
var config =
{
    host: 'classy-schedule-database.mysql.database.azure.com',
    user: 'db_test',
    password: 'fA!6#_&eaU9-EaeJ',
    database: schema,
    port: 3306,
};

// Connect to the database
const con = new mysql.createConnection(config);
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the MySQL database!");
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
    console.log(query)
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
    console.log(query, data)
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

//calls

//***BUILDING***
//view
//add
//update
//delete

//***CLASS***
//view
//add
app.post('/v3/class', async (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }
    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}

    //auth validated
    else{
        //check if new dept
        dept_exists = await db_get("SELECT * FROM dept WHERE dept_code="+con.escape(req.body.dept_code))
        console.log(dept_exists)
        if (dept_exists.length==0){return res.status(404).send("Department does not exist")} // could prompt them to add dept maybe??
        let query = "INSERT INTO class (dept_code,class_num,class_name) VALUES ?";
        data = [
            [req.body.dept_code,req.body.class_num,req.body.class_name]
        ]
        console.log("adding")
        try{classAdded = await db_post(query, data)
        } catch(err){
            console.log("ERR: ",err)
            return res.status(400).send("Error encountered");
        } //CHANGETHIS
        console.log("classAdded: ",classAdded)

        //check for features
        if (req.body.features){
            feature_array = req.body.features.split(",")
            for(let i = 0; i < feature_array.length; i++){
                console.log(feature_array[i])
                feature = con.escape(feature_array[i])
                //check if new dept
                try { feature_exists = await db_get("SELECT * FROM feature WHERE feature_name="+feature)
                } catch(err){console.log("uhoh")}
                console.log(feature_exists)
                if (feature_exists.length==0){
                    console.log(feature + " does not exist") //add feature to feature table
                    try {
                        await db_post("INSERT INTO feature VALUES ?", [[undefined,feature_array[i]]])
                        console.log("feature created")
                        try { new_feature = await db_get("SELECT * FROM feature WHERE feature_name="+feature)
                        } catch(err){console.log("uhoh2")}
                        feature_id = new_feature[0].feature_id
                    }catch(err){console.log("feature add failed")}
                }
                else{
                    feature_id = feature_exists[0].feature_id
                }
                try{
                    feature_data = [
                        [req.body.dept_code,req.body.class_num,feature_id]
                    ]
                    await db_post("INSERT INTO class_feature VALUES ?",feature_data)
                }
                catch(err){console.log("oops")}
            
            }
            return res.status(201).send("Class and features added to database")
        }
    }
});
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
//view
//add
//update
//delete

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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
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
            query = query + " building_name = " + con.escape(building_name_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/building', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO building (building_code,building_name) VALUES ?";
        data = [
            [req.body.building_code,req.body.building_name]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/building/:building_code_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE building SET building_code = COALESCE(?,building_code), building_name = COALESCE(?,building_name) WHERE building_code= '+con.escape(req.params.building_code_id)+'';

        data = [
            req.body.building_code,req.body.building_name
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/building/:building_code_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM building WHERE building_code= '+con.escape(req.params.building_code_id)+'';

        query_db_delete(query, res)
    }
});

//***CLASS***
//view
app.get('/v2/class', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
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
            query = query + " class_name = " + con.escape(class_name_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/class', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO class (dept_code,class_num,class_name) VALUES ?";
        data = [
            [req.body.dept_code,req.body.class_num,req.body.class_name]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/class/:dept_code_id/:class_num_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE class SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), class_name = COALESCE(?,class_name) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

        data = [
            req.body.dept_code,req.body.class_num,req.body.class_name
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/class/:dept_code_id/:class_num_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM class WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

        query_db_delete(query, res)
    }
});

//***CLASS_FEATURE***
//view
app.get('/v2/class_feature', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
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
            query = query + " feature_id = " + con.escape(feature_id_array[i]);
        }
        prev = true;
    };
    query_db_get(query, res)
    }

});
//add
app.post('/v2/class_feature', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO class_feature (dept_code,class_num,feature_id) VALUES ?";
        data = [
            [req.body.dept_code,req.body.class_num,req.body.feature_id]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/class_feature/:dept_code_id/:class_num_id/:feature_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE class_feature SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), feature_id = COALESCE(?,feature_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

        data = [
            req.body.dept_code,req.body.class_num,req.body.feature_id
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/class_feature/:dept_code_id/:class_num_id/:feature_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM class_feature WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

        query_db_delete(query, res)
    }
});

//***DEPT***
//view
app.get('/v2/dept', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO dept (dept_code,dept_name) VALUES ?";
        data = [
            [req.body.dept_code,req.body.dept_name]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/dept/:dept_code_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE dept SET dept_code = COALESCE(?,dept_code), dept_name = COALESCE(?,dept_name) WHERE dept_code= '+con.escape(req.params.dept_code_id)+'';

        data = [
            req.body.dept_code,req.body.dept_name
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/dept/:dept_code_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM dept WHERE dept_code= '+con.escape(req.params.dept_code_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY***
//view
app.get('/v2/faculty', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO faculty (faculty_id,faculty_first,faculty_last,title_id,prev_load,curr_load) VALUES ?";
        data = [
            [req.body.faculty_id,req.body.faculty_first,req.body.faculty_last,req.body.title_id,req.body.prev_load,req.body.curr_load]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty/:faculty_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE faculty SET faculty_id = COALESCE(?,faculty_id), faculty_first = COALESCE(?,faculty_first), faculty_last = COALESCE(?,faculty_last), title_id = COALESCE(?,title_id), prev_load = COALESCE(?,prev_load), curr_load = COALESCE(?,curr_load) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+'';

        data = [
            req.body.faculty_id,req.body.faculty_first,req.body.faculty_last,req.body.title_id,req.body.prev_load,req.body.curr_load
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty/:faculty_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM faculty WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY_CLASS***
//view
app.get('/v2/faculty_class', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM faculty_class";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id){
        faculty_id_array = faculty_id.split(",");
        for(let i = 0; i < faculty_id_array.length; i++){
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO faculty_class (faculty_id,dept_code,class_num,pref_level) VALUES ?";
        data = [
            [req.body.faculty_id,req.body.dept_code,req.body.class_num,req.body.pref_level]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty_class/:faculty_id_id/:dept_code_id/:class_num_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE faculty_class SET faculty_id = COALESCE(?,faculty_id), dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

        data = [
            req.body.faculty_id,req.body.dept_code,req.body.class_num,req.body.pref_level
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty_class/:faculty_id_id/:dept_code_id/:class_num_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM faculty_class WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY_FEATURE***
//view
app.get('/v2/faculty_feature', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO faculty_feature (faculty_id,feature_id,pref_level) VALUES ?";
        data = [
            [req.body.faculty_id,req.body.feature_id,req.body.pref_level]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty_feature/:faculty_id_id/:feature_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE faculty_feature SET faculty_id = COALESCE(?,faculty_id), feature_id = COALESCE(?,feature_id), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

        data = [
            req.body.faculty_id,req.body.feature_id,req.body.pref_level
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty_feature/:faculty_id_id/:feature_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM faculty_feature WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY_OTHER_REQUEST***
//view
app.get('/v2/faculty_other_request', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO faculty_other_request (faculty_id,request) VALUES ?";
        data = [
            [req.body.faculty_id,req.body.request]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty_other_request/:faculty_id_id/:request_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE faculty_other_request SET faculty_id = COALESCE(?,faculty_id), request = COALESCE(?,request) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND request= '+con.escape(req.params.request_id)+'';

        data = [
            req.body.faculty_id,req.body.request
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty_other_request/:faculty_id_id/:request_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM faculty_other_request WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND request= '+con.escape(req.params.request_id)+'';

        query_db_delete(query, res)
    }
});

//***FACULTY_TIMESLOT***
//view
app.get('/v2/faculty_timeslot', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO faculty_timeslot (faculty_id,time_id,pref_level) VALUES ?";
        data = [
            [req.body.faculty_id,req.body.time_id,req.body.pref_level]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/faculty_timeslot/:faculty_id_id/:time_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE faculty_timeslot SET faculty_id = COALESCE(?,faculty_id), time_id = COALESCE(?,time_id), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

        data = [
            req.body.faculty_id,req.body.time_id,req.body.pref_level
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/faculty_timeslot/:faculty_id_id/:time_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM faculty_timeslot WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

        query_db_delete(query, res)
    }
});

//***FEATURE***
//view
app.get('/v2/feature', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO feature (feature_id,feature_name) VALUES ?";
        data = [
            [req.body.feature_id,req.body.feature_name]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/feature/:feature_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE feature SET feature_id = COALESCE(?,feature_id), feature_name = COALESCE(?,feature_name) WHERE feature_id= '+con.escape(req.params.feature_id_id)+'';

        data = [
            req.body.feature_id,req.body.feature_name
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/feature/:feature_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM feature WHERE feature_id= '+con.escape(req.params.feature_id_id)+'';

        query_db_delete(query, res)
    }
});

//***LOGIN***
//view
app.get('/v2/login', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = "SELECT * FROM login";

        if(Object.keys(req.query).length > 0){
            query = query + " WHERE"
        }

    //where condition:user_id
    let user_id = req.query.user_id
    if (user_id){
        user_id_array = user_id.split(",");
        for(let i = 0; i < user_id_array.length; i++){
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
//add
app.post('/v2/login/bad', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO login (user_id,pass,faculty_id,access_level) VALUES ?";
        data = [
            [req.body.user_id,req.body.pass,req.body.faculty_id,req.body.access_level]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/login/:user_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE login SET user_id = COALESCE(?,user_id), pass = COALESCE(?,pass), faculty_id = COALESCE(?,faculty_id), access_level = COALESCE(?,access_level) WHERE user_id= '+con.escape(req.params.user_id_id)+'';

        data = [
            req.body.user_id,req.body.pass,req.body.faculty_id,req.body.access_level
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/login/:user_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM login WHERE user_id= '+con.escape(req.params.user_id_id)+'';

        query_db_delete(query, res)
    }
});

//***MEETS***
//view
app.get('/v2/meets', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO meets (dept_code,class_num,section_num,semester,draft,building_code,room_num,time_id) VALUES ?";
        data = [
            [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.building_code,req.body.room_num,req.body.time_id]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/meets/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:building_code_id/:room_num_id/:time_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE meets SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), time_id = COALESCE(?,time_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

        data = [
            req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.building_code,req.body.room_num,req.body.time_id
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/meets/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:building_code_id/:room_num_id/:time_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM meets WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

        query_db_delete(query, res)
    }
});

//***ROOM***
//view
app.get('/v2/room', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO room (building_code,room_num,capacity) VALUES ?";
        data = [
            [req.body.building_code,req.body.room_num,req.body.capacity]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/room/:building_code_id/:room_num_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE room SET building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), capacity = COALESCE(?,capacity) WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+'';

        data = [
            req.body.building_code,req.body.room_num,req.body.capacity
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/room/:building_code_id/:room_num_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM room WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+'';

        query_db_delete(query, res)
    }
});

//***ROOM_FEATURE***
//view
app.get('/v2/room_feature', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO room_feature (building_code,room_num,feature_id) VALUES ?";
        data = [
            [req.body.building_code,req.body.room_num,req.body.feature_id]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/room_feature/:building_code_id/:room_num_id/:feature_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE room_feature SET building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), feature_id = COALESCE(?,feature_id) WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

        data = [
            req.body.building_code,req.body.room_num,req.body.feature_id
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/room_feature/:building_code_id/:room_num_id/:feature_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM room_feature WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

        query_db_delete(query, res)
    }
});

//***SECTION***
//view
app.get('/v2/section', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO section (dept_code,class_num,section_num,semester,draft,capacity) VALUES ?";
        data = [
            [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.capacity]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/section/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE section SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), capacity = COALESCE(?,capacity) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+'';

        data = [
            req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.capacity
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/section/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM section WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+'';

        query_db_delete(query, res)
    }
});

//***TEACHES***
//view
app.get('/v2/teaches', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO teaches (dept_code,class_num,section_num,semester,draft,faculty_id) VALUES ?";
        data = [
            [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.faculty_id]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/teaches/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:faculty_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE teaches SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), faculty_id = COALESCE(?,faculty_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND faculty_id= '+con.escape(req.params.faculty_id_id)+'';

        data = [
            req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.faculty_id
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/teaches/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:faculty_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM teaches WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND faculty_id= '+con.escape(req.params.faculty_id_id)+'';

        query_db_delete(query, res)
    }
});

//***TIMESLOT***
//view
app.get('/v2/timeslot', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO timeslot (time_id,day_of_week,time_start,time_end) VALUES ?";
        data = [
            [req.body.time_id,req.body.day_of_week,req.body.time_start,req.body.time_end]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/timeslot/:time_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE timeslot SET time_id = COALESCE(?,time_id), day_of_week = COALESCE(?,day_of_week), time_start = COALESCE(?,time_start), time_end = COALESCE(?,time_end) WHERE time_id= '+con.escape(req.params.time_id_id)+'';

        data = [
            req.body.time_id,req.body.day_of_week,req.body.time_start,req.body.time_end
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/timeslot/:time_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM timeslot WHERE time_id= '+con.escape(req.params.time_id_id)+'';

        query_db_delete(query, res)
    }
});

//***TITLE***
//view
app.get('/v2/title', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
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
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        console.log(req.body)
        let query = "INSERT INTO title (title_id,title_name,max_load) VALUES ?";
        data = [
            [req.body.title_id,req.body.title_name,req.body.max_load]
        ]

        query_db_add(query, data, res)
    }

});
//update
app.put('/v2/title/:title_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'UPDATE title SET title_id = COALESCE(?,title_id), title_name = COALESCE(?,title_name), max_load = COALESCE(?,max_load) WHERE title_id= '+con.escape(req.params.title_id_id)+'';

        data = [
            req.body.title_id,req.body.title_name,req.body.max_load
        ]

        query_db_put(query, data, res)
    }
});
//delete
app.delete('/v2/title/:title_id_id', (req, res) => {
    // verify auth
    try{
        token = req.headers.authorization.split(" ")[1]
    } catch(e){
        token = req.body.token
    }

    var verifyOutput = verify(token)
    const status=verifyOutput[0]
    const payload=verifyOutput[1]
    if (status != 200){res.status(status).send(payload)}
    else{
        let query = 'DELETE FROM title WHERE title_id= '+con.escape(req.params.title_id_id)+'';

        query_db_delete(query, res)
    }
});


    // query database
function query_db_get(query, res){
    new Promise( (resolve, reject) => {
      con.query(query, (err, result) => {
          if (err) {
            reject();
          } else {
            resolve(result)
          }
      });
    })
    //return json package
    .then(rows => {
      res.status(200).type('application/json').send(rows);
    }).catch(err => {
      res.status(400).send("Bad Request");
    });
}

    // query database
function query_db_add(query, data, res){
    new Promise( (resolve, reject) => {
      con.query(query, [data], (err, result) => {
          if (err) {
            reject();
          } else {
            resolve(result)
          }
      });
    })
    //return json package
    .then(rows => {
      res.status(200).send("Entry added successfully");
    }).catch(err => {
      res.status(400).send("Bad Request");
    });
}

    // query database
function query_db_delete(query, res){
    new Promise( (resolve, reject) => {
      con.query(query, (err, result) => {
          if (err) {
            reject();
          } else {
            resolve(result)
          }
      });
    })
    //return json package
    .then(rows => {
      res.status(200).send("Entry deleted successfully");
    }).catch(err => {
      res.status(400).send("Bad Request");
    });
}

    // query database
function query_db_put(query, data, res){
    new Promise( (resolve, reject) => {
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
      res.status(200).send("Entry updated successfully");
    }).catch(err => {
      res.status(400).send("Bad Request");
    });
}


// ****login****
var MIN_PASSWORD_LENGTH = 8;
var MAX_PASSWORD_LENGTH = 16;
var users = {};

//create users
app.post('/v2/signup', async (req, res) => {

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

const salt = await bcrypt.genSalt(10)
try{ hash = await bcrypt.hash(req.body.password, salt)
} catch (err) {console.log("bcrypt error", err)}
login_query_db_post("insert into login values ?",[[[req.body.username, hash, req.body.faculty_id, access_level=0]]],res)
});

//login
app.post('/v2/login', async function (req, res) {
    var passHashed;
    //if (!req.body) { return res.sendStatus(400); }

    if (!req.body.username || !req.body.password) {
      return res.status(400).send('Missing username or password');
    }

    let loginjson = await get_pass("SELECT * from login where user_id="+con.escape(req.body.username),res);
    passHashed = loginjson[0].pass
    console.log("passHashed")
    if (passHashed === undefined) { return res.sendStatus(401); }
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
      else {res.status(400).send('Incorrect password')}
    });
  });

function login_query_db_post(query, data, res) {
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
function login_query_db(query, res) {
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
  let result = await login_query_db(query,res)
  return result
}
function verify(token){
    console.log(token)
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
            console.log(e)
			return [401,"Unauthorized error"]
		}
		// otherwise, return a bad request error
		return [400,"Bad Request"]
	}
  return [200,payload]
}

// ****v0****
function query_db(query, res) {
  // function to query the database
  new Promise((resolve, reject) => {
      console.log(query)
      con.query(query, (err, result) => {
          if (err) {
              reject();
          } else {
              resolve(result)
          }
      });
  })
      //return json package
      .then(rows => {
          res.status(200).type('application/json').send(rows);
      }).catch(err => {
          // search thru err to figure out what it is
          res.status(500).send("Error querying database");
      });
}

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

//***BUILDING***
//view
app.get('/building', (req, res) => {
  let query = "SELECT * FROM building";
  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      buildings = building_code.split(",")
      for(let i = 0; i < buildings.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "building_code = " + con.escape(buildings[i]);
      }
      prev = true;
  };
  //where condition:building_name
  let building_name = req.query.building_name
  if (building_name){
      if(prev){
          query = query + " AND ";
      }
      building_names = building_name.split(",");
      for(let i = 0; i < building_names.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "building_name = " + con.escape(building_names[i]);
      }
  }
  query_db(query, res);
});

//add
app.post('/building', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO building (building_code,building_name) VALUES ?";
  data = [
      [req.body.building_code,req.body.building_name]
  ]

  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:building_name
  let building_name = req.query.building_name
  if (building_name){
      building_name_split = building_name.split(",");
      // Add to sql query
      query = query + " AND building_name = '" + building_name_split.join("' OR building_name = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/building')
});
//delete
app.delete('/building', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM building";
  query=query+ " WHERE 1=1"

  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:building_name
  let building_name = req.query.building_name
  if (building_name){
      building_name_split = building_name.split(",");
      // Add to sql query
      query = query + " AND building_name = '" + building_name_split.join("' OR building_name = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/building')
});
//update
app.put('/building', (req, res) => {
  console.log(req.body)
  let query = "UPDATE building SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_building_code
  let new_building_code = req.query.new_building_code
  if (new_building_code){
      if (comma==1){query=query+","}
      query = query + " building_code = '" + new_building_code +"'";
      comma=1
  };
  //set condition: new_building_name
  let new_building_name = req.query.new_building_name
  if (new_building_name){
      if (comma==1){query=query+","}
      query = query + " building_name = '" + new_building_name +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:building_name
  let building_name = req.query.building_name
  if (building_name){
      building_name_split = building_name.split(",");
      // Add to sql query
      query = query + " AND building_name = '" + building_name_split.join("' OR building_name = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/building')
});

//***CLASS***
//view
app.get('/class', (req, res) => {
  let query = "SELECT * FROM class";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      for(let i = 0; i < dept_code_split.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "dept_code = " + con.escape(dept_code_split[i]);
      };
      prev = true;
  }
  // where condition: class_num
  let class_num = req.query.class_num
  if (class_num){
      if(prev){
          query = query + " AND ";
      }
      class_nums = class_num.split(",");
      for(let i = 0; i < class_nums.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "class_num = " + con.escape(class_nums[i]);
      };
      prev = true;
  }
  //where condition:class_name
  let class_name = req.query.class_name
  if (class_name){
      if(prev){
          query = query + " AND ";
      }
      class_names = class_num.split(",");
      for(let i = 0; i < class_names.length; i++){
          if(i > 0){
              query = query + " OR ";
          }
          query = query + "class_name = " + con.escape(class_names[i]);
      }
  };
  // query database
  query_db(query, res);

});


//add
app.post('/class', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO class (dept_code,class_num,class_name) VALUES ?";
  data = [
      [req.body.dept_code,req.body.class_num,req.body.class_name]
  ]

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:class_name
  let class_name = req.query.class_name
  if (class_name){
      class_name_split = class_name.split(",");
      // Add to sql query
      query = query + " AND class_name = '" + class_name_split.join("' OR class_name = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/class')
});
//delete
app.delete('/class', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM class";
  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:class_name
  let class_name = req.query.class_name
  if (class_name){
      class_name_split = class_name.split(",");
      // Add to sql query
      query = query + " AND class_name = '" + class_name_split.join("' OR class_name = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/class')
});
//update
app.put('/class', (req, res) => {
  console.log(req.body)
  let query = "UPDATE class SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_dept_code
  let new_dept_code = req.query.new_dept_code
  if (new_dept_code){
      if (comma==1){query=query+","}
      query = query + " dept_code = '" + new_dept_code +"'";
      comma=1
  };
  //set condition: new_class_num
  let new_class_num = req.query.new_class_num
  if (new_class_num){
      if (comma==1){query=query+","}
      query = query + " class_num = '" + new_class_num +"'";
      comma=1
  };
  //set condition: new_class_name
  let new_class_name = req.query.new_class_name
  if (new_class_name){
      if (comma==1){query=query+","}
      query = query + " class_name = '" + new_class_name +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:class_name
  let class_name = req.query.class_name
  if (class_name){
      class_name_split = class_name.split(",");
      // Add to sql query
      query = query + " AND class_name = '" + class_name_split.join("' OR class_name = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/class')
});

//***CLASS_FEATURE***
//view
app.get('/class_feature', (req, res) => {
  let query = "SELECT * FROM class_feature";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      depts = dept_code.split(",")
      for(let i = 0; i < depts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "dept_code = " + con.escape(depts[i]);
      }

      prev = true;
  };
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_nums = class_num.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < class_nums.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "class_num = " + con.escape(class_nums[i]);
      }
      prev = true;
  };
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feats = feature_id.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < feats.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "feature_id = " + con.escape(feats[i]);
      }
      prev = true;
  };
  // query db
  query_db(query, res);
});
//add
app.post('/class_feature', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO class_feature (dept_code,class_num,feature_id) VALUES ?";
  data = [
      [req.body.dept_code,req.body.class_num,req.body.feature_id]
  ]

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/class_feature')
});
//delete
app.delete('/class_feature', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM class_feature";
  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/class_feature')
});
//update
app.put('/class_feature', (req, res) => {
  console.log(req.body)
  let query = "UPDATE class_feature SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_dept_code
  let new_dept_code = req.query.new_dept_code
  if (new_dept_code){
      if (comma==1){query=query+","}
      query = query + " dept_code = '" + new_dept_code +"'";
      comma=1
  };
  //set condition: new_class_num
  let new_class_num = req.query.new_class_num
  if (new_class_num){
      if (comma==1){query=query+","}
      query = query + " class_num = '" + new_class_num +"'";
      comma=1
  };
  //set condition: new_feature_id
  let new_feature_id = req.query.new_feature_id
  if (new_feature_id){
      if (comma==1){query=query+","}
      query = query + " feature_id = '" + new_feature_id +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/class_feature')
});

//***DEPT***
//view
app.get('/dept', (req, res) => {
  let query = "SELECT * FROM dept";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      depts = dept_code.split(",")
      for(let i = 0; i < depts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "dept_code = " + con.escape(depts[i]);
      }
      prev = true;
  };
  //where condition:dept_name
  let dept_name = req.query.dept_name
  if (dept_name){
      dept_names = dept_name.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < dept_names.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "dept_name = " + con.escape(dept_names[i]);
      }
      prev = true;
  };
 query_db(query, res);
});
//add
app.post('/dept', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO dept (dept_code,dept_name) VALUES ?";
  data = [
      [req.body.dept_code,req.body.dept_name]
  ]

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:dept_name
  let dept_name = req.query.dept_name
  if (dept_name){
      dept_name_split = dept_name.split(",");
      // Add to sql query
      query = query + " AND dept_name = '" + dept_name_split.join("' OR dept_name = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/dept')
});
//delete
app.delete('/dept', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM dept";
  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:dept_name
  let dept_name = req.query.dept_name
  if (dept_name){
      dept_name_split = dept_name.split(",");
      // Add to sql query
      query = query + " AND dept_name = '" + dept_name_split.join("' OR dept_name = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/dept')
});
//update
app.put('/dept', (req, res) => {
  console.log(req.body)
  let query = "UPDATE dept SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_dept_code
  let new_dept_code = req.query.new_dept_code
  if (new_dept_code){
      if (comma==1){query=query+","}
      query = query + " dept_code = '" + new_dept_code +"'";
      comma=1
  };
  //set condition: new_dept_name
  let new_dept_name = req.query.new_dept_name
  if (new_dept_name){
      if (comma==1){query=query+","}
      query = query + " dept_name = '" + new_dept_name +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:dept_name
  let dept_name = req.query.dept_name
  if (dept_name){
      dept_name_split = dept_name.split(",");
      // Add to sql query
      query = query + " AND dept_name = '" + dept_name_split.join("' OR dept_name = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/dept')
});

//***FACULTY***
//view
app.get('/faculty', (req, res) => {
  let query = "SELECT * FROM faculty";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty = faculty_id.split(",")
      for(let i = 0; i < faculty.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "faculty_id = " + con.escape(faculty[i]);
      }
      prev = true;
  };
  //where condition:faculty_first
  let faculty_first = req.query.faculty_first
  if (faculty_first){
      if(prev){
          query = query + " AND ";
      }
      firsts = faculty_first.split(",");
      for(let i = 0; i < firsts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "faculty_first = " + con.escape(firsts[i]);
      }
      prev = true;
  }
  //where condition:faculty_last
  let faculty_last = req.query.faculty_last
  if (faculty_last){
      if(prev){
          query = query + " AND ";
      }
      lasts = faculty_last.split(",");
      for(let i = 0; i < lasts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "faculty_last = " + con.escape(lasts[i]);
      }
      prev = true;
  }
  //where condition:title_id
  let title_id = req.query.title_id
  if (title_id){
      if(prev){
          query = query + " AND ";
      }
      titles = title_id.split(",");
      for(let i = 0; i < titles.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "title_id = " + con.escape(titles[i]);
      }
      prev = true;
  }
  //where condition:prev_load
  let prev_load = req.query.prev_load
  if (prev_load){
      if(prev){
          query = query + " AND ";
      }
      prev_load_split = prev_load.split(",");
      for(let i = 0; i < prev_load_split.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "prev_load = " + con.escape(prev_load_split[i]);
      }
      prev = true;
  }
  //where condition:curr_load
  let curr_load = req.query.curr_load
  if (curr_load){
      if(prev){
          query = query + " AND ";
      }
      curr_loads = curr_load.split(",");
      for(let i = 0; i < curr_loads.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "curr_load = " + con.escape(curr_loads[i]);
      }
      prev = true;
  }
  query_db(query, res);
});
//add
app.post('/faculty', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO faculty (faculty_id,faculty_first,faculty_last,title_id,prev_load,curr_load) VALUES ?";
  data = [
      [req.body.faculty_id,req.body.faculty_first,req.body.faculty_last,req.body.title_id,req.body.prev_load,req.body.curr_load]
  ]

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:faculty_first
  let faculty_first = req.query.faculty_first
  if (faculty_first){
      faculty_first_split = faculty_first.split(",");
      // Add to sql query
      query = query + " AND faculty_first = '" + faculty_first_split.join("' OR faculty_first = '")+ "'";}
  //where condition:faculty_last
  let faculty_last = req.query.faculty_last
  if (faculty_last){
      faculty_last_split = faculty_last.split(",");
      // Add to sql query
      query = query + " AND faculty_last = '" + faculty_last_split.join("' OR faculty_last = '")+ "'";}
  //where condition:title_id
  let title_id = req.query.title_id
  if (title_id){
      title_id_split = title_id.split(",");
      // Add to sql query
      query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '")+ "'";}
  //where condition:prev_load
  let prev_load = req.query.prev_load
  if (prev_load){
      prev_load_split = prev_load.split(",");
      // Add to sql query
      query = query + " AND prev_load = '" + prev_load_split.join("' OR prev_load = '")+ "'";}
  //where condition:curr_load
  let curr_load = req.query.curr_load
  if (curr_load){
      curr_load_split = curr_load.split(",");
      // Add to sql query
      query = query + " AND curr_load = '" + curr_load_split.join("' OR curr_load = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty')
});
//delete
app.delete('/faculty', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM faculty";
  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:faculty_first
  let faculty_first = req.query.faculty_first
  if (faculty_first){
      faculty_first_split = faculty_first.split(",");
      // Add to sql query
      query = query + " AND faculty_first = '" + faculty_first_split.join("' OR faculty_first = '")+ "'";}
  //where condition:faculty_last
  let faculty_last = req.query.faculty_last
  if (faculty_last){
      faculty_last_split = faculty_last.split(",");
      // Add to sql query
      query = query + " AND faculty_last = '" + faculty_last_split.join("' OR faculty_last = '")+ "'";}
  //where condition:title_id
  let title_id = req.query.title_id
  if (title_id){
      title_id_split = title_id.split(",");
      // Add to sql query
      query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '")+ "'";}
  //where condition:prev_load
  let prev_load = req.query.prev_load
  if (prev_load){
      prev_load_split = prev_load.split(",");
      // Add to sql query
      query = query + " AND prev_load = '" + prev_load_split.join("' OR prev_load = '")+ "'";}
  //where condition:curr_load
  let curr_load = req.query.curr_load
  if (curr_load){
      curr_load_split = curr_load.split(",");
      // Add to sql query
      query = query + " AND curr_load = '" + curr_load_split.join("' OR curr_load = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty')
});
//update
app.put('/faculty', (req, res) => {
  console.log(req.body)
  let query = "UPDATE faculty SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_faculty_id
  let new_faculty_id = req.query.new_faculty_id
  if (new_faculty_id){
      if (comma==1){query=query+","}
      query = query + " faculty_id = '" + new_faculty_id +"'";
      comma=1
  };
  //set condition: new_faculty_first
  let new_faculty_first = req.query.new_faculty_first
  if (new_faculty_first){
      if (comma==1){query=query+","}
      query = query + " faculty_first = '" + new_faculty_first +"'";
      comma=1
  };
  //set condition: new_faculty_last
  let new_faculty_last = req.query.new_faculty_last
  if (new_faculty_last){
      if (comma==1){query=query+","}
      query = query + " faculty_last = '" + new_faculty_last +"'";
      comma=1
  };
  //set condition: new_title_id
  let new_title_id = req.query.new_title_id
  if (new_title_id){
      if (comma==1){query=query+","}
      query = query + " title_id = '" + new_title_id +"'";
      comma=1
  };
  //set condition: new_prev_load
  let new_prev_load = req.query.new_prev_load
  if (new_prev_load){
      if (comma==1){query=query+","}
      query = query + " prev_load = '" + new_prev_load +"'";
      comma=1
  };
  //set condition: new_curr_load
  let new_curr_load = req.query.new_curr_load
  if (new_curr_load){
      if (comma==1){query=query+","}
      query = query + " curr_load = '" + new_curr_load +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:faculty_first
  let faculty_first = req.query.faculty_first
  if (faculty_first){
      faculty_first_split = faculty_first.split(",");
      // Add to sql query
      query = query + " AND faculty_first = '" + faculty_first_split.join("' OR faculty_first = '")+ "'";}
  //where condition:faculty_last
  let faculty_last = req.query.faculty_last
  if (faculty_last){
      faculty_last_split = faculty_last.split(",");
      // Add to sql query
      query = query + " AND faculty_last = '" + faculty_last_split.join("' OR faculty_last = '")+ "'";}
  //where condition:title_id
  let title_id = req.query.title_id
  if (title_id){
      title_id_split = title_id.split(",");
      // Add to sql query
      query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '")+ "'";}
  //where condition:prev_load
  let prev_load = req.query.prev_load
  if (prev_load){
      prev_load_split = prev_load.split(",");
      // Add to sql query
      query = query + " AND prev_load = '" + prev_load_split.join("' OR prev_load = '")+ "'";}
  //where condition:curr_load
  let curr_load = req.query.curr_load
  if (curr_load){
      curr_load_split = curr_load.split(",");
      // Add to sql query
      query = query + " AND curr_load = '" + curr_load_split.join("' OR curr_load = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty')
});

//***FACULTY_CLASS***
//view
app.get('/faculty_class', (req, res) => {
  let query = "SELECT * FROM faculty_class";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty = faculty_id.split(",")
      for(let i = 0; i < faculty.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "faculty_id = " + con.escape(faculty[i]);
      }
      prev = true;
  };

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      depts = dept_code.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < depts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "dept_code = " + con.escape(depts[i]);
      }
      prev = true;
  };
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      classes = class_num.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < classes.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "class_num = " + con.escape(classes[i]);
      }
      prev = true;
  };
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      prefs = pref_level.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < prefs.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "pref_level = " + con.escape(prefs[i]);
      }
      prev = true;
  };
  query_db(query, res);
});
//add
app.post('/faculty_class', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO faculty_class (faculty_id,dept_code,class_num,pref_level) VALUES ?";
  data = [
      [req.body.faculty_id,req.body.dept_code,req.body.class_num,req.body.pref_level]
  ]

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      pref_level_split = pref_level.split(",");
      // Add to sql query
      query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_class')
});
//delete
app.delete('/faculty_class', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM faculty_class";
  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      pref_level_split = pref_level.split(",");
      // Add to sql query
      query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_class')
});
//update
app.put('/faculty_class', (req, res) => {
  console.log(req.body)
  let query = "UPDATE faculty_class SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_faculty_id
  let new_faculty_id = req.query.new_faculty_id
  if (new_faculty_id){
      if (comma==1){query=query+","}
      query = query + " faculty_id = '" + new_faculty_id +"'";
      comma=1
  };
  //set condition: new_dept_code
  let new_dept_code = req.query.new_dept_code
  if (new_dept_code){
      if (comma==1){query=query+","}
      query = query + " dept_code = '" + new_dept_code +"'";
      comma=1
  };
  //set condition: new_class_num
  let new_class_num = req.query.new_class_num
  if (new_class_num){
      if (comma==1){query=query+","}
      query = query + " class_num = '" + new_class_num +"'";
      comma=1
  };
  //set condition: new_pref_level
  let new_pref_level = req.query.new_pref_level
  if (new_pref_level){
      if (comma==1){query=query+","}
      query = query + " pref_level = '" + new_pref_level +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      pref_level_split = pref_level.split(",");
      // Add to sql query
      query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_class')
});

//***FACULTY_FEATURE***
//view
app.get('/faculty_feature', (req, res) => {
  let query = "SELECT * FROM faculty_feature";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty = faculty_id.split(",")
      for(let i = 0; i < faculty.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "faculty_id = " + con.escape(faculty[i]);
      }
      prev = true;
  };
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feats = feature_id.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < feats.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "feature_id = " + con.escape(feats[i]);
      }
      prev = true;
  };
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      prefs = pref_level.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < prefs.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "pref_level = " + con.escape(prefs[i]);
      }
      prev = true;
  };
  query_db(query, res);
});
//add
app.post('/faculty_feature', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO faculty_feature (faculty_id,feature_id,pref_level) VALUES ?";
  data = [
      [req.body.faculty_id,req.body.feature_id,req.body.pref_level]
  ]

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      pref_level_split = pref_level.split(",");
      // Add to sql query
      query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_feature')
});
//delete
app.delete('/faculty_feature', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM faculty_feature";
  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      pref_level_split = pref_level.split(",");
      // Add to sql query
      query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_feature')
});
//update
app.put('/faculty_feature', (req, res) => {
  console.log(req.body)
  let query = "UPDATE faculty_feature SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_faculty_id
  let new_faculty_id = req.query.new_faculty_id
  if (new_faculty_id){
      if (comma==1){query=query+","}
      query = query + " faculty_id = '" + new_faculty_id +"'";
      comma=1
  };
  //set condition: new_feature_id
  let new_feature_id = req.query.new_feature_id
  if (new_feature_id){
      if (comma==1){query=query+","}
      query = query + " feature_id = '" + new_feature_id +"'";
      comma=1
  };
  //set condition: new_pref_level
  let new_pref_level = req.query.new_pref_level
  if (new_pref_level){
      if (comma==1){query=query+","}
      query = query + " pref_level = '" + new_pref_level +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      pref_level_split = pref_level.split(",");
      // Add to sql query
      query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_feature')
});

//***FACULTY_OTHER_REQUEST***
//view
app.get('/faculty_other_request', (req, res) => {
  let query = "SELECT * FROM faculty_other_request";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty = faculty_id.split(",")
      for(let i = 0; i < faculty.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "faculty_id = " + con.escape(faculty[i]);
      }
      prev = true;
  };
  //where condition:request
  let request = req.query.request
  if (request){
      requests = request.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < requests.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "feature_id = " + con.escape(requests[i]);
      }
      prev = true;
  };
  // query database
  query_db(query, res);
});
//add
app.post('/faculty_other_request', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO faculty_other_request (faculty_id,request) VALUES ?";
  data = [
      [req.body.faculty_id,req.body.request]
  ]

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:request
  let request = req.query.request
  if (request){
      request_split = request.split(",");
      // Add to sql query
      query = query + " AND request = '" + request_split.join("' OR request = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_other_request')
});
//delete
app.delete('/faculty_other_request', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM faculty_other_request";
  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:request
  let request = req.query.request
  if (request){
      request_split = request.split(",");
      // Add to sql query
      query = query + " AND request = '" + request_split.join("' OR request = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_other_request')
});
//update
app.put('/faculty_other_request', (req, res) => {
  console.log(req.body)
  let query = "UPDATE faculty_other_request SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_faculty_id
  let new_faculty_id = req.query.new_faculty_id
  if (new_faculty_id){
      if (comma==1){query=query+","}
      query = query + " faculty_id = '" + new_faculty_id +"'";
      comma=1
  };
  //set condition: new_request
  let new_request = req.query.new_request
  if (new_request){
      if (comma==1){query=query+","}
      query = query + " request = '" + new_request +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:request
  let request = req.query.request
  if (request){
      request_split = request.split(",");
      // Add to sql query
      query = query + " AND request = '" + request_split.join("' OR request = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_other_request')
});

//***FACULTY_TIMESLOT***
//view
app.get('/faculty_timeslot', (req, res) => {
  let query = "SELECT * FROM faculty_timeslot";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty = faculty_id.split(",")
      for(let i = 0; i < faculty.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "faculty_id = " + con.escape(faculty[i]);
      }
      prev = true;
  };
  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      times = time_id.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < times.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "time_id = " + con.escape(times[i]);
      }
      prev = true;
  };
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      levels = pref_level.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < levels.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "time_id = " + con.escape(levels[i]);
      }
      prev = true;
  };
  // query database
  query_db(query, res);
});
//add
app.post('/faculty_timeslot', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO faculty_timeslot (faculty_id,time_id,pref_level) VALUES ?";
  data = [
      [req.body.faculty_id,req.body.time_id,req.body.pref_level]
  ]

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      time_id_split = time_id.split(",");
      // Add to sql query
      query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '")+ "'";}
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      pref_level_split = pref_level.split(",");
      // Add to sql query
      query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_timeslot')
});
//delete
app.delete('/faculty_timeslot', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM faculty_timeslot";
  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      time_id_split = time_id.split(",");
      // Add to sql query
      query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '")+ "'";}
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      pref_level_split = pref_level.split(",");
      // Add to sql query
      query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_timeslot')
});
//update
app.put('/faculty_timeslot', (req, res) => {
  console.log(req.body)
  let query = "UPDATE faculty_timeslot SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_faculty_id
  let new_faculty_id = req.query.new_faculty_id
  if (new_faculty_id){
      if (comma==1){query=query+","}
      query = query + " faculty_id = '" + new_faculty_id +"'";
      comma=1
  };
  //set condition: new_time_id
  let new_time_id = req.query.new_time_id
  if (new_time_id){
      if (comma==1){query=query+","}
      query = query + " time_id = '" + new_time_id +"'";
      comma=1
  };
  //set condition: new_pref_level
  let new_pref_level = req.query.new_pref_level
  if (new_pref_level){
      if (comma==1){query=query+","}
      query = query + " pref_level = '" + new_pref_level +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      time_id_split = time_id.split(",");
      // Add to sql query
      query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '")+ "'";}
  //where condition:pref_level
  let pref_level = req.query.pref_level
  if (pref_level){
      pref_level_split = pref_level.split(",");
      // Add to sql query
      query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/faculty_timeslot')
});

//***FEATURE***
//view
app.get('/feature', (req, res) => {
  let query = "SELECT * FROM feature";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feats = feature_id.split(",")
      for(let i = 0; i < feats.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "feature_id = " + con.escape(feats[i]);
      }
      prev = true;
  };
  //where condition:feature_name
  let feature_name = req.query.feature_name
  if (feature_name){
      if(prev){
          query = query + " AND ";
      }
      feat_names = feature_name.split(",");
      for(let i = 0; i < feat_names.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "feature_name = " + con.escape(feat_names[i]);
      }
  }
  query_db(query, res);
});
//add
app.post('/feature', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO feature (feature_id,feature_name) VALUES ?";
  data = [
      [req.body.feature_id,req.body.feature_name]
  ]

  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  //where condition:feature_name
  let feature_name = req.query.feature_name
  if (feature_name){
      feature_name_split = feature_name.split(",");
      // Add to sql query
      query = query + " AND feature_name = '" + feature_name_split.join("' OR feature_name = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/feature')
});
//delete
app.delete('/feature', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM feature";
  query=query+ " WHERE 1=1"

  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  //where condition:feature_name
  let feature_name = req.query.feature_name
  if (feature_name){
      feature_name_split = feature_name.split(",");
      // Add to sql query
      query = query + " AND feature_name = '" + feature_name_split.join("' OR feature_name = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/feature')
});
//update
app.put('/feature', (req, res) => {
  console.log(req.body)
  let query = "UPDATE feature SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_feature_id
  let new_feature_id = req.query.new_feature_id
  if (new_feature_id){
      if (comma==1){query=query+","}
      query = query + " feature_id = '" + new_feature_id +"'";
      comma=1
  };
  //set condition: new_feature_name
  let new_feature_name = req.query.new_feature_name
  if (new_feature_name){
      if (comma==1){query=query+","}
      query = query + " feature_name = '" + new_feature_name +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  //where condition:feature_name
  let feature_name = req.query.feature_name
  if (feature_name){
      feature_name_split = feature_name.split(",");
      // Add to sql query
      query = query + " AND feature_name = '" + feature_name_split.join("' OR feature_name = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/feature')
});

//***LOGIN***
//view
app.get('/login', (req, res) => {
  let query = "SELECT * FROM login";

  query = query + " WHERE 1=1"

  //where condition:user_id
  let user_id = req.query.user_id
  if (user_id){
      user_id_split = user_id.split(",");
      // Add to sql query
      query = query + " AND user_id = '" + user_id_split.join("' OR user_id = '")+ "'";}
  //where condition:pass
  let pass = req.query.pass
  if (pass){
      pass_split = pass.split(",");
      // Add to sql query
      query = query + " AND pass = '" + pass_split.join("' OR pass = '")+ "'";}
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:access_level
  let access_level = req.query.access_level
  if (access_level){
      access_level_split = access_level.split(",");
      // Add to sql query
      query = query + " AND access_level = '" + access_level_split.join("' OR access_level = '")+ "'";}

  // query database
  new Promise( (resolve, reject) => {
    con.query(query, (err, result) => {
        if (err) {
          reject();
        } else {
          resolve(result)
        }
    });
  })
  //return json package
  .then(rows => {
    res.status(200).type('application/json').send(rows);
  }).catch(err => {
    res.status(500).send("Error querying database");
  });
});
//add
app.post('/login', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO login (user_id,pass,faculty_id,access_level) VALUES ?";
  data = [
      [req.body.user_id,req.body.pass,req.body.faculty_id,req.body.access_level]
  ]

  //where condition:user_id
  let user_id = req.query.user_id
  if (user_id){
      user_id_split = user_id.split(",");
      // Add to sql query
      query = query + " AND user_id = '" + user_id_split.join("' OR user_id = '")+ "'";}
  //where condition:pass
  let pass = req.query.pass
  if (pass){
      pass_split = pass.split(",");
      // Add to sql query
      query = query + " AND pass = '" + pass_split.join("' OR pass = '")+ "'";}
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:access_level
  let access_level = req.query.access_level
  if (access_level){
      access_level_split = access_level.split(",");
      // Add to sql query
      query = query + " AND access_level = '" + access_level_split.join("' OR access_level = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/login')
});
//delete
app.delete('/login', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM login";
  query=query+ " WHERE 1=1"

  //where condition:user_id
  let user_id = req.query.user_id
  if (user_id){
      user_id_split = user_id.split(",");
      // Add to sql query
      query = query + " AND user_id = '" + user_id_split.join("' OR user_id = '")+ "'";}
  //where condition:pass
  let pass = req.query.pass
  if (pass){
      pass_split = pass.split(",");
      // Add to sql query
      query = query + " AND pass = '" + pass_split.join("' OR pass = '")+ "'";}
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:access_level
  let access_level = req.query.access_level
  if (access_level){
      access_level_split = access_level.split(",");
      // Add to sql query
      query = query + " AND access_level = '" + access_level_split.join("' OR access_level = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/login')
});
//update
app.put('/login', (req, res) => {
  console.log(req.body)
  let query = "UPDATE login SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_user_id
  let new_user_id = req.query.new_user_id
  if (new_user_id){
      if (comma==1){query=query+","}
      query = query + " user_id = '" + new_user_id +"'";
      comma=1
  };
  //set condition: new_pass
  let new_pass = req.query.new_pass
  if (new_pass){
      if (comma==1){query=query+","}
      query = query + " pass = '" + new_pass +"'";
      comma=1
  };
  //set condition: new_faculty_id
  let new_faculty_id = req.query.new_faculty_id
  if (new_faculty_id){
      if (comma==1){query=query+","}
      query = query + " faculty_id = '" + new_faculty_id +"'";
      comma=1
  };
  //set condition: new_access_level
  let new_access_level = req.query.new_access_level
  if (new_access_level){
      if (comma==1){query=query+","}
      query = query + " access_level = '" + new_access_level +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:user_id
  let user_id = req.query.user_id
  if (user_id){
      user_id_split = user_id.split(",");
      // Add to sql query
      query = query + " AND user_id = '" + user_id_split.join("' OR user_id = '")+ "'";}
  //where condition:pass
  let pass = req.query.pass
  if (pass){
      pass_split = pass.split(",");
      // Add to sql query
      query = query + " AND pass = '" + pass_split.join("' OR pass = '")+ "'";}
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  //where condition:access_level
  let access_level = req.query.access_level
  if (access_level){
      access_level_split = access_level.split(",");
      // Add to sql query
      query = query + " AND access_level = '" + access_level_split.join("' OR access_level = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/login')
});

//***MEETS***
//view
app.get('/meets', (req, res) => {
  let query = "SELECT * FROM meets";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      depts = dept_code.split(",")
      for(let i = 0; i < depts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "dept_code = " + con.escape(depts[i]);
      }
      prev = true;
  };
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      classes = class_num.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < classes.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "class_num = " + con.escape(classes[i]);
      }
      prev = true;
  };
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      sections = section_num.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < sections.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "section_num = " + con.escape(sections[i]);
      }
      prev = true;
  };
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      sems = semester.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < sems.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "semsester = " + con.escape(sems[i]);
      }
      prev = true;
  };
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      drafts = draft.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < drafts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "draft = " + con.escape(drafts[i]);
      }
      prev = true;
  };
  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      buildings = building_code.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < buildings.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "building_code = " + con.escape(buildings[i]);
      }
      prev = true;
  };
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      rooms = room_num.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < rooms.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "room_num = " + con.escape(rooms[i]);
      }
      prev = true;
  };
  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      times = time_id.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < times.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "time_id = " + con.escape(times[i]);
      }
      prev = true;
  };
  // query database
  query_db(query, res);
});
//add
app.post('/meets', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO meets (dept_code,class_num,section_num,semester,draft,building_code,room_num,time_id) VALUES ?";
  data = [
      [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.building_code,req.body.room_num,req.body.time_id]
  ]

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      section_num_split = section_num.split(",");
      // Add to sql query
      query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '")+ "'";}
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      semester_split = semester.split(",");
      // Add to sql query
      query = query + " AND semester = '" + semester_split.join("' OR semester = '")+ "'";}
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      draft_split = draft.split(",");
      // Add to sql query
      query = query + " AND draft = '" + draft_split.join("' OR draft = '")+ "'";}
  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      room_num_split = room_num.split(",");
      // Add to sql query
      query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '")+ "'";}
  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      time_id_split = time_id.split(",");
      // Add to sql query
      query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/meets')
});
//delete
app.delete('/meets', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM meets";
  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      section_num_split = section_num.split(",");
      // Add to sql query
      query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '")+ "'";}
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      semester_split = semester.split(",");
      // Add to sql query
      query = query + " AND semester = '" + semester_split.join("' OR semester = '")+ "'";}
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      draft_split = draft.split(",");
      // Add to sql query
      query = query + " AND draft = '" + draft_split.join("' OR draft = '")+ "'";}
  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      room_num_split = room_num.split(",");
      // Add to sql query
      query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '")+ "'";}
  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      time_id_split = time_id.split(",");
      // Add to sql query
      query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/meets')
});
//update
app.put('/meets', (req, res) => {
  console.log(req.body)
  let query = "UPDATE meets SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_dept_code
  let new_dept_code = req.query.new_dept_code
  if (new_dept_code){
      if (comma==1){query=query+","}
      query = query + " dept_code = '" + new_dept_code +"'";
      comma=1
  };
  //set condition: new_class_num
  let new_class_num = req.query.new_class_num
  if (new_class_num){
      if (comma==1){query=query+","}
      query = query + " class_num = '" + new_class_num +"'";
      comma=1
  };
  //set condition: new_section_num
  let new_section_num = req.query.new_section_num
  if (new_section_num){
      if (comma==1){query=query+","}
      query = query + " section_num = '" + new_section_num +"'";
      comma=1
  };
  //set condition: new_semester
  let new_semester = req.query.new_semester
  if (new_semester){
      if (comma==1){query=query+","}
      query = query + " semester = '" + new_semester +"'";
      comma=1
  };
  //set condition: new_draft
  let new_draft = req.query.new_draft
  if (new_draft){
      if (comma==1){query=query+","}
      query = query + " draft = '" + new_draft +"'";
      comma=1
  };
  //set condition: new_building_code
  let new_building_code = req.query.new_building_code
  if (new_building_code){
      if (comma==1){query=query+","}
      query = query + " building_code = '" + new_building_code +"'";
      comma=1
  };
  //set condition: new_room_num
  let new_room_num = req.query.new_room_num
  if (new_room_num){
      if (comma==1){query=query+","}
      query = query + " room_num = '" + new_room_num +"'";
      comma=1
  };
  //set condition: new_time_id
  let new_time_id = req.query.new_time_id
  if (new_time_id){
      if (comma==1){query=query+","}
      query = query + " time_id = '" + new_time_id +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      section_num_split = section_num.split(",");
      // Add to sql query
      query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '")+ "'";}
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      semester_split = semester.split(",");
      // Add to sql query
      query = query + " AND semester = '" + semester_split.join("' OR semester = '")+ "'";}
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      draft_split = draft.split(",");
      // Add to sql query
      query = query + " AND draft = '" + draft_split.join("' OR draft = '")+ "'";}
  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      room_num_split = room_num.split(",");
      // Add to sql query
      query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '")+ "'";}
  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      time_id_split = time_id.split(",");
      // Add to sql query
      query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/meets')
});

//***ROOM***
//view
app.get('/room', (req, res) => {
  let query = "SELECT * FROM room";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      buildings = building_code.split(",")
      for(let i = 0; i < buildings.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "building_code = " + con.escape(buildings[i]);
      }
      prev = true;
  };
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      if(prev){
          query = query + " AND ";
      }
      rooms = room_num.split(",");
      for(let i = 0; i < rooms.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "room_num = " + con.escape(rooms[i]);
      }
  }
  //where condition:capacity
  let capacity = req.query.capacity
  if (capacity){
      if(prev){
          query = query + " AND ";
      }
      capacities = capacity.split(",");
      for(let i = 0; i < capacities.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "capacity = " + con.escape(capacities[i]);
      }
  }

  query_db(query, res);
});
//add
app.post('/room', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO room (building_code,room_num,capacity) VALUES ?";
  data = [
      [req.body.building_code,req.body.room_num,req.body.capacity]
  ]

  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      room_num_split = room_num.split(",");
      // Add to sql query
      query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '")+ "'";}
  //where condition:capacity
  let capacity = req.query.capacity
  if (capacity){
      capacity_split = capacity.split(",");
      // Add to sql query
      query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/room')
});
//delete
app.delete('/room', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM room";
  query=query+ " WHERE 1=1"

  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      room_num_split = room_num.split(",");
      // Add to sql query
      query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '")+ "'";}
  //where condition:capacity
  let capacity = req.query.capacity
  if (capacity){
      capacity_split = capacity.split(",");
      // Add to sql query
      query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/room')
});
//update
app.put('/room', (req, res) => {
  console.log(req.body)
  let query = "UPDATE room SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_building_code
  let new_building_code = req.query.new_building_code
  if (new_building_code){
      if (comma==1){query=query+","}
      query = query + " building_code = '" + new_building_code +"'";
      comma=1
  };
  //set condition: new_room_num
  let new_room_num = req.query.new_room_num
  if (new_room_num){
      if (comma==1){query=query+","}
      query = query + " room_num = '" + new_room_num +"'";
      comma=1
  };
  //set condition: new_capacity
  let new_capacity = req.query.new_capacity
  if (new_capacity){
      if (comma==1){query=query+","}
      query = query + " capacity = '" + new_capacity +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      room_num_split = room_num.split(",");
      // Add to sql query
      query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '")+ "'";}
  //where condition:capacity
  let capacity = req.query.capacity
  if (capacity){
      capacity_split = capacity.split(",");
      // Add to sql query
      query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/room')
});

//***ROOM_FEATURE***
//view
app.get('/room_feature', (req, res) => {
  let query = "SELECT * FROM room_feature";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      buildings = building_code.split(",")
      for(let i = 0; i < buildings.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "building_code = " + con.escape(buildings[i]);
      }
      prev = true;
  };
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      if(prev){
          query = query + " AND ";
      }
      rooms = room_num.split(",");
      for(let i = 0; i < rooms.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "room_num = " + con.escape(rooms[i]);
      }
  }
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      if(prev){
          query = query + " AND ";
      }
      feats = feature_id.split(",");
      for(let i = 0; i < feats.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "feature_id = " + con.escape(feats[i]);
      }
  }
  // query database
  query_db(query, res);
});
//add
app.post('/room_feature', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO room_feature (building_code,room_num,feature_id) VALUES ?";
  data = [
      [req.body.building_code,req.body.room_num,req.body.feature_id]
  ]

  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      room_num_split = room_num.split(",");
      // Add to sql query
      query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '")+ "'";}
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/room_feature')
});
//delete
app.delete('/room_feature', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM room_feature";
  query=query+ " WHERE 1=1"

  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      room_num_split = room_num.split(",");
      // Add to sql query
      query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '")+ "'";}
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/room_feature')
});
//update
app.put('/room_feature', (req, res) => {
  console.log(req.body)
  let query = "UPDATE room_feature SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_building_code
  let new_building_code = req.query.new_building_code
  if (new_building_code){
      if (comma==1){query=query+","}
      query = query + " building_code = '" + new_building_code +"'";
      comma=1
  };
  //set condition: new_room_num
  let new_room_num = req.query.new_room_num
  if (new_room_num){
      if (comma==1){query=query+","}
      query = query + " room_num = '" + new_room_num +"'";
      comma=1
  };
  //set condition: new_feature_id
  let new_feature_id = req.query.new_feature_id
  if (new_feature_id){
      if (comma==1){query=query+","}
      query = query + " feature_id = '" + new_feature_id +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:building_code
  let building_code = req.query.building_code
  if (building_code){
      building_code_split = building_code.split(",");
      // Add to sql query
      query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '")+ "'";}
  //where condition:room_num
  let room_num = req.query.room_num
  if (room_num){
      room_num_split = room_num.split(",");
      // Add to sql query
      query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '")+ "'";}
  //where condition:feature_id
  let feature_id = req.query.feature_id
  if (feature_id){
      feature_id_split = feature_id.split(",");
      // Add to sql query
      query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/room_feature')
});

//***SECTION***
//view
app.get('/section', (req, res) => {
  let query = "SELECT * FROM section";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      depts = dept_code.split(",")
      for(let i = 0; i < depts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "dept_code = " + con.escape(depts[i]);
      }
      prev = true;
  };
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      classes = class_num.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < classes.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "class_num = " + con.escape(classes[i]);
      }
      prev = true;
  };
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      sections = section_num.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < sections.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "section_num = " + con.escape(sections[i]);
      }
      prev = true;
  };
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      sems = semester.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < sems.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "semsester = " + con.escape(sems[i]);
      }
      prev = true;
  };
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      drafts = draft.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < drafts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "draft = " + con.escape(drafts[i]);
      }
      prev = true;
  };
  //where condition:capacity
  if (capacity){
      if(prev){
          query = query + " AND ";
      }
      capacities = capacity.split(",");
      for(let i = 0; i < capacities.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "capacity = " + con.escape(capacities[i]);
      }
  }
  // query database
  query_db(query, res);
});
//add
app.post('/section', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO section (dept_code,class_num,section_num,semester,draft,capacity) VALUES ?";
  data = [
      [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.capacity]
  ]

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      section_num_split = section_num.split(",");
      // Add to sql query
      query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '")+ "'";}
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      semester_split = semester.split(",");
      // Add to sql query
      query = query + " AND semester = '" + semester_split.join("' OR semester = '")+ "'";}
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      draft_split = draft.split(",");
      // Add to sql query
      query = query + " AND draft = '" + draft_split.join("' OR draft = '")+ "'";}
  //where condition:capacity
  let capacity = req.query.capacity
  if (capacity){
      capacity_split = capacity.split(",");
      // Add to sql query
      query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/section')
});
//delete
app.delete('/section', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM section";
  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      section_num_split = section_num.split(",");
      // Add to sql query
      query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '")+ "'";}
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      semester_split = semester.split(",");
      // Add to sql query
      query = query + " AND semester = '" + semester_split.join("' OR semester = '")+ "'";}
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      draft_split = draft.split(",");
      // Add to sql query
      query = query + " AND draft = '" + draft_split.join("' OR draft = '")+ "'";}
  //where condition:capacity
  let capacity = req.query.capacity
  if (capacity){
      capacity_split = capacity.split(",");
      // Add to sql query
      query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/section')
});
//update
app.put('/section', (req, res) => {
  console.log(req.body)
  let query = "UPDATE section SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_dept_code
  let new_dept_code = req.query.new_dept_code
  if (new_dept_code){
      if (comma==1){query=query+","}
      query = query + " dept_code = '" + new_dept_code +"'";
      comma=1
  };
  //set condition: new_class_num
  let new_class_num = req.query.new_class_num
  if (new_class_num){
      if (comma==1){query=query+","}
      query = query + " class_num = '" + new_class_num +"'";
      comma=1
  };
  //set condition: new_section_num
  let new_section_num = req.query.new_section_num
  if (new_section_num){
      if (comma==1){query=query+","}
      query = query + " section_num = '" + new_section_num +"'";
      comma=1
  };
  //set condition: new_semester
  let new_semester = req.query.new_semester
  if (new_semester){
      if (comma==1){query=query+","}
      query = query + " semester = '" + new_semester +"'";
      comma=1
  };
  //set condition: new_draft
  let new_draft = req.query.new_draft
  if (new_draft){
      if (comma==1){query=query+","}
      query = query + " draft = '" + new_draft +"'";
      comma=1
  };
  //set condition: new_capacity
  let new_capacity = req.query.new_capacity
  if (new_capacity){
      if (comma==1){query=query+","}
      query = query + " capacity = '" + new_capacity +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      section_num_split = section_num.split(",");
      // Add to sql query
      query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '")+ "'";}
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      semester_split = semester.split(",");
      // Add to sql query
      query = query + " AND semester = '" + semester_split.join("' OR semester = '")+ "'";}
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      draft_split = draft.split(",");
      // Add to sql query
      query = query + " AND draft = '" + draft_split.join("' OR draft = '")+ "'";}
  //where condition:capacity
  let capacity = req.query.capacity
  if (capacity){
      capacity_split = capacity.split(",");
      // Add to sql query
      query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/section')
});

//***TEACHES***
//view
app.get('/teaches', (req, res) => {
  let query = "SELECT * FROM teaches";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      depts = dept_code.split(",")
      for(let i = 0; i < depts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "dept_code = " + con.escape(depts[i]);
      }
      prev = true;
  };
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      classes = class_num.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < classes.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "class_num = " + con.escape(classes[i]);
      }
      prev = true;
  };
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      sections = section_num.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < sections.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "section_num = " + con.escape(sections[i]);
      }
      prev = true;
  };
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      sems = semester.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < sems.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "semsester = " + con.escape(sems[i]);
      }
      prev = true;
  };
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      drafts = draft.split(",")
      if(prev){
          query = query + " AND "
      }
      for(let i = 0; i < drafts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "draft = " + con.escape(drafts[i]);
      }
      prev = true;
  };
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty = faculty_id.split(",")
      for(let i = 0; i < faculty.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "faculty_id = " + con.escape(faculty[i]);
      }
      prev = true;
  };
  // query database
  query_db(query, res);
});
//add
app.post('/teaches', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO teaches (dept_code,class_num,section_num,semester,draft,faculty_id) VALUES ?";
  data = [
      [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.faculty_id]
  ]

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      section_num_split = section_num.split(",");
      // Add to sql query
      query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '")+ "'";}
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      semester_split = semester.split(",");
      // Add to sql query
      query = query + " AND semester = '" + semester_split.join("' OR semester = '")+ "'";}
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      draft_split = draft.split(",");
      // Add to sql query
      query = query + " AND draft = '" + draft_split.join("' OR draft = '")+ "'";}
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/teaches')
});
//delete
app.delete('/teaches', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM teaches";
  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      section_num_split = section_num.split(",");
      // Add to sql query
      query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '")+ "'";}
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      semester_split = semester.split(",");
      // Add to sql query
      query = query + " AND semester = '" + semester_split.join("' OR semester = '")+ "'";}
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      draft_split = draft.split(",");
      // Add to sql query
      query = query + " AND draft = '" + draft_split.join("' OR draft = '")+ "'";}
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/teaches')
});
//update
app.put('/teaches', (req, res) => {
  console.log(req.body)
  let query = "UPDATE teaches SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_dept_code
  let new_dept_code = req.query.new_dept_code
  if (new_dept_code){
      if (comma==1){query=query+","}
      query = query + " dept_code = '" + new_dept_code +"'";
      comma=1
  };
  //set condition: new_class_num
  let new_class_num = req.query.new_class_num
  if (new_class_num){
      if (comma==1){query=query+","}
      query = query + " class_num = '" + new_class_num +"'";
      comma=1
  };
  //set condition: new_section_num
  let new_section_num = req.query.new_section_num
  if (new_section_num){
      if (comma==1){query=query+","}
      query = query + " section_num = '" + new_section_num +"'";
      comma=1
  };
  //set condition: new_semester
  let new_semester = req.query.new_semester
  if (new_semester){
      if (comma==1){query=query+","}
      query = query + " semester = '" + new_semester +"'";
      comma=1
  };
  //set condition: new_draft
  let new_draft = req.query.new_draft
  if (new_draft){
      if (comma==1){query=query+","}
      query = query + " draft = '" + new_draft +"'";
      comma=1
  };
  //set condition: new_faculty_id
  let new_faculty_id = req.query.new_faculty_id
  if (new_faculty_id){
      if (comma==1){query=query+","}
      query = query + " faculty_id = '" + new_faculty_id +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:dept_code
  let dept_code = req.query.dept_code
  if (dept_code){
      dept_code_split = dept_code.split(",");
      // Add to sql query
      query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '")+ "'";}
  //where condition:class_num
  let class_num = req.query.class_num
  if (class_num){
      class_num_split = class_num.split(",");
      // Add to sql query
      query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '")+ "'";}
  //where condition:section_num
  let section_num = req.query.section_num
  if (section_num){
      section_num_split = section_num.split(",");
      // Add to sql query
      query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '")+ "'";}
  //where condition:semester
  let semester = req.query.semester
  if (semester){
      semester_split = semester.split(",");
      // Add to sql query
      query = query + " AND semester = '" + semester_split.join("' OR semester = '")+ "'";}
  //where condition:draft
  let draft = req.query.draft
  if (draft){
      draft_split = draft.split(",");
      // Add to sql query
      query = query + " AND draft = '" + draft_split.join("' OR draft = '")+ "'";}
  //where condition:faculty_id
  let faculty_id = req.query.faculty_id
  if (faculty_id){
      faculty_id_split = faculty_id.split(",");
      // Add to sql query
      query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/teaches')
});

//***TIMESLOT***
//view
app.get('/timeslot', (req, res) => {
  let query = "SELECT * FROM timeslot";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:building_code
  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      times = time_id.split(",")
      for(let i = 0; i < buildings.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "time_id = " + con.escape(times[i]);
      }
      prev = true;
  };
  //where condition:day_of_week
  let day_of_week = req.query.day_of_week
  if (day_of_week){
      if(prev){
          query = query + " AND ";
      }
      d_o_w_split = day_of_week.split(",");
      for(let i = 0; i < d_o_w_split.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "day_of_week = " + con.escape(d_o_w_split[i]);
      }
  }
  //where condition:time_start
  let time_start = req.query.time_start
  if (time_start){
      if(prev){
          query = query + " AND ";
      }
      starts = time_start.split(",");
      for(let i = 0; i < starts.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "time_start = " + con.escape(starts[i]);
      }
  }
  //where condition:time_end
  let time_end = req.query.time_end
  if (building_name){
      if(prev){
          query = query + " AND ";
      }
      ends = time_end.split(",");
      for(let i = 0; i < ends.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "time_end = " + con.escape(ends[i]);
      }
  }

  // query database
  query_db(query, res);

});
//add
app.post('/timeslot', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO timeslot (time_id,day_of_week,time_start,time_end) VALUES ?";
  data = [
      [req.body.time_id,req.body.day_of_week,req.body.time_start,req.body.time_end]
  ]

  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      time_id_split = time_id.split(",");
      // Add to sql query
      query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '")+ "'";}
  //where condition:day_of_week
  let day_of_week = req.query.day_of_week
  if (day_of_week){
      day_of_week_split = day_of_week.split(",");
      // Add to sql query
      query = query + " AND day_of_week = '" + day_of_week_split.join("' OR day_of_week = '")+ "'";}
  //where condition:time_start
  let time_start = req.query.time_start
  if (time_start){
      time_start_split = time_start.split(",");
      // Add to sql query
      query = query + " AND time_start = '" + time_start_split.join("' OR time_start = '")+ "'";}
  //where condition:time_end
  let time_end = req.query.time_end
  if (time_end){
      time_end_split = time_end.split(",");
      // Add to sql query
      query = query + " AND time_end = '" + time_end_split.join("' OR time_end = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/timeslot')
});
//delete
app.delete('/timeslot', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM timeslot";
  query=query+ " WHERE 1=1"

  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      time_id_split = time_id.split(",");
      // Add to sql query
      query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '")+ "'";}
  //where condition:day_of_week
  let day_of_week = req.query.day_of_week
  if (day_of_week){
      day_of_week_split = day_of_week.split(",");
      // Add to sql query
      query = query + " AND day_of_week = '" + day_of_week_split.join("' OR day_of_week = '")+ "'";}
  //where condition:time_start
  let time_start = req.query.time_start
  if (time_start){
      time_start_split = time_start.split(",");
      // Add to sql query
      query = query + " AND time_start = '" + time_start_split.join("' OR time_start = '")+ "'";}
  //where condition:time_end
  let time_end = req.query.time_end
  if (time_end){
      time_end_split = time_end.split(",");
      // Add to sql query
      query = query + " AND time_end = '" + time_end_split.join("' OR time_end = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/timeslot')
});
//update
app.put('/timeslot', (req, res) => {
  console.log(req.body)
  let query = "UPDATE timeslot SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_time_id
  let new_time_id = req.query.new_time_id
  if (new_time_id){
      if (comma==1){query=query+","}
      query = query + " time_id = '" + new_time_id +"'";
      comma=1
  };
  //set condition: new_day_of_week
  let new_day_of_week = req.query.new_day_of_week
  if (new_day_of_week){
      if (comma==1){query=query+","}
      query = query + " day_of_week = '" + new_day_of_week +"'";
      comma=1
  };
  //set condition: new_time_start
  let new_time_start = req.query.new_time_start
  if (new_time_start){
      if (comma==1){query=query+","}
      query = query + " time_start = '" + new_time_start +"'";
      comma=1
  };
  //set condition: new_time_end
  let new_time_end = req.query.new_time_end
  if (new_time_end){
      if (comma==1){query=query+","}
      query = query + " time_end = '" + new_time_end +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:time_id
  let time_id = req.query.time_id
  if (time_id){
      time_id_split = time_id.split(",");
      // Add to sql query
      query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '")+ "'";}
  //where condition:day_of_week
  let day_of_week = req.query.day_of_week
  if (day_of_week){
      day_of_week_split = day_of_week.split(",");
      // Add to sql query
      query = query + " AND day_of_week = '" + day_of_week_split.join("' OR day_of_week = '")+ "'";}
  //where condition:time_start
  let time_start = req.query.time_start
  if (time_start){
      time_start_split = time_start.split(",");
      // Add to sql query
      query = query + " AND time_start = '" + time_start_split.join("' OR time_start = '")+ "'";}
  //where condition:time_end
  let time_end = req.query.time_end
  if (time_end){
      time_end_split = time_end.split(",");
      // Add to sql query
      query = query + " AND time_end = '" + time_end_split.join("' OR time_end = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/timeslot')
});

//***TITLE***
//view
app.get('/title', (req, res) => {
  let query = "SELECT * FROM title";

  if(Object.keys(req.query).length > 0){
      query = query + " WHERE "
  }
  prev = false;
  //where condition:title_id
  let title_id = req.query.title_id
  if (title_id){
      titles = title_id.split(",")
      for(let i = 0; i < titles.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "title_id = " + con.escape(titles[i]);
      }
      prev = true;
  };
  //where condition:title_name
  let title_name = req.query.title_name
  if (title_name){
      if(prev){
          query = query + " AND ";
      }
      title_names = title_name.split(",");
      for(let i = 0; i < title_names.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "title_name = " + con.escape(title_names[i]);
      }
  }
  //where condition:max_load
  let max_load = req.query.max_load
  if (max_load){
      if(prev){
          query = query + " AND ";
      }
      loads = max_load.split(",");
      for(let i = 0; i < loads.length; i++){
          if(i > 0){
              query = query + " OR "
          }
          query = query + "max_load = " + con.escape(loads[i]);
      }
  }
  // query database
  query_db(query, res);
});
//add
app.post('/title', (req, res) => {
  console.log(req.body)
  let query = "INSERT INTO title (title_id,title_name,max_load) VALUES ?";
  data = [
      [req.body.title_id,req.body.title_name,req.body.max_load]
  ]

  //where condition:title_id
  let title_id = req.query.title_id
  if (title_id){
      title_id_split = title_id.split(",");
      // Add to sql query
      query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '")+ "'";}
  //where condition:title_name
  let title_name = req.query.title_name
  if (title_name){
      title_name_split = title_name.split(",");
      // Add to sql query
      query = query + " AND title_name = '" + title_name_split.join("' OR title_name = '")+ "'";}
  //where condition:max_load
  let max_load = req.query.max_load
  if (max_load){
      max_load_split = max_load.split(",");
      // Add to sql query
      query = query + " AND max_load = '" + max_load_split.join("' OR max_load = '")+ "'";}
  console.log(query)
  con.query(query, [data], (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/title')
});
//delete
app.delete('/title', (req, res) => {
  console.log(req.body)
  let query = "DELETE FROM title";
  query=query+ " WHERE 1=1"

  //where condition:title_id
  let title_id = req.query.title_id
  if (title_id){
      title_id_split = title_id.split(",");
      // Add to sql query
      query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '")+ "'";}
  //where condition:title_name
  let title_name = req.query.title_name
  if (title_name){
      title_name_split = title_name.split(",");
      // Add to sql query
      query = query + " AND title_name = '" + title_name_split.join("' OR title_name = '")+ "'";}
  //where condition:max_load
  let max_load = req.query.max_load
  if (max_load){
      max_load_split = max_load.split(",");
      // Add to sql query
      query = query + " AND max_load = '" + max_load_split.join("' OR max_load = '")+ "'";}
  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/title')
});
//update
app.put('/title', (req, res) => {
  console.log(req.body)
  let query = "UPDATE title SET ";
  //set condition: new_dept_code
  comma=0


  //set condition: new_title_id
  let new_title_id = req.query.new_title_id
  if (new_title_id){
      if (comma==1){query=query+","}
      query = query + " title_id = '" + new_title_id +"'";
      comma=1
  };
  //set condition: new_title_name
  let new_title_name = req.query.new_title_name
  if (new_title_name){
      if (comma==1){query=query+","}
      query = query + " title_name = '" + new_title_name +"'";
      comma=1
  };
  //set condition: new_max_load
  let new_max_load = req.query.new_max_load
  if (new_max_load){
      if (comma==1){query=query+","}
      query = query + " max_load = '" + new_max_load +"'";
      comma=1
  };

  query=query+ " WHERE 1=1"

  //where condition:title_id
  let title_id = req.query.title_id
  if (title_id){
      title_id_split = title_id.split(",");
      // Add to sql query
      query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '")+ "'";}
  //where condition:title_name
  let title_name = req.query.title_name
  if (title_name){
      title_name_split = title_name.split(",");
      // Add to sql query
      query = query + " AND title_name = '" + title_name_split.join("' OR title_name = '")+ "'";}
  //where condition:max_load
  let max_load = req.query.max_load
  if (max_load){
      max_load_split = max_load.split(",");
      // Add to sql query
      query = query + " AND max_load = '" + max_load_split.join("' OR max_load = '")+ "'";}

  console.log(query)
  con.query(query, (err, result) => {
      if (err) throw err
      console.log(result);
  })
  res.redirect('/title')
});

module.exports = app;
