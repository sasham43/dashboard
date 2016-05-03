var router = require('express').Router();
var ajax = require('request');
var gcal = require('google-calendar');
var moment = require('moment');
var mongoose = require('mongoose');
var Event = require('../../models/calendarModel');

router.get('/', function(req, res){
  // if no access token, redirect to authentication page
  // if(!req.session.access_token){
  //   console.log('not authenticated, redirecting', req.session);
  //    return res.redirect('/auth');
  // }
  //
  // // create an instance from accessToken
  // var accessToken = req.session.access_token;
  // console.log('accessToken:', accessToken);

  var today = moment().format();
  var tomorrow = moment().add(1, 'day').format();

  gcal('ya29.CjLXAgQGkCIwBCR6dgF0nGDiwdt2TSYs3yutB5nmXMAg7giX3nFzdDaLQ8UKSfz_el3Q8w').events.list('primary', {timeMin: today, timeMax: tomorrow}, function(err, eventList) {
    if (err){
      console.log('err getting events', err);
    } else {
      console.log('got events:', eventList);
      var events = eventList.items;
      var trimmedEvents = [];
      // loop through and store items in database
      events.map(function(event){
        var title = event.summary;
        var start = event.start.dateTime;
        var end = event.end.dateTime;
        var trimmedEvent = {title: title, start: start, end: end};
        Event.create(trimmedEvent, function(err){
          if (err){
            console.log('Error saving event:', err);
          } else {
            console.log('Event saved successfully.');
          }
        });
        trimmedEvents.push(trimmedEvent);
      });
      res.send(trimmedEvents);
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
