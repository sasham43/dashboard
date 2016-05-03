// node modules
var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// custom modules
var index = require('./routes/index');
var auth = require('./routes/auth');
var calendar = require('./routes/calendar');
var nyt = require('./routes/nyt');
var apod = require('./routes/apod');
var weather = require('./routes/weather');
var transit = require('./routes/transit');

var app = express();

// config
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 60000, secure: false}
}));
app.use(passport.initialize());
app.use(passport.session());

// cors ???
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// authentication strategy for google calendar
app.use(express.static('server/public'));
passport.use(new GoogleStrategy({
  clientID: '565721346198-chm4ukasqlt7djrfsq1v153uf6e3d18n.apps.googleusercontent.com',
   clientSecret: 'au1FATiwFoolk-ov_tKHj9hm',
   callbackURL: "http://localhost:3000/auth/callback",
   scope: ['openid', 'email', 'https://www.googleapis.com/auth/calendar']
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
   return done(null, profile);
  }
));

// database
var mongoURI = 'mongodb://localhost/dashboard';
var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
  console.log('Error connecting to database:', err);
});

mongoDB.once('open', function(){
  console.log('Connected to database.');
});


// routes
app.use('/calendar', calendar);
app.use('/auth', auth);
app.use('/', index);


// server
var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('Server is listening on port ' + port + '...\nPress Ctrl + c to quit');
});
