
//TODO:
//in weak entities update should be: insert in strong, update weak entity, delete in strong
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

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

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
});
*/

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
app.get('/getBuilding', (req, res) => {
    let query = "SELECT * FROM building";
    let items = []


    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:building_name
    let building_name = req.query.building_name
    if (building_name) {
        building_name_split = building_name.split(",");
        // Add to sql query
        query = query + " AND building_name = '" + building_name_split.join("' OR building_name = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addBuilding', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO building (building_code,building_name) VALUES ?";
    data = [
        [req.body.building_code, req.body.building_name]
    ]

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:building_name
    let building_name = req.query.building_name
    if (building_name) {
        building_name_split = building_name.split(",");
        // Add to sql query
        query = query + " AND building_name = '" + building_name_split.join("' OR building_name = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getBuilding:id')
});
//delete
app.post('/dltBuilding', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM building";
    query = query + " WHERE 1=1"

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:building_name
    let building_name = req.query.building_name
    if (building_name) {
        building_name_split = building_name.split(",");
        // Add to sql query
        query = query + " AND building_name = '" + building_name_split.join("' OR building_name = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getBuilding:id')
});
//update
app.post('/updateBuilding', (req, res) => {
    console.log(req.body)
    let query = "UPDATE building SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_building_code
    let new_building_code = req.query.new_building_code
    if (new_building_code) {
        if (comma == 1) { query = query + "," }
        query = query + " building_code = '" + new_building_code + "'";
        comma = 1
    };
    //set condition: new_building_name
    let new_building_name = req.query.new_building_name
    if (new_building_name) {
        if (comma == 1) { query = query + "," }
        query = query + " building_name = '" + new_building_name + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:building_name
    let building_name = req.query.building_name
    if (building_name) {
        building_name_split = building_name.split(",");
        // Add to sql query
        query = query + " AND building_name = '" + building_name_split.join("' OR building_name = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getBuilding:id')
});

//***CLASS***
//view
app.get('/getClass', (req, res) => {
    let query = "SELECT * FROM class";
    let items = []


    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:class_name
    let class_name = req.query.class_name
    if (class_name) {
        class_name_split = class_name.split(",");
        // Add to sql query
        query = query + " AND class_name = '" + class_name_split.join("' OR class_name = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addClass', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO class (dept_code,class_num,class_name) VALUES ?";
    data = [
        [req.body.dept_code, req.body.class_num, req.body.class_name]
    ]

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:class_name
    let class_name = req.query.class_name
    if (class_name) {
        class_name_split = class_name.split(",");
        // Add to sql query
        query = query + " AND class_name = '" + class_name_split.join("' OR class_name = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getClass:id')
});
//delete
app.post('/dltClass', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM class";
    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:class_name
    let class_name = req.query.class_name
    if (class_name) {
        class_name_split = class_name.split(",");
        // Add to sql query
        query = query + " AND class_name = '" + class_name_split.join("' OR class_name = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getClass:id')
});
//update
app.post('/updateClass', (req, res) => {
    console.log(req.body)
    let query = "UPDATE class SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_dept_code
    let new_dept_code = req.query.new_dept_code
    if (new_dept_code) {
        if (comma == 1) { query = query + "," }
        query = query + " dept_code = '" + new_dept_code + "'";
        comma = 1
    };
    //set condition: new_class_num
    let new_class_num = req.query.new_class_num
    if (new_class_num) {
        if (comma == 1) { query = query + "," }
        query = query + " class_num = '" + new_class_num + "'";
        comma = 1
    };
    //set condition: new_class_name
    let new_class_name = req.query.new_class_name
    if (new_class_name) {
        if (comma == 1) { query = query + "," }
        query = query + " class_name = '" + new_class_name + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:class_name
    let class_name = req.query.class_name
    if (class_name) {
        class_name_split = class_name.split(",");
        // Add to sql query
        query = query + " AND class_name = '" + class_name_split.join("' OR class_name = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getClass:id')
});

//***CLASS_FEATURE***
//view
app.get('/getClass_feature', (req, res) => {
    let query = "SELECT * FROM class_feature";
    let items = []


    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addClass_feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO class_feature (dept_code,class_num,feature_id) VALUES ?";
    data = [
        [req.body.dept_code, req.body.class_num, req.body.feature_id]
    ]

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getClass_feature:id')
});
//delete
app.post('/dltClass_feature', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM class_feature";
    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getClass_feature:id')
});
//update
app.post('/updateClass_feature', (req, res) => {
    console.log(req.body)
    let query = "UPDATE class_feature SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_dept_code
    let new_dept_code = req.query.new_dept_code
    if (new_dept_code) {
        if (comma == 1) { query = query + "," }
        query = query + " dept_code = '" + new_dept_code + "'";
        comma = 1
    };
    //set condition: new_class_num
    let new_class_num = req.query.new_class_num
    if (new_class_num) {
        if (comma == 1) { query = query + "," }
        query = query + " class_num = '" + new_class_num + "'";
        comma = 1
    };
    //set condition: new_feature_id
    let new_feature_id = req.query.new_feature_id
    if (new_feature_id) {
        if (comma == 1) { query = query + "," }
        query = query + " feature_id = '" + new_feature_id + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getClass_feature:id')
});

//***DEPT***
//view
app.get('/getDept', (req, res) => {
    let query = "SELECT * FROM dept";
    let items = []


    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:dept_name
    let dept_name = req.query.dept_name
    if (dept_name) {
        dept_name_split = dept_name.split(",");
        // Add to sql query
        query = query + " AND dept_name = '" + dept_name_split.join("' OR dept_name = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addDept', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO dept (dept_code,dept_name) VALUES ?";
    data = [
        [req.body.dept_code, req.body.dept_name]
    ]

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:dept_name
    let dept_name = req.query.dept_name
    if (dept_name) {
        dept_name_split = dept_name.split(",");
        // Add to sql query
        query = query + " AND dept_name = '" + dept_name_split.join("' OR dept_name = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getDept:id')
});
//delete
app.post('/dltDept', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM dept";
    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:dept_name
    let dept_name = req.query.dept_name
    if (dept_name) {
        dept_name_split = dept_name.split(",");
        // Add to sql query
        query = query + " AND dept_name = '" + dept_name_split.join("' OR dept_name = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getDept:id')
});
//update
app.post('/updateDept', (req, res) => {
    console.log(req.body)
    let query = "UPDATE dept SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_dept_code
    let new_dept_code = req.query.new_dept_code
    if (new_dept_code) {
        if (comma == 1) { query = query + "," }
        query = query + " dept_code = '" + new_dept_code + "'";
        comma = 1
    };
    //set condition: new_dept_name
    let new_dept_name = req.query.new_dept_name
    if (new_dept_name) {
        if (comma == 1) { query = query + "," }
        query = query + " dept_name = '" + new_dept_name + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:dept_name
    let dept_name = req.query.dept_name
    if (dept_name) {
        dept_name_split = dept_name.split(",");
        // Add to sql query
        query = query + " AND dept_name = '" + dept_name_split.join("' OR dept_name = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getDept:id')
});

//***FACULTY***
//view
app.get('/getFaculty', (req, res) => {
    let query = "SELECT * FROM faculty";
    let items = []


    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:faculty_first
    let faculty_first = req.query.faculty_first
    if (faculty_first) {
        faculty_first_split = faculty_first.split(",");
        // Add to sql query
        query = query + " AND faculty_first = '" + faculty_first_split.join("' OR faculty_first = '") + "'";
    }
    //where condition:faculty_last
    let faculty_last = req.query.faculty_last
    if (faculty_last) {
        faculty_last_split = faculty_last.split(",");
        // Add to sql query
        query = query + " AND faculty_last = '" + faculty_last_split.join("' OR faculty_last = '") + "'";
    }
    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id) {
        title_id_split = title_id.split(",");
        // Add to sql query
        query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '") + "'";
    }
    //where condition:prev_load
    let prev_load = req.query.prev_load
    if (prev_load) {
        prev_load_split = prev_load.split(",");
        // Add to sql query
        query = query + " AND prev_load = '" + prev_load_split.join("' OR prev_load = '") + "'";
    }
    //where condition:curr_load
    let curr_load = req.query.curr_load
    if (curr_load) {
        curr_load_split = curr_load.split(",");
        // Add to sql query
        query = query + " AND curr_load = '" + curr_load_split.join("' OR curr_load = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addFaculty', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty (faculty_id,faculty_first,faculty_last,title_id,prev_load,curr_load) VALUES ?";
    data = [
        [req.body.faculty_id, req.body.faculty_first, req.body.faculty_last, req.body.title_id, req.body.prev_load, req.body.curr_load]
    ]

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:faculty_first
    let faculty_first = req.query.faculty_first
    if (faculty_first) {
        faculty_first_split = faculty_first.split(",");
        // Add to sql query
        query = query + " AND faculty_first = '" + faculty_first_split.join("' OR faculty_first = '") + "'";
    }
    //where condition:faculty_last
    let faculty_last = req.query.faculty_last
    if (faculty_last) {
        faculty_last_split = faculty_last.split(",");
        // Add to sql query
        query = query + " AND faculty_last = '" + faculty_last_split.join("' OR faculty_last = '") + "'";
    }
    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id) {
        title_id_split = title_id.split(",");
        // Add to sql query
        query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '") + "'";
    }
    //where condition:prev_load
    let prev_load = req.query.prev_load
    if (prev_load) {
        prev_load_split = prev_load.split(",");
        // Add to sql query
        query = query + " AND prev_load = '" + prev_load_split.join("' OR prev_load = '") + "'";
    }
    //where condition:curr_load
    let curr_load = req.query.curr_load
    if (curr_load) {
        curr_load_split = curr_load.split(",");
        // Add to sql query
        query = query + " AND curr_load = '" + curr_load_split.join("' OR curr_load = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty:id')
});
//delete
app.post('/dltFaculty', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM faculty";
    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:faculty_first
    let faculty_first = req.query.faculty_first
    if (faculty_first) {
        faculty_first_split = faculty_first.split(",");
        // Add to sql query
        query = query + " AND faculty_first = '" + faculty_first_split.join("' OR faculty_first = '") + "'";
    }
    //where condition:faculty_last
    let faculty_last = req.query.faculty_last
    if (faculty_last) {
        faculty_last_split = faculty_last.split(",");
        // Add to sql query
        query = query + " AND faculty_last = '" + faculty_last_split.join("' OR faculty_last = '") + "'";
    }
    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id) {
        title_id_split = title_id.split(",");
        // Add to sql query
        query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '") + "'";
    }
    //where condition:prev_load
    let prev_load = req.query.prev_load
    if (prev_load) {
        prev_load_split = prev_load.split(",");
        // Add to sql query
        query = query + " AND prev_load = '" + prev_load_split.join("' OR prev_load = '") + "'";
    }
    //where condition:curr_load
    let curr_load = req.query.curr_load
    if (curr_load) {
        curr_load_split = curr_load.split(",");
        // Add to sql query
        query = query + " AND curr_load = '" + curr_load_split.join("' OR curr_load = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty:id')
});
//update
app.post('/updateFaculty', (req, res) => {
    console.log(req.body)
    let query = "UPDATE faculty SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_faculty_id
    let new_faculty_id = req.query.new_faculty_id
    if (new_faculty_id) {
        if (comma == 1) { query = query + "," }
        query = query + " faculty_id = '" + new_faculty_id + "'";
        comma = 1
    };
    //set condition: new_faculty_first
    let new_faculty_first = req.query.new_faculty_first
    if (new_faculty_first) {
        if (comma == 1) { query = query + "," }
        query = query + " faculty_first = '" + new_faculty_first + "'";
        comma = 1
    };
    //set condition: new_faculty_last
    let new_faculty_last = req.query.new_faculty_last
    if (new_faculty_last) {
        if (comma == 1) { query = query + "," }
        query = query + " faculty_last = '" + new_faculty_last + "'";
        comma = 1
    };
    //set condition: new_title_id
    let new_title_id = req.query.new_title_id
    if (new_title_id) {
        if (comma == 1) { query = query + "," }
        query = query + " title_id = '" + new_title_id + "'";
        comma = 1
    };
    //set condition: new_prev_load
    let new_prev_load = req.query.new_prev_load
    if (new_prev_load) {
        if (comma == 1) { query = query + "," }
        query = query + " prev_load = '" + new_prev_load + "'";
        comma = 1
    };
    //set condition: new_curr_load
    let new_curr_load = req.query.new_curr_load
    if (new_curr_load) {
        if (comma == 1) { query = query + "," }
        query = query + " curr_load = '" + new_curr_load + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:faculty_first
    let faculty_first = req.query.faculty_first
    if (faculty_first) {
        faculty_first_split = faculty_first.split(",");
        // Add to sql query
        query = query + " AND faculty_first = '" + faculty_first_split.join("' OR faculty_first = '") + "'";
    }
    //where condition:faculty_last
    let faculty_last = req.query.faculty_last
    if (faculty_last) {
        faculty_last_split = faculty_last.split(",");
        // Add to sql query
        query = query + " AND faculty_last = '" + faculty_last_split.join("' OR faculty_last = '") + "'";
    }
    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id) {
        title_id_split = title_id.split(",");
        // Add to sql query
        query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '") + "'";
    }
    //where condition:prev_load
    let prev_load = req.query.prev_load
    if (prev_load) {
        prev_load_split = prev_load.split(",");
        // Add to sql query
        query = query + " AND prev_load = '" + prev_load_split.join("' OR prev_load = '") + "'";
    }
    //where condition:curr_load
    let curr_load = req.query.curr_load
    if (curr_load) {
        curr_load_split = curr_load.split(",");
        // Add to sql query
        query = query + " AND curr_load = '" + curr_load_split.join("' OR curr_load = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty:id')
});

//***FACULY_CLASS***
//view
app.get('/getFaculy_class', (req, res) => {
    let query = "SELECT * FROM faculy_class";
    let items = []


    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addFaculy_class', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculy_class (faculty_id,dept_code,class_num,pref_level) VALUES ?";
    data = [
        [req.body.faculty_id, req.body.dept_code, req.body.class_num, req.body.pref_level]
    ]

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculy_class:id')
});
//delete
app.post('/dltFaculy_class', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM faculy_class";
    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculy_class:id')
});
//update
app.post('/updateFaculy_class', (req, res) => {
    console.log(req.body)
    let query = "UPDATE faculy_class SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_faculty_id
    let new_faculty_id = req.query.new_faculty_id
    if (new_faculty_id) {
        if (comma == 1) { query = query + "," }
        query = query + " faculty_id = '" + new_faculty_id + "'";
        comma = 1
    };
    //set condition: new_dept_code
    let new_dept_code = req.query.new_dept_code
    if (new_dept_code) {
        if (comma == 1) { query = query + "," }
        query = query + " dept_code = '" + new_dept_code + "'";
        comma = 1
    };
    //set condition: new_class_num
    let new_class_num = req.query.new_class_num
    if (new_class_num) {
        if (comma == 1) { query = query + "," }
        query = query + " class_num = '" + new_class_num + "'";
        comma = 1
    };
    //set condition: new_pref_level
    let new_pref_level = req.query.new_pref_level
    if (new_pref_level) {
        if (comma == 1) { query = query + "," }
        query = query + " pref_level = '" + new_pref_level + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculy_class:id')
});

//***FACULTY_FEATURE***
//view
app.get('/getFaculty_feature', (req, res) => {
    let query = "SELECT * FROM faculty_feature";
    let items = []


    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addFaculty_feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_feature (faculty_id,feature_id,pref_level) VALUES ?";
    data = [
        [req.body.faculty_id, req.body.feature_id, req.body.pref_level]
    ]

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty_feature:id')
});
//delete
app.post('/dltFaculty_feature', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM faculty_feature";
    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty_feature:id')
});
//update
app.post('/updateFaculty_feature', (req, res) => {
    console.log(req.body)
    let query = "UPDATE faculty_feature SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_faculty_id
    let new_faculty_id = req.query.new_faculty_id
    if (new_faculty_id) {
        if (comma == 1) { query = query + "," }
        query = query + " faculty_id = '" + new_faculty_id + "'";
        comma = 1
    };
    //set condition: new_feature_id
    let new_feature_id = req.query.new_feature_id
    if (new_feature_id) {
        if (comma == 1) { query = query + "," }
        query = query + " feature_id = '" + new_feature_id + "'";
        comma = 1
    };
    //set condition: new_pref_level
    let new_pref_level = req.query.new_pref_level
    if (new_pref_level) {
        if (comma == 1) { query = query + "," }
        query = query + " pref_level = '" + new_pref_level + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty_feature:id')
});

//***FACULTY_OTHER_REQUEST***
//view
app.get('/getFaculty_other_request', (req, res) => {
    let query = "SELECT * FROM faculty_other_request";
    let items = []


    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:request
    let request = req.query.request
    if (request) {
        request_split = request.split(",");
        // Add to sql query
        query = query + " AND request = '" + request_split.join("' OR request = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addFaculty_other_request', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_other_request (faculty_id,request) VALUES ?";
    data = [
        [req.body.faculty_id, req.body.request]
    ]

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:request
    let request = req.query.request
    if (request) {
        request_split = request.split(",");
        // Add to sql query
        query = query + " AND request = '" + request_split.join("' OR request = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty_other_request:id')
});
//delete
app.post('/dltFaculty_other_request', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM faculty_other_request";
    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:request
    let request = req.query.request
    if (request) {
        request_split = request.split(",");
        // Add to sql query
        query = query + " AND request = '" + request_split.join("' OR request = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty_other_request:id')
});
//update
app.post('/updateFaculty_other_request', (req, res) => {
    console.log(req.body)
    let query = "UPDATE faculty_other_request SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_faculty_id
    let new_faculty_id = req.query.new_faculty_id
    if (new_faculty_id) {
        if (comma == 1) { query = query + "," }
        query = query + " faculty_id = '" + new_faculty_id + "'";
        comma = 1
    };
    //set condition: new_request
    let new_request = req.query.new_request
    if (new_request) {
        if (comma == 1) { query = query + "," }
        query = query + " request = '" + new_request + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:request
    let request = req.query.request
    if (request) {
        request_split = request.split(",");
        // Add to sql query
        query = query + " AND request = '" + request_split.join("' OR request = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty_other_request:id')
});

//***FACULTY_TIMESLOT***
//view
app.get('/getFaculty_timeslot', (req, res) => {
    let query = "SELECT * FROM faculty_timeslot";
    let items = []


    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addFaculty_timeslot', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_timeslot (faculty_id,time_id,pref_level) VALUES ?";
    data = [
        [req.body.faculty_id, req.body.time_id, req.body.pref_level]
    ]

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty_timeslot:id')
});
//delete
app.post('/dltFaculty_timeslot', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM faculty_timeslot";
    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty_timeslot:id')
});
//update
app.post('/updateFaculty_timeslot', (req, res) => {
    console.log(req.body)
    let query = "UPDATE faculty_timeslot SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_faculty_id
    let new_faculty_id = req.query.new_faculty_id
    if (new_faculty_id) {
        if (comma == 1) { query = query + "," }
        query = query + " faculty_id = '" + new_faculty_id + "'";
        comma = 1
    };
    //set condition: new_time_id
    let new_time_id = req.query.new_time_id
    if (new_time_id) {
        if (comma == 1) { query = query + "," }
        query = query + " time_id = '" + new_time_id + "'";
        comma = 1
    };
    //set condition: new_pref_level
    let new_pref_level = req.query.new_pref_level
    if (new_pref_level) {
        if (comma == 1) { query = query + "," }
        query = query + " pref_level = '" + new_pref_level + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    //where condition:pref_level
    let pref_level = req.query.pref_level
    if (pref_level) {
        pref_level_split = pref_level.split(",");
        // Add to sql query
        query = query + " AND pref_level = '" + pref_level_split.join("' OR pref_level = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFaculty_timeslot:id')
});

//***FEATURE***
//view
app.get('/getFeature', (req, res) => {
    let query = "SELECT * FROM feature";
    let items = []


    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    //where condition:feature_name
    let feature_name = req.query.feature_name
    if (feature_name) {
        feature_name_split = feature_name.split(",");
        // Add to sql query
        query = query + " AND feature_name = '" + feature_name_split.join("' OR feature_name = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addFeature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO feature (feature_id,feature_name) VALUES ?";
    data = [
        [req.body.feature_id, req.body.feature_name]
    ]

    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    //where condition:feature_name
    let feature_name = req.query.feature_name
    if (feature_name) {
        feature_name_split = feature_name.split(",");
        // Add to sql query
        query = query + " AND feature_name = '" + feature_name_split.join("' OR feature_name = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFeature:id')
});
//delete
app.post('/dltFeature', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM feature";
    query = query + " WHERE 1=1"

    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    //where condition:feature_name
    let feature_name = req.query.feature_name
    if (feature_name) {
        feature_name_split = feature_name.split(",");
        // Add to sql query
        query = query + " AND feature_name = '" + feature_name_split.join("' OR feature_name = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFeature:id')
});
//update
app.post('/updateFeature', (req, res) => {
    console.log(req.body)
    let query = "UPDATE feature SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_feature_id
    let new_feature_id = req.query.new_feature_id
    if (new_feature_id) {
        if (comma == 1) { query = query + "," }
        query = query + " feature_id = '" + new_feature_id + "'";
        comma = 1
    };
    //set condition: new_feature_name
    let new_feature_name = req.query.new_feature_name
    if (new_feature_name) {
        if (comma == 1) { query = query + "," }
        query = query + " feature_name = '" + new_feature_name + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    //where condition:feature_name
    let feature_name = req.query.feature_name
    if (feature_name) {
        feature_name_split = feature_name.split(",");
        // Add to sql query
        query = query + " AND feature_name = '" + feature_name_split.join("' OR feature_name = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getFeature:id')
});

//***LOGIN***
//view
app.get('/getLogin', (req, res) => {
    let query = "SELECT * FROM login";
    let items = []


    //where condition:user_id
    let user_id = req.query.user_id
    if (user_id) {
        user_id_split = user_id.split(",");
        // Add to sql query
        query = query + " AND user_id = '" + user_id_split.join("' OR user_id = '") + "'";
    }
    //where condition:pass
    let pass = req.query.pass
    if (pass) {
        pass_split = pass.split(",");
        // Add to sql query
        query = query + " AND pass = '" + pass_split.join("' OR pass = '") + "'";
    }
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:access_level
    let access_level = req.query.access_level
    if (access_level) {
        access_level_split = access_level.split(",");
        // Add to sql query
        query = query + " AND access_level = '" + access_level_split.join("' OR access_level = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addLogin', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO login (user_id,pass,faculty_id,access_level) VALUES ?";
    data = [
        [req.body.user_id, req.body.pass, req.body.faculty_id, req.body.access_level]
    ]

    //where condition:user_id
    let user_id = req.query.user_id
    if (user_id) {
        user_id_split = user_id.split(",");
        // Add to sql query
        query = query + " AND user_id = '" + user_id_split.join("' OR user_id = '") + "'";
    }
    //where condition:pass
    let pass = req.query.pass
    if (pass) {
        pass_split = pass.split(",");
        // Add to sql query
        query = query + " AND pass = '" + pass_split.join("' OR pass = '") + "'";
    }
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:access_level
    let access_level = req.query.access_level
    if (access_level) {
        access_level_split = access_level.split(",");
        // Add to sql query
        query = query + " AND access_level = '" + access_level_split.join("' OR access_level = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getLogin:id')
});
//delete
app.post('/dltLogin', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM login";
    query = query + " WHERE 1=1"

    //where condition:user_id
    let user_id = req.query.user_id
    if (user_id) {
        user_id_split = user_id.split(",");
        // Add to sql query
        query = query + " AND user_id = '" + user_id_split.join("' OR user_id = '") + "'";
    }
    //where condition:pass
    let pass = req.query.pass
    if (pass) {
        pass_split = pass.split(",");
        // Add to sql query
        query = query + " AND pass = '" + pass_split.join("' OR pass = '") + "'";
    }
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:access_level
    let access_level = req.query.access_level
    if (access_level) {
        access_level_split = access_level.split(",");
        // Add to sql query
        query = query + " AND access_level = '" + access_level_split.join("' OR access_level = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getLogin:id')
});
//update
app.post('/updateLogin', (req, res) => {
    console.log(req.body)
    let query = "UPDATE login SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_user_id
    let new_user_id = req.query.new_user_id
    if (new_user_id) {
        if (comma == 1) { query = query + "," }
        query = query + " user_id = '" + new_user_id + "'";
        comma = 1
    };
    //set condition: new_pass
    let new_pass = req.query.new_pass
    if (new_pass) {
        if (comma == 1) { query = query + "," }
        query = query + " pass = '" + new_pass + "'";
        comma = 1
    };
    //set condition: new_faculty_id
    let new_faculty_id = req.query.new_faculty_id
    if (new_faculty_id) {
        if (comma == 1) { query = query + "," }
        query = query + " faculty_id = '" + new_faculty_id + "'";
        comma = 1
    };
    //set condition: new_access_level
    let new_access_level = req.query.new_access_level
    if (new_access_level) {
        if (comma == 1) { query = query + "," }
        query = query + " access_level = '" + new_access_level + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:user_id
    let user_id = req.query.user_id
    if (user_id) {
        user_id_split = user_id.split(",");
        // Add to sql query
        query = query + " AND user_id = '" + user_id_split.join("' OR user_id = '") + "'";
    }
    //where condition:pass
    let pass = req.query.pass
    if (pass) {
        pass_split = pass.split(",");
        // Add to sql query
        query = query + " AND pass = '" + pass_split.join("' OR pass = '") + "'";
    }
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    //where condition:access_level
    let access_level = req.query.access_level
    if (access_level) {
        access_level_split = access_level.split(",");
        // Add to sql query
        query = query + " AND access_level = '" + access_level_split.join("' OR access_level = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getLogin:id')
});

//***MEETS***
//view
app.get('/getMeets', (req, res) => {
    let query = "SELECT * FROM meets";
    let items = []


    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addMeets', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO meets (dept_code,class_num,section_num,semester,draft,building_code,room_num,time_id) VALUES ?";
    data = [
        [req.body.dept_code, req.body.class_num, req.body.section_num, req.body.semester, req.body.draft, req.body.building_code, req.body.room_num, req.body.time_id]
    ]

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getMeets:id')
});
//delete
app.post('/dltMeets', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM meets";
    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getMeets:id')
});
//update
app.post('/updateMeets', (req, res) => {
    console.log(req.body)
    let query = "UPDATE meets SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_dept_code
    let new_dept_code = req.query.new_dept_code
    if (new_dept_code) {
        if (comma == 1) { query = query + "," }
        query = query + " dept_code = '" + new_dept_code + "'";
        comma = 1
    };
    //set condition: new_class_num
    let new_class_num = req.query.new_class_num
    if (new_class_num) {
        if (comma == 1) { query = query + "," }
        query = query + " class_num = '" + new_class_num + "'";
        comma = 1
    };
    //set condition: new_section_num
    let new_section_num = req.query.new_section_num
    if (new_section_num) {
        if (comma == 1) { query = query + "," }
        query = query + " section_num = '" + new_section_num + "'";
        comma = 1
    };
    //set condition: new_semester
    let new_semester = req.query.new_semester
    if (new_semester) {
        if (comma == 1) { query = query + "," }
        query = query + " semester = '" + new_semester + "'";
        comma = 1
    };
    //set condition: new_draft
    let new_draft = req.query.new_draft
    if (new_draft) {
        if (comma == 1) { query = query + "," }
        query = query + " draft = '" + new_draft + "'";
        comma = 1
    };
    //set condition: new_building_code
    let new_building_code = req.query.new_building_code
    if (new_building_code) {
        if (comma == 1) { query = query + "," }
        query = query + " building_code = '" + new_building_code + "'";
        comma = 1
    };
    //set condition: new_room_num
    let new_room_num = req.query.new_room_num
    if (new_room_num) {
        if (comma == 1) { query = query + "," }
        query = query + " room_num = '" + new_room_num + "'";
        comma = 1
    };
    //set condition: new_time_id
    let new_time_id = req.query.new_time_id
    if (new_time_id) {
        if (comma == 1) { query = query + "," }
        query = query + " time_id = '" + new_time_id + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getMeets:id')
});

//***ROOM***
//view
app.get('/getRoom', (req, res) => {
    let query = "SELECT * FROM room";
    let items = []


    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity) {
        capacity_split = capacity.split(",");
        // Add to sql query
        query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addRoom', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO room (building_code,room_num,capacity) VALUES ?";
    data = [
        [req.body.building_code, req.body.room_num, req.body.capacity]
    ]

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity) {
        capacity_split = capacity.split(",");
        // Add to sql query
        query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getRoom:id')
});
//delete
app.post('/dltRoom', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM room";
    query = query + " WHERE 1=1"

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity) {
        capacity_split = capacity.split(",");
        // Add to sql query
        query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getRoom:id')
});
//update
app.post('/updateRoom', (req, res) => {
    console.log(req.body)
    let query = "UPDATE room SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_building_code
    let new_building_code = req.query.new_building_code
    if (new_building_code) {
        if (comma == 1) { query = query + "," }
        query = query + " building_code = '" + new_building_code + "'";
        comma = 1
    };
    //set condition: new_room_num
    let new_room_num = req.query.new_room_num
    if (new_room_num) {
        if (comma == 1) { query = query + "," }
        query = query + " room_num = '" + new_room_num + "'";
        comma = 1
    };
    //set condition: new_capacity
    let new_capacity = req.query.new_capacity
    if (new_capacity) {
        if (comma == 1) { query = query + "," }
        query = query + " capacity = '" + new_capacity + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity) {
        capacity_split = capacity.split(",");
        // Add to sql query
        query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getRoom:id')
});

//***ROOM_FEATURE***
//view
app.get('/getRoom_feature', (req, res) => {
    let query = "SELECT * FROM room_feature";
    let items = []


    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addRoom_feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO room_feature (building_code,room_num,feature_id) VALUES ?";
    data = [
        [req.body.building_code, req.body.room_num, req.body.feature_id]
    ]

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getRoom_feature:id')
});
//delete
app.post('/dltRoom_feature', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM room_feature";
    query = query + " WHERE 1=1"

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getRoom_feature:id')
});
//update
app.post('/updateRoom_feature', (req, res) => {
    console.log(req.body)
    let query = "UPDATE room_feature SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_building_code
    let new_building_code = req.query.new_building_code
    if (new_building_code) {
        if (comma == 1) { query = query + "," }
        query = query + " building_code = '" + new_building_code + "'";
        comma = 1
    };
    //set condition: new_room_num
    let new_room_num = req.query.new_room_num
    if (new_room_num) {
        if (comma == 1) { query = query + "," }
        query = query + " room_num = '" + new_room_num + "'";
        comma = 1
    };
    //set condition: new_feature_id
    let new_feature_id = req.query.new_feature_id
    if (new_feature_id) {
        if (comma == 1) { query = query + "," }
        query = query + " feature_id = '" + new_feature_id + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:building_code
    let building_code = req.query.building_code
    if (building_code) {
        building_code_split = building_code.split(",");
        // Add to sql query
        query = query + " AND building_code = '" + building_code_split.join("' OR building_code = '") + "'";
    }
    //where condition:room_num
    let room_num = req.query.room_num
    if (room_num) {
        room_num_split = room_num.split(",");
        // Add to sql query
        query = query + " AND room_num = '" + room_num_split.join("' OR room_num = '") + "'";
    }
    //where condition:feature_id
    let feature_id = req.query.feature_id
    if (feature_id) {
        feature_id_split = feature_id.split(",");
        // Add to sql query
        query = query + " AND feature_id = '" + feature_id_split.join("' OR feature_id = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getRoom_feature:id')
});

//***SECTION***
//view
app.get('/getSection', (req, res) => {
    let query = "SELECT * FROM section";
    let items = []


    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity) {
        capacity_split = capacity.split(",");
        // Add to sql query
        query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addSection', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO section (dept_code,class_num,section_num,semester,draft,capacity) VALUES ?";
    data = [
        [req.body.dept_code, req.body.class_num, req.body.section_num, req.body.semester, req.body.draft, req.body.capacity]
    ]

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity) {
        capacity_split = capacity.split(",");
        // Add to sql query
        query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getSection:id')
});
//delete
app.post('/dltSection', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM section";
    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity) {
        capacity_split = capacity.split(",");
        // Add to sql query
        query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getSection:id')
});
//update
app.post('/updateSection', (req, res) => {
    console.log(req.body)
    let query = "UPDATE section SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_dept_code
    let new_dept_code = req.query.new_dept_code
    if (new_dept_code) {
        if (comma == 1) { query = query + "," }
        query = query + " dept_code = '" + new_dept_code + "'";
        comma = 1
    };
    //set condition: new_class_num
    let new_class_num = req.query.new_class_num
    if (new_class_num) {
        if (comma == 1) { query = query + "," }
        query = query + " class_num = '" + new_class_num + "'";
        comma = 1
    };
    //set condition: new_section_num
    let new_section_num = req.query.new_section_num
    if (new_section_num) {
        if (comma == 1) { query = query + "," }
        query = query + " section_num = '" + new_section_num + "'";
        comma = 1
    };
    //set condition: new_semester
    let new_semester = req.query.new_semester
    if (new_semester) {
        if (comma == 1) { query = query + "," }
        query = query + " semester = '" + new_semester + "'";
        comma = 1
    };
    //set condition: new_draft
    let new_draft = req.query.new_draft
    if (new_draft) {
        if (comma == 1) { query = query + "," }
        query = query + " draft = '" + new_draft + "'";
        comma = 1
    };
    //set condition: new_capacity
    let new_capacity = req.query.new_capacity
    if (new_capacity) {
        if (comma == 1) { query = query + "," }
        query = query + " capacity = '" + new_capacity + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:capacity
    let capacity = req.query.capacity
    if (capacity) {
        capacity_split = capacity.split(",");
        // Add to sql query
        query = query + " AND capacity = '" + capacity_split.join("' OR capacity = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getSection:id')
});

//***TEACHES***
//view
app.get('/getTeaches', (req, res) => {
    let query = "SELECT * FROM teaches";
    let items = []


    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addTeaches', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO teaches (dept_code,class_num,section_num,semester,draft,faculty_id) VALUES ?";
    data = [
        [req.body.dept_code, req.body.class_num, req.body.section_num, req.body.semester, req.body.draft, req.body.faculty_id]
    ]

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getTeaches:id')
});
//delete
app.post('/dltTeaches', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM teaches";
    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getTeaches:id')
});
//update
app.post('/updateTeaches', (req, res) => {
    console.log(req.body)
    let query = "UPDATE teaches SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_dept_code
    let new_dept_code = req.query.new_dept_code
    if (new_dept_code) {
        if (comma == 1) { query = query + "," }
        query = query + " dept_code = '" + new_dept_code + "'";
        comma = 1
    };
    //set condition: new_class_num
    let new_class_num = req.query.new_class_num
    if (new_class_num) {
        if (comma == 1) { query = query + "," }
        query = query + " class_num = '" + new_class_num + "'";
        comma = 1
    };
    //set condition: new_section_num
    let new_section_num = req.query.new_section_num
    if (new_section_num) {
        if (comma == 1) { query = query + "," }
        query = query + " section_num = '" + new_section_num + "'";
        comma = 1
    };
    //set condition: new_semester
    let new_semester = req.query.new_semester
    if (new_semester) {
        if (comma == 1) { query = query + "," }
        query = query + " semester = '" + new_semester + "'";
        comma = 1
    };
    //set condition: new_draft
    let new_draft = req.query.new_draft
    if (new_draft) {
        if (comma == 1) { query = query + "," }
        query = query + " draft = '" + new_draft + "'";
        comma = 1
    };
    //set condition: new_faculty_id
    let new_faculty_id = req.query.new_faculty_id
    if (new_faculty_id) {
        if (comma == 1) { query = query + "," }
        query = query + " faculty_id = '" + new_faculty_id + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:dept_code
    let dept_code = req.query.dept_code
    if (dept_code) {
        dept_code_split = dept_code.split(",");
        // Add to sql query
        query = query + " AND dept_code = '" + dept_code_split.join("' OR dept_code = '") + "'";
    }
    //where condition:class_num
    let class_num = req.query.class_num
    if (class_num) {
        class_num_split = class_num.split(",");
        // Add to sql query
        query = query + " AND class_num = '" + class_num_split.join("' OR class_num = '") + "'";
    }
    //where condition:section_num
    let section_num = req.query.section_num
    if (section_num) {
        section_num_split = section_num.split(",");
        // Add to sql query
        query = query + " AND section_num = '" + section_num_split.join("' OR section_num = '") + "'";
    }
    //where condition:semester
    let semester = req.query.semester
    if (semester) {
        semester_split = semester.split(",");
        // Add to sql query
        query = query + " AND semester = '" + semester_split.join("' OR semester = '") + "'";
    }
    //where condition:draft
    let draft = req.query.draft
    if (draft) {
        draft_split = draft.split(",");
        // Add to sql query
        query = query + " AND draft = '" + draft_split.join("' OR draft = '") + "'";
    }
    //where condition:faculty_id
    let faculty_id = req.query.faculty_id
    if (faculty_id) {
        faculty_id_split = faculty_id.split(",");
        // Add to sql query
        query = query + " AND faculty_id = '" + faculty_id_split.join("' OR faculty_id = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getTeaches:id')
});

//***TIMESLOT***
//view
app.get('/getTimeslot', (req, res) => {
    let query = "SELECT * FROM timeslot";
    let items = []


    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    //where condition:day_of_week
    let day_of_week = req.query.day_of_week
    if (day_of_week) {
        day_of_week_split = day_of_week.split(",");
        // Add to sql query
        query = query + " AND day_of_week = '" + day_of_week_split.join("' OR day_of_week = '") + "'";
    }
    //where condition:time_start
    let time_start = req.query.time_start
    if (time_start) {
        time_start_split = time_start.split(",");
        // Add to sql query
        query = query + " AND time_start = '" + time_start_split.join("' OR time_start = '") + "'";
    }
    //where condition:time_end
    let time_end = req.query.time_end
    if (time_end) {
        time_end_split = time_end.split(",");
        // Add to sql query
        query = query + " AND time_end = '" + time_end_split.join("' OR time_end = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addTimeslot', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO timeslot (time_id,day_of_week,time_start,time_end) VALUES ?";
    data = [
        [req.body.time_id, req.body.day_of_week, req.body.time_start, req.body.time_end]
    ]

    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    //where condition:day_of_week
    let day_of_week = req.query.day_of_week
    if (day_of_week) {
        day_of_week_split = day_of_week.split(",");
        // Add to sql query
        query = query + " AND day_of_week = '" + day_of_week_split.join("' OR day_of_week = '") + "'";
    }
    //where condition:time_start
    let time_start = req.query.time_start
    if (time_start) {
        time_start_split = time_start.split(",");
        // Add to sql query
        query = query + " AND time_start = '" + time_start_split.join("' OR time_start = '") + "'";
    }
    //where condition:time_end
    let time_end = req.query.time_end
    if (time_end) {
        time_end_split = time_end.split(",");
        // Add to sql query
        query = query + " AND time_end = '" + time_end_split.join("' OR time_end = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getTimeslot:id')
});
//delete
app.post('/dltTimeslot', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM timeslot";
    query = query + " WHERE 1=1"

    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    //where condition:day_of_week
    let day_of_week = req.query.day_of_week
    if (day_of_week) {
        day_of_week_split = day_of_week.split(",");
        // Add to sql query
        query = query + " AND day_of_week = '" + day_of_week_split.join("' OR day_of_week = '") + "'";
    }
    //where condition:time_start
    let time_start = req.query.time_start
    if (time_start) {
        time_start_split = time_start.split(",");
        // Add to sql query
        query = query + " AND time_start = '" + time_start_split.join("' OR time_start = '") + "'";
    }
    //where condition:time_end
    let time_end = req.query.time_end
    if (time_end) {
        time_end_split = time_end.split(",");
        // Add to sql query
        query = query + " AND time_end = '" + time_end_split.join("' OR time_end = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getTimeslot:id')
});
//update
app.post('/updateTimeslot', (req, res) => {
    console.log(req.body)
    let query = "UPDATE timeslot SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_time_id
    let new_time_id = req.query.new_time_id
    if (new_time_id) {
        if (comma == 1) { query = query + "," }
        query = query + " time_id = '" + new_time_id + "'";
        comma = 1
    };
    //set condition: new_day_of_week
    let new_day_of_week = req.query.new_day_of_week
    if (new_day_of_week) {
        if (comma == 1) { query = query + "," }
        query = query + " day_of_week = '" + new_day_of_week + "'";
        comma = 1
    };
    //set condition: new_time_start
    let new_time_start = req.query.new_time_start
    if (new_time_start) {
        if (comma == 1) { query = query + "," }
        query = query + " time_start = '" + new_time_start + "'";
        comma = 1
    };
    //set condition: new_time_end
    let new_time_end = req.query.new_time_end
    if (new_time_end) {
        if (comma == 1) { query = query + "," }
        query = query + " time_end = '" + new_time_end + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:time_id
    let time_id = req.query.time_id
    if (time_id) {
        time_id_split = time_id.split(",");
        // Add to sql query
        query = query + " AND time_id = '" + time_id_split.join("' OR time_id = '") + "'";
    }
    //where condition:day_of_week
    let day_of_week = req.query.day_of_week
    if (day_of_week) {
        day_of_week_split = day_of_week.split(",");
        // Add to sql query
        query = query + " AND day_of_week = '" + day_of_week_split.join("' OR day_of_week = '") + "'";
    }
    //where condition:time_start
    let time_start = req.query.time_start
    if (time_start) {
        time_start_split = time_start.split(",");
        // Add to sql query
        query = query + " AND time_start = '" + time_start_split.join("' OR time_start = '") + "'";
    }
    //where condition:time_end
    let time_end = req.query.time_end
    if (time_end) {
        time_end_split = time_end.split(",");
        // Add to sql query
        query = query + " AND time_end = '" + time_end_split.join("' OR time_end = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getTimeslot:id')
});

//***TITLE***
//view
app.get('/getTitle', (req, res) => {
    let query = "SELECT * FROM title";
    let items = []


    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id) {
        title_id_split = title_id.split(",");
        // Add to sql query
        query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '") + "'";
    }
    //where condition:title_name
    let title_name = req.query.title_name
    if (title_name) {
        title_name_split = title_name.split(",");
        // Add to sql query
        query = query + " AND title_name = '" + title_name_split.join("' OR title_name = '") + "'";
    }
    //where condition:max_load
    let max_load = req.query.max_load
    if (max_load) {
        max_load_split = max_load.split(",");
        // Add to sql query
        query = query + " AND max_load = '" + max_load_split.join("' OR max_load = '") + "'";
    }

    // query database
    new Promise((resolve, reject) => {
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
app.post('/addTitle', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO title (title_id,title_name,max_load) VALUES ?";
    data = [
        [req.body.title_id, req.body.title_name, req.body.max_load]
    ]

    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id) {
        title_id_split = title_id.split(",");
        // Add to sql query
        query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '") + "'";
    }
    //where condition:title_name
    let title_name = req.query.title_name
    if (title_name) {
        title_name_split = title_name.split(",");
        // Add to sql query
        query = query + " AND title_name = '" + title_name_split.join("' OR title_name = '") + "'";
    }
    //where condition:max_load
    let max_load = req.query.max_load
    if (max_load) {
        max_load_split = max_load.split(",");
        // Add to sql query
        query = query + " AND max_load = '" + max_load_split.join("' OR max_load = '") + "'";
    }
    console.log(query)
    con.query(query, [data], (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getTitle:id')
});
//delete
app.post('/dltTitle', (req, res) => {
    console.log(req.body)
    let query = "DELETE FROM title";
    query = query + " WHERE 1=1"

    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id) {
        title_id_split = title_id.split(",");
        // Add to sql query
        query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '") + "'";
    }
    //where condition:title_name
    let title_name = req.query.title_name
    if (title_name) {
        title_name_split = title_name.split(",");
        // Add to sql query
        query = query + " AND title_name = '" + title_name_split.join("' OR title_name = '") + "'";
    }
    //where condition:max_load
    let max_load = req.query.max_load
    if (max_load) {
        max_load_split = max_load.split(",");
        // Add to sql query
        query = query + " AND max_load = '" + max_load_split.join("' OR max_load = '") + "'";
    }
    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getTitle:id')
});
//update
app.post('/updateTitle', (req, res) => {
    console.log(req.body)
    let query = "UPDATE title SET ";
    //set condition: new_dept_code
    comma = 0


    //set condition: new_title_id
    let new_title_id = req.query.new_title_id
    if (new_title_id) {
        if (comma == 1) { query = query + "," }
        query = query + " title_id = '" + new_title_id + "'";
        comma = 1
    };
    //set condition: new_title_name
    let new_title_name = req.query.new_title_name
    if (new_title_name) {
        if (comma == 1) { query = query + "," }
        query = query + " title_name = '" + new_title_name + "'";
        comma = 1
    };
    //set condition: new_max_load
    let new_max_load = req.query.new_max_load
    if (new_max_load) {
        if (comma == 1) { query = query + "," }
        query = query + " max_load = '" + new_max_load + "'";
        comma = 1
    };

    query = query + " WHERE 1=1"

    //where condition:title_id
    let title_id = req.query.title_id
    if (title_id) {
        title_id_split = title_id.split(",");
        // Add to sql query
        query = query + " AND title_id = '" + title_id_split.join("' OR title_id = '") + "'";
    }
    //where condition:title_name
    let title_name = req.query.title_name
    if (title_name) {
        title_name_split = title_name.split(",");
        // Add to sql query
        query = query + " AND title_name = '" + title_name_split.join("' OR title_name = '") + "'";
    }
    //where condition:max_load
    let max_load = req.query.max_load
    if (max_load) {
        max_load_split = max_load.split(",");
        // Add to sql query
        query = query + " AND max_load = '" + max_load_split.join("' OR max_load = '") + "'";
    }

    console.log(query)
    con.query(query, (err, result) => {
        if (err) throw err
        console.log(result);
    })
    res.redirect('/getTitle:id')
});
module.exports = app;