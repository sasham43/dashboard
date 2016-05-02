var router = require('express').Router();
var ajax = require('request');
var gcal = require('google-calendar');
var moment = require('moment');

router.get('/', function(req, res){
  // if no access token, redirect to authentication page
  if(!req.session.access_token){
    console.log('not authenticated, redirecting', req.session);
     return res.redirect('/auth');
  }

  //Create an instance from accessToken
  var accessToken = req.session.access_token;

  var today = moment().format();
  var tomorrow = new Date();
  var tomorrow = moment().add(1, 'day').format();
  // var working = '2014-08-09T10:57:00-08:00';
  console.log('today', today);
  console.log('tomorrow', tomorrow);

  gcal(accessToken).events.list('primary', {timeMin: today, timeMax: tomorrow}, function(err, calendarList) {
    if (err){
      console.log('err getting events', err);
    } else {
      console.log('got events:', calendarList);
      res.send(calendarList);
    }
  });

});

module.exports = router;


// for ajax reference
// ajax('http://omdbapi.com?t=heat', function(error, response, body){
//   if (error){
//     console.log('AJAX error', error);
//   } else {
//     //console.log('Response', response);
//     console.log('Body', body);
//   }
// });
