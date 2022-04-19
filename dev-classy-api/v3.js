
//TODO:
//in weak entities update should be: insert in strong, update weak entity, delete in strong

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
app.get('/v2/building', (req, res) => {
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
});
//add
app.post('/v2/building', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO building (building_code,building_name) VALUES ?";
    data = [
        [req.body.building_code,req.body.building_name]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/building/:building_code_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE building SET building_code = COALESCE(?,building_code), building_name = COALESCE(?,building_name) WHERE building_code= '+con.escape(req.params.building_code_id)+'';

    data = [
        req.body.building_code,req.body.building_name
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/building/:building_code_id', (req, res) => {
    let query = 'DELETE FROM building WHERE building_code= '+con.escape(req.params.building_code_id)+'';

    query_db_delete(query, res)
});

//***CLASS***
//view
app.get('/v2/class', (req, res) => {
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
});
//add
app.post('/v2/class', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO class (dept_code,class_num,class_name) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.class_name]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/class/:dept_code_id/:class_num_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE class SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), class_name = COALESCE(?,class_name) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.class_name
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/class/:dept_code_id/:class_num_id', (req, res) => {
    let query = 'DELETE FROM class WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

    query_db_delete(query, res)
});

//***CLASS_FEATURE***
//view
app.get('/v2/class_feature', (req, res) => {
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
});
//add
app.post('/v2/class_feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO class_feature (dept_code,class_num,feature_id) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.feature_id]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/class_feature/:dept_code_id/:class_num_id/:feature_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE class_feature SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), feature_id = COALESCE(?,feature_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.feature_id
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/class_feature/:dept_code_id/:class_num_id/:feature_id_id', (req, res) => {
    let query = 'DELETE FROM class_feature WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    query_db_delete(query, res)
});

//***DEPT***
//view
app.get('/v2/dept', (req, res) => {
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
});
//add
app.post('/v2/dept', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO dept (dept_code,dept_name) VALUES ?";
    data = [
        [req.body.dept_code,req.body.dept_name]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/dept/:dept_code_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE dept SET dept_code = COALESCE(?,dept_code), dept_name = COALESCE(?,dept_name) WHERE dept_code= '+con.escape(req.params.dept_code_id)+'';

    data = [
        req.body.dept_code,req.body.dept_name
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/dept/:dept_code_id', (req, res) => {
    let query = 'DELETE FROM dept WHERE dept_code= '+con.escape(req.params.dept_code_id)+'';

    query_db_delete(query, res)
});

//***FACULTY***
//view
app.get('/v2/faculty', (req, res) => {
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
});
//add
app.post('/v2/faculty', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty (faculty_id,faculty_first,faculty_last,title_id,prev_load,curr_load) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.faculty_first,req.body.faculty_last,req.body.title_id,req.body.prev_load,req.body.curr_load]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/faculty/:faculty_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE faculty SET faculty_id = COALESCE(?,faculty_id), faculty_first = COALESCE(?,faculty_first), faculty_last = COALESCE(?,faculty_last), title_id = COALESCE(?,title_id), prev_load = COALESCE(?,prev_load), curr_load = COALESCE(?,curr_load) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+'';

    data = [
        req.body.faculty_id,req.body.faculty_first,req.body.faculty_last,req.body.title_id,req.body.prev_load,req.body.curr_load
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/faculty/:faculty_id_id', (req, res) => {
    let query = 'DELETE FROM faculty WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+'';

    query_db_delete(query, res)
});

//***FACULTY_CLASS***
//view
app.get('/v2/faculty_class', (req, res) => {
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
});
//add
app.post('/v2/faculty_class', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_class (faculty_id,dept_code,class_num,pref_level) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.dept_code,req.body.class_num,req.body.pref_level]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/faculty_class/:faculty_id_id/:dept_code_id/:class_num_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE faculty_class SET faculty_id = COALESCE(?,faculty_id), dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

    data = [
        req.body.faculty_id,req.body.dept_code,req.body.class_num,req.body.pref_level
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/faculty_class/:faculty_id_id/:dept_code_id/:class_num_id', (req, res) => {
    let query = 'DELETE FROM faculty_class WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

    query_db_delete(query, res)
});

//***FACULTY_FEATURE***
//view
app.get('/v2/faculty_feature', (req, res) => {
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
});
//add
app.post('/v2/faculty_feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_feature (faculty_id,feature_id,pref_level) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.feature_id,req.body.pref_level]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/faculty_feature/:faculty_id_id/:feature_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE faculty_feature SET faculty_id = COALESCE(?,faculty_id), feature_id = COALESCE(?,feature_id), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    data = [
        req.body.faculty_id,req.body.feature_id,req.body.pref_level
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/faculty_feature/:faculty_id_id/:feature_id_id', (req, res) => {
    let query = 'DELETE FROM faculty_feature WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    query_db_delete(query, res)
});

//***FACULTY_OTHER_REQUEST***
//view
app.get('/v2/faculty_other_request', (req, res) => {
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
});
//add
app.post('/v2/faculty_other_request', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_other_request (faculty_id,request) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.request]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/faculty_other_request/:faculty_id_id/:request_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE faculty_other_request SET faculty_id = COALESCE(?,faculty_id), request = COALESCE(?,request) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND request= '+con.escape(req.params.request_id)+'';

    data = [
        req.body.faculty_id,req.body.request
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/faculty_other_request/:faculty_id_id/:request_id', (req, res) => {
    let query = 'DELETE FROM faculty_other_request WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND request= '+con.escape(req.params.request_id)+'';

    query_db_delete(query, res)
});

//***FACULTY_TIMESLOT***
//view
app.get('/v2/faculty_timeslot', (req, res) => {
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
});
//add
app.post('/v2/faculty_timeslot', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_timeslot (faculty_id,time_id,pref_level) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.time_id,req.body.pref_level]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/faculty_timeslot/:faculty_id_id/:time_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE faculty_timeslot SET faculty_id = COALESCE(?,faculty_id), time_id = COALESCE(?,time_id), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

    data = [
        req.body.faculty_id,req.body.time_id,req.body.pref_level
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/faculty_timeslot/:faculty_id_id/:time_id_id', (req, res) => {
    let query = 'DELETE FROM faculty_timeslot WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

    query_db_delete(query, res)
});

//***FEATURE***
//view
app.get('/v2/feature', (req, res) => {
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
});
//add
app.post('/v2/feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO feature (feature_id,feature_name) VALUES ?";
    data = [
        [req.body.feature_id,req.body.feature_name]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/feature/:feature_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE feature SET feature_id = COALESCE(?,feature_id), feature_name = COALESCE(?,feature_name) WHERE feature_id= '+con.escape(req.params.feature_id_id)+'';

    data = [
        req.body.feature_id,req.body.feature_name
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/feature/:feature_id_id', (req, res) => {
    let query = 'DELETE FROM feature WHERE feature_id= '+con.escape(req.params.feature_id_id)+'';

    query_db_delete(query, res)
});

//***LOGIN***
//view
app.get('/v2/login', (req, res) => {
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
});
//add
app.post('/v2/login', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO login (user_id,pass,faculty_id,access_level) VALUES ?";
    data = [
        [req.body.user_id,req.body.pass,req.body.faculty_id,req.body.access_level]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/login/:user_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE login SET user_id = COALESCE(?,user_id), pass = COALESCE(?,pass), faculty_id = COALESCE(?,faculty_id), access_level = COALESCE(?,access_level) WHERE user_id= '+con.escape(req.params.user_id_id)+'';

    data = [
        req.body.user_id,req.body.pass,req.body.faculty_id,req.body.access_level
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/login/:user_id_id', (req, res) => {
    let query = 'DELETE FROM login WHERE user_id= '+con.escape(req.params.user_id_id)+'';

    query_db_delete(query, res)
});

//***MEETS***
//view
app.get('/v2/meets', (req, res) => {
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
});
//add
app.post('/v2/meets', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO meets (dept_code,class_num,section_num,semester,draft,building_code,room_num,time_id) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.building_code,req.body.room_num,req.body.time_id]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/meets/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:building_code_id/:room_num_id/:time_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE meets SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), time_id = COALESCE(?,time_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.building_code,req.body.room_num,req.body.time_id
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/meets/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:building_code_id/:room_num_id/:time_id_id', (req, res) => {
    let query = 'DELETE FROM meets WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

    query_db_delete(query, res)
});

//***ROOM***
//view
app.get('/v2/room', (req, res) => {
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
});
//add
app.post('/v2/room', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO room (building_code,room_num,capacity) VALUES ?";
    data = [
        [req.body.building_code,req.body.room_num,req.body.capacity]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/room/:building_code_id/:room_num_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE room SET building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), capacity = COALESCE(?,capacity) WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+'';

    data = [
        req.body.building_code,req.body.room_num,req.body.capacity
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/room/:building_code_id/:room_num_id', (req, res) => {
    let query = 'DELETE FROM room WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+'';

    query_db_delete(query, res)
});

//***ROOM_FEATURE***
//view
app.get('/v2/room_feature', (req, res) => {
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
});
//add
app.post('/v2/room_feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO room_feature (building_code,room_num,feature_id) VALUES ?";
    data = [
        [req.body.building_code,req.body.room_num,req.body.feature_id]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/room_feature/:building_code_id/:room_num_id/:feature_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE room_feature SET building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), feature_id = COALESCE(?,feature_id) WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    data = [
        req.body.building_code,req.body.room_num,req.body.feature_id
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/room_feature/:building_code_id/:room_num_id/:feature_id_id', (req, res) => {
    let query = 'DELETE FROM room_feature WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    query_db_delete(query, res)
});

//***SECTION***
//view
app.get('/v2/section', (req, res) => {
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
});
//add
app.post('/v2/section', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO section (dept_code,class_num,section_num,semester,draft,capacity) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.capacity]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/section/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE section SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), capacity = COALESCE(?,capacity) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.capacity
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/section/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id', (req, res) => {
    let query = 'DELETE FROM section WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+'';

    query_db_delete(query, res)
});

//***TEACHES***
//view
app.get('/v2/teaches', (req, res) => {
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
});
//add
app.post('/v2/teaches', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO teaches (dept_code,class_num,section_num,semester,draft,faculty_id) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.faculty_id]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/teaches/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:faculty_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE teaches SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), faculty_id = COALESCE(?,faculty_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND faculty_id= '+con.escape(req.params.faculty_id_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.faculty_id
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/teaches/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:faculty_id_id', (req, res) => {
    let query = 'DELETE FROM teaches WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND faculty_id= '+con.escape(req.params.faculty_id_id)+'';

    query_db_delete(query, res)
});

//***TIMESLOT***
//view
app.get('/v2/timeslot', (req, res) => {
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
});
//add
app.post('/v2/timeslot', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO timeslot (time_id,day_of_week,time_start,time_end) VALUES ?";
    data = [
        [req.body.time_id,req.body.day_of_week,req.body.time_start,req.body.time_end]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/timeslot/:time_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE timeslot SET time_id = COALESCE(?,time_id), day_of_week = COALESCE(?,day_of_week), time_start = COALESCE(?,time_start), time_end = COALESCE(?,time_end) WHERE time_id= '+con.escape(req.params.time_id_id)+'';

    data = [
        req.body.time_id,req.body.day_of_week,req.body.time_start,req.body.time_end
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/timeslot/:time_id_id', (req, res) => {
    let query = 'DELETE FROM timeslot WHERE time_id= '+con.escape(req.params.time_id_id)+'';

    query_db_delete(query, res)
});

//***TITLE***
//view
app.get('/v2/title', async (req, res) => {
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
    output = await query_db_get(query, res)
    .catch(() => {throw ("Bad Request throw")})
    .then((results) => {
      res.status(200).send(results);
    });
});
//add
app.post('/v2/title', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO title (title_id,title_name,max_load) VALUES ?";
    data = [
        [req.body.title_id,req.body.title_name,req.body.max_load]
    ]
    
    query_db_add(query, data, res)
});
//update
app.put('/v2/title/:title_id_id', (req, res) => {

    //console.log(req.body)
    let query = 'UPDATE title SET title_id = COALESCE(?,title_id), title_name = COALESCE(?,title_name), max_load = COALESCE(?,max_load) WHERE title_id= '+con.escape(req.params.title_id_id)+'';

    data = [
        req.body.title_id,req.body.title_name,req.body.max_load
    ]
    
    query_db_put(query, data, res)
});
//delete
app.delete('/v2/title/:title_id_id', (req, res) => {
    let query = 'DELETE FROM title WHERE title_id= '+con.escape(req.params.title_id_id)+'';

    query_db_delete(query, res)
});

    // query database
function query_db_get(query, res){
    return new Promise( (resolve, reject) => {
      con.query(query, (err, result) => {
          if (err) {
            console.log(err.message);
          } else {
            resolve(result)
          }
      });
    })
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
    console.log(query,data)
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


//***LOGIN***
var MIN_PASSWORD_LENGTH = 8;
var MAX_PASSWORD_LENGTH = 160;
var users = {};
//create users
app.post('/v2/signup', (req, res) => {

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
      query_db_add("insert into login values ?",[[req.body.username, hash, 101104523, access_level=1]],res)
    });
  });
});
//login
app.post('/v2/login', async function (req, res) {
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


async function get_pass(query,res){
  console.log("getpass: ",query)
  let result = await query_login(query,res)
  console.log("RESULT: ",result)
  return result
}

module.exports = app;