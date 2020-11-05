let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let mongoose = require('mongoose');
let session = require('express-session');

let indexRouter = require('./routes/index');


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'thisisansecuritycode',
    saveUninitialized: true,
    resave: true,
    rolling: true,
    cookie: {maxAge: 24 * 60 * 60 * 10000 * 1000}
}));

app.use(function (req, res, next) {
    res.locals.userName = req.session.UserName;
    res.locals.userType = req.session.UserType;
    res.locals.menuItems = req.session.menuItems;
    res.locals.userEmailID = req.session.EmailID;
    next();
});

//Code To Disable Back Button
//Caching disabled for every route
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});


//Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/moodal_app3", function (err) {
    if (err)
        throw err;
    else
        console.log("Connected Successfully");
});

app.use('/', indexRouter);
app.use('/', require('./routes/userRegistrationAndLogIn'));
app.use('/', require('./routes/manageDepartments'));
app.use('/', require('./routes/manageStudents'));
app.use('/', require('./routes/manageTeachers'));
app.use('/', require('./routes/createTest'));
app.use('/', require('./routes/manageTestQuestions'));
app.use('/', require('./routes/attemptTest'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
