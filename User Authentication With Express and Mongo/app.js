const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const app = express();

// Connect to mongodb
mongoose.connect('mongodb://localhost:27017/bookworm', {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;

//  Use sessions for tracking logins
app.use(session({
  secret: 'Green ideas sleep furiously',
  resave: true,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: db
  })
}));

//  Make user ID available in templates
app.use(function(req, res, next) {
  //response obj has locals property, which provides a way to add info to the res obj
  res.locals.currentUser = req.session.userId;
  next();
});

// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// Include routes
var routes = require('./routes/index');
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Error handler
// Define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
