
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
app.get('/building', (req, res) => {
    let query = "SELECT * FROM building";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/building', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO building (building_code,building_name) VALUES ?";
    data = [
        [req.body.building_code,req.body.building_name]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/building/:building_code_id', (req, res) => {
    let query = 'DELETE FROM building WHERE building_code= '+con.escape(req.params.building_code_id)+'';

    query_db(query, res)
});
//update
app.put('/building/:building_code_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE building SET building_code = COALESCE(?,building_code), building_name = COALESCE(?,building_name) WHERE building_code= '+con.escape(req.params.building_code_id)+'';

    data = [
        req.body.building_code,req.body.building_name
    ]
    
query_db_data(query, data, res)
});

//***CLASS***
//view
app.get('/class', (req, res) => {
    let query = "SELECT * FROM class";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/class', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO class (dept_code,class_num,class_name) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.class_name]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/class/:dept_code_id/:class_num_id', (req, res) => {
    let query = 'DELETE FROM class WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

    query_db(query, res)
});
//update
app.put('/class/:dept_code_id/:class_num_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE class SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), class_name = COALESCE(?,class_name) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.class_name
    ]
    
query_db_data(query, data, res)
});

//***CLASS_FEATURE***
//view
app.get('/class_feature', (req, res) => {
    let query = "SELECT * FROM class_feature";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/class_feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO class_feature (dept_code,class_num,feature_id) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.feature_id]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/class_feature/:dept_code_id/:class_num_id/:feature_id_id', (req, res) => {
    let query = 'DELETE FROM class_feature WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    query_db(query, res)
});
//update
app.put('/class_feature/:dept_code_id/:class_num_id/:feature_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE class_feature SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), feature_id = COALESCE(?,feature_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.feature_id
    ]
    
query_db_data(query, data, res)
});

//***DEPT***
//view
app.get('/dept', (req, res) => {
    let query = "SELECT * FROM dept";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/dept', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO dept (dept_code,dept_name) VALUES ?";
    data = [
        [req.body.dept_code,req.body.dept_name]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/dept/:dept_code_id', (req, res) => {
    let query = 'DELETE FROM dept WHERE dept_code= '+con.escape(req.params.dept_code_id)+'';

    query_db(query, res)
});
//update
app.put('/dept/:dept_code_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE dept SET dept_code = COALESCE(?,dept_code), dept_name = COALESCE(?,dept_name) WHERE dept_code= '+con.escape(req.params.dept_code_id)+'';

    data = [
        req.body.dept_code,req.body.dept_name
    ]
    
query_db_data(query, data, res)
});

//***FACULTY***
//view
app.get('/faculty', (req, res) => {
    let query = "SELECT * FROM faculty";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/faculty', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty (faculty_id,faculty_first,faculty_last,title_id,prev_load,curr_load) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.faculty_first,req.body.faculty_last,req.body.title_id,req.body.prev_load,req.body.curr_load]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/faculty/:faculty_id_id', (req, res) => {
    let query = 'DELETE FROM faculty WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+'';

    query_db(query, res)
});
//update
app.put('/faculty/:faculty_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE faculty SET faculty_id = COALESCE(?,faculty_id), faculty_first = COALESCE(?,faculty_first), faculty_last = COALESCE(?,faculty_last), title_id = COALESCE(?,title_id), prev_load = COALESCE(?,prev_load), curr_load = COALESCE(?,curr_load) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+'';

    data = [
        req.body.faculty_id,req.body.faculty_first,req.body.faculty_last,req.body.title_id,req.body.prev_load,req.body.curr_load
    ]
    
query_db_data(query, data, res)
});

//***FACULTY_CLASS***
//view
app.get('/faculty_class', (req, res) => {
    let query = "SELECT * FROM faculty_class";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/faculty_class', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_class (faculty_id,dept_code,class_num,pref_level) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.dept_code,req.body.class_num,req.body.pref_level]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/faculty_class/:faculty_id_id/:dept_code_id/:class_num_id', (req, res) => {
    let query = 'DELETE FROM faculty_class WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

    query_db(query, res)
});
//update
app.put('/faculty_class/:faculty_id_id/:dept_code_id/:class_num_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE faculty_class SET faculty_id = COALESCE(?,faculty_id), dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+'';

    data = [
        req.body.faculty_id,req.body.dept_code,req.body.class_num,req.body.pref_level
    ]
    
query_db_data(query, data, res)
});

//***FACULTY_FEATURE***
//view
app.get('/faculty_feature', (req, res) => {
    let query = "SELECT * FROM faculty_feature";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/faculty_feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_feature (faculty_id,feature_id,pref_level) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.feature_id,req.body.pref_level]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/faculty_feature/:faculty_id_id/:feature_id_id', (req, res) => {
    let query = 'DELETE FROM faculty_feature WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    query_db(query, res)
});
//update
app.put('/faculty_feature/:faculty_id_id/:feature_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE faculty_feature SET faculty_id = COALESCE(?,faculty_id), feature_id = COALESCE(?,feature_id), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    data = [
        req.body.faculty_id,req.body.feature_id,req.body.pref_level
    ]
    
query_db_data(query, data, res)
});

//***FACULTY_OTHER_REQUEST***
//view
app.get('/faculty_other_request', (req, res) => {
    let query = "SELECT * FROM faculty_other_request";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/faculty_other_request', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_other_request (faculty_id,request) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.request]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/faculty_other_request/:faculty_id_id/:request_id', (req, res) => {
    let query = 'DELETE FROM faculty_other_request WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND request= '+con.escape(req.params.request_id)+'';

    query_db(query, res)
});
//update
app.put('/faculty_other_request/:faculty_id_id/:request_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE faculty_other_request SET faculty_id = COALESCE(?,faculty_id), request = COALESCE(?,request) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND request= '+con.escape(req.params.request_id)+'';

    data = [
        req.body.faculty_id,req.body.request
    ]
    
query_db_data(query, data, res)
});

//***FACULTY_TIMESLOT***
//view
app.get('/faculty_timeslot', (req, res) => {
    let query = "SELECT * FROM faculty_timeslot";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/faculty_timeslot', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO faculty_timeslot (faculty_id,time_id,pref_level) VALUES ?";
    data = [
        [req.body.faculty_id,req.body.time_id,req.body.pref_level]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/faculty_timeslot/:faculty_id_id/:time_id_id', (req, res) => {
    let query = 'DELETE FROM faculty_timeslot WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

    query_db(query, res)
});
//update
app.put('/faculty_timeslot/:faculty_id_id/:time_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE faculty_timeslot SET faculty_id = COALESCE(?,faculty_id), time_id = COALESCE(?,time_id), pref_level = COALESCE(?,pref_level) WHERE faculty_id= '+con.escape(req.params.faculty_id_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

    data = [
        req.body.faculty_id,req.body.time_id,req.body.pref_level
    ]
    
query_db_data(query, data, res)
});

//***FEATURE***
//view
app.get('/feature', (req, res) => {
    let query = "SELECT * FROM feature";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO feature (feature_id,feature_name) VALUES ?";
    data = [
        [req.body.feature_id,req.body.feature_name]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/feature/:feature_id_id', (req, res) => {
    let query = 'DELETE FROM feature WHERE feature_id= '+con.escape(req.params.feature_id_id)+'';

    query_db(query, res)
});
//update
app.put('/feature/:feature_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE feature SET feature_id = COALESCE(?,feature_id), feature_name = COALESCE(?,feature_name) WHERE feature_id= '+con.escape(req.params.feature_id_id)+'';

    data = [
        req.body.feature_id,req.body.feature_name
    ]
    
query_db_data(query, data, res)
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

    query_db(query, res)
});
//add
app.post('/login', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO login (user_id,pass,faculty_id,access_level) VALUES ?";
    data = [
        [req.body.user_id,req.body.pass,req.body.faculty_id,req.body.access_level]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/login/:user_id_id', (req, res) => {
    let query = 'DELETE FROM login WHERE user_id= '+con.escape(req.params.user_id_id)+'';

    query_db(query, res)
});
//update
app.put('/login/:user_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE login SET user_id = COALESCE(?,user_id), pass = COALESCE(?,pass), faculty_id = COALESCE(?,faculty_id), access_level = COALESCE(?,access_level) WHERE user_id= '+con.escape(req.params.user_id_id)+'';

    data = [
        req.body.user_id,req.body.pass,req.body.faculty_id,req.body.access_level
    ]
    
query_db_data(query, data, res)
});

//***MEETS***
//view
app.get('/meets', (req, res) => {
    let query = "SELECT * FROM meets";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/meets', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO meets (dept_code,class_num,section_num,semester,draft,building_code,room_num,time_id) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.building_code,req.body.room_num,req.body.time_id]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/meets/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:building_code_id/:room_num_id/:time_id_id', (req, res) => {
    let query = 'DELETE FROM meets WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

    query_db(query, res)
});
//update
app.put('/meets/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:building_code_id/:room_num_id/:time_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE meets SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), time_id = COALESCE(?,time_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND time_id= '+con.escape(req.params.time_id_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.building_code,req.body.room_num,req.body.time_id
    ]
    
query_db_data(query, data, res)
});

//***ROOM***
//view
app.get('/room', (req, res) => {
    let query = "SELECT * FROM room";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/room', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO room (building_code,room_num,capacity) VALUES ?";
    data = [
        [req.body.building_code,req.body.room_num,req.body.capacity]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/room/:building_code_id/:room_num_id', (req, res) => {
    let query = 'DELETE FROM room WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+'';

    query_db(query, res)
});
//update
app.put('/room/:building_code_id/:room_num_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE room SET building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), capacity = COALESCE(?,capacity) WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+'';

    data = [
        req.body.building_code,req.body.room_num,req.body.capacity
    ]
    
query_db_data(query, data, res)
});

//***ROOM_FEATURE***
//view
app.get('/room_feature', (req, res) => {
    let query = "SELECT * FROM room_feature";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/room_feature', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO room_feature (building_code,room_num,feature_id) VALUES ?";
    data = [
        [req.body.building_code,req.body.room_num,req.body.feature_id]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/room_feature/:building_code_id/:room_num_id/:feature_id_id', (req, res) => {
    let query = 'DELETE FROM room_feature WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    query_db(query, res)
});
//update
app.put('/room_feature/:building_code_id/:room_num_id/:feature_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE room_feature SET building_code = COALESCE(?,building_code), room_num = COALESCE(?,room_num), feature_id = COALESCE(?,feature_id) WHERE building_code= '+con.escape(req.params.building_code_id)+' AND room_num= '+con.escape(req.params.room_num_id)+' AND feature_id= '+con.escape(req.params.feature_id_id)+'';

    data = [
        req.body.building_code,req.body.room_num,req.body.feature_id
    ]
    
query_db_data(query, data, res)
});

//***SECTION***
//view
app.get('/section', (req, res) => {
    let query = "SELECT * FROM section";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/section', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO section (dept_code,class_num,section_num,semester,draft,capacity) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.capacity]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/section/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id', (req, res) => {
    let query = 'DELETE FROM section WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+'';

    query_db(query, res)
});
//update
app.put('/section/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE section SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), capacity = COALESCE(?,capacity) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.capacity
    ]
    
query_db_data(query, data, res)
});

//***TEACHES***
//view
app.get('/teaches', (req, res) => {
    let query = "SELECT * FROM teaches";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/teaches', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO teaches (dept_code,class_num,section_num,semester,draft,faculty_id) VALUES ?";
    data = [
        [req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.faculty_id]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/teaches/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:faculty_id_id', (req, res) => {
    let query = 'DELETE FROM teaches WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND faculty_id= '+con.escape(req.params.faculty_id_id)+'';

    query_db(query, res)
});
//update
app.put('/teaches/:dept_code_id/:class_num_id/:section_num_id/:semester_id/:draft_id/:faculty_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE teaches SET dept_code = COALESCE(?,dept_code), class_num = COALESCE(?,class_num), section_num = COALESCE(?,section_num), semester = COALESCE(?,semester), draft = COALESCE(?,draft), faculty_id = COALESCE(?,faculty_id) WHERE dept_code= '+con.escape(req.params.dept_code_id)+' AND class_num= '+con.escape(req.params.class_num_id)+' AND section_num= '+con.escape(req.params.section_num_id)+' AND semester= '+con.escape(req.params.semester_id)+' AND draft= '+con.escape(req.params.draft_id)+' AND faculty_id= '+con.escape(req.params.faculty_id_id)+'';

    data = [
        req.body.dept_code,req.body.class_num,req.body.section_num,req.body.semester,req.body.draft,req.body.faculty_id
    ]
    
query_db_data(query, data, res)
});

//***TIMESLOT***
//view
app.get('/timeslot', (req, res) => {
    let query = "SELECT * FROM timeslot";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/timeslot', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO timeslot (time_id,day_of_week,time_start,time_end) VALUES ?";
    data = [
        [req.body.time_id,req.body.day_of_week,req.body.time_start,req.body.time_end]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/timeslot/:time_id_id', (req, res) => {
    let query = 'DELETE FROM timeslot WHERE time_id= '+con.escape(req.params.time_id_id)+'';

    query_db(query, res)
});
//update
app.put('/timeslot/:time_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE timeslot SET time_id = COALESCE(?,time_id), day_of_week = COALESCE(?,day_of_week), time_start = COALESCE(?,time_start), time_end = COALESCE(?,time_end) WHERE time_id= '+con.escape(req.params.time_id_id)+'';

    data = [
        req.body.time_id,req.body.day_of_week,req.body.time_start,req.body.time_end
    ]
    
query_db_data(query, data, res)
});

//***TITLE***
//view
app.get('/title', (req, res) => {
    let query = "SELECT * FROM title";

    query = query + " WHERE 1=1"
        
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

    query_db(query, res)
});
//add
app.post('/title', (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO title (title_id,title_name,max_load) VALUES ?";
    data = [
        [req.body.title_id,req.body.title_name,req.body.max_load]
    ]
    
    query_db_data(query, [data], res)
});
//delete
app.delete('/title/:title_id_id', (req, res) => {
    let query = 'DELETE FROM title WHERE title_id= '+con.escape(req.params.title_id_id)+'';

    query_db(query, res)
});
//update
app.put('/title/:title_id_id', (req, res) => {
    //console.log(req.body)
    let query = 'UPDATE title SET title_id = COALESCE(?,title_id), title_name = COALESCE(?,title_name), max_load = COALESCE(?,max_load) WHERE title_id= '+con.escape(req.params.title_id_id)+'';

    data = [
        req.body.title_id,req.body.title_name,req.body.max_load
    ]
    
query_db_data(query, data, res)
});


    // query database
function query_db(query, res){
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
}

    // query database
function query_db_data(query, data, res){
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
      res.status(200).type('application/json').send(rows);
    }).catch(err => {
      res.status(500).send("Error querying database");
    });
}
module.exports = app;