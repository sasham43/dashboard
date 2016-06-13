// node modules
require('dotenv').config();
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// custom modules
var index = require('./routes/index');
var calendar = require('./routes/calendar');
var news = require('./routes/news');
var style = require('./routes/style');
var weather = require('./routes/weather');
var transit = require('./routes/transit');
var location = require('./routes/location');

var app = express();

// config
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('server/public'));

// database
var mongoURI = 'mongodb://localhost/dashboard';
var mLabUser = process.env.mLabUser;
var mLabPass = process.env.mLabPass;
// var mongoURI = 'mongodb://' + mLabUser + ':' + mLabPass + '@ds023442.mlab.com:23442/heroku_fqs1jdd6';

var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
  console.log('Error connecting to database:', err);
});

mongoDB.once('open', function(){
  console.log('Connected to database.');
});

// routes
app.use('/calendar', calendar);
app.use('/weather', weather);
app.use('/location', location);
app.use('/transit', transit);
app.use('/style', style);
app.use('/news', news);
app.use('/', index);


// server
var server = app.listen( 3001, function(){
  var port = server.address().port;
  console.log('Server is listening on port ' + port + '...\nPress Ctrl + c to quit');
});
