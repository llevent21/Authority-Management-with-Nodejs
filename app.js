var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser =require("body-parser");
var passport = require("passport");
var Cors = require("cors");
var config = require("./auth/jwtConfig");

var indexRouter = require('./routes/index');
var membersRouter = require("./routes/members");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('cookie-parser')());
app.use(Cors());

app.use(cookieParser(config.jwt.secret));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use("/members", membersRouter);



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
