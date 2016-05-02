// node modules
var express = require('express');

// custom modules
var index = require('./routes/index');

var app = express();

// config
app.use(express.static('server/public'));


// routes
app.use('/', index);

// server
var server = app.listen(3000, function(){
  var port = server.address().port;
  console.log('Server is listening on port ' + port + '...\nPress Ctrl + c to quit');
});
