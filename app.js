var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');


/* Set globals */
if (process.env.NODE_ENV === 'production') {
  global.myAppVars.server = process.env.APP_URL;
}
else {
  global.myAppVars.server = "http://localhost:3000";
}

// Set auto email configuration
global.myAppVars.TWN_GOOGLE_CLIENT_ID = process.env.TWN_GOOGLE_CLIENT_ID;
global.myAppVars.TWN_GOOGLE_CLIENT_SECRET = process.env.TWN_GOOGLE_CLIENT_SECRET;
global.myAppVars.TWN_GOOGLE_REFRESH_TOKEN = process.env.TWN_GOOGLE_REFRESH_TOKEN;
global.myAppVars.TWN_GOOGLE_ACCESS_TOKEN = process.env.TWN_GOOGLE_ACCESS_TOKEN;
global.myAppVars.TWN_EMAIL_ADMIN = process.env.TWN_EMAIL_ADMIN;
global.myAppVars.TWN_EMAIL_BOT = process.env.TWN_EMAIL_BOT;
global.myAppVars.TWN_EMAIL_BOT_USERNAME = global.myAppVars.TWN_EMAIL_BOT.substring(0, global.myAppVars.TWN_EMAIL_BOT.lastIndexOf("@"));
global.myAppVars.TWN_EMAIL_DEVELOPER = process.env.TWN_EMAIL_DEVELOPER;

/* Connect to database */
require('./app_api/models/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var banquet0818Router = require('./routes/banquet0818');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/banquet0818', banquet0818Router);

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

module.exports = app;
