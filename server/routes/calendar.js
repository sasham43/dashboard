var router = require('express').Router();
var mongoose = require('mongoose');

var google = require('googleapis');
var moment = require('moment');
var key = require('../../dashboard_private_key.json');
var Event = require('../../models/calendarModel');
var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, 'https://www.googleapis.com/auth/calendar', null);
var calendar = google.calendar('v3');

var today = moment().format();
var tomorrow = moment().add(1, 'day').format();


router.get('/', function(req, res){
  jwtClient.authorize(function(err, tokens) {
    if (err) {
      console.log(err);
      return;
    }

    // Make an authorized request to list Drive files.
    calendar.events.list({ auth: jwtClient, calendarId: 'sashasemail@gmail.com', timeMin: today, timeMax: tomorrow }, function(err, response) {
      // handle err and response
      if (err){
        console.log('Error getting events new style:', err);
      } else {
        console.log('Retrieved events from Google.');
        var events = response.items;
        var trimmedEvents = [];
        // loop through and store items in database
        events.map(function(event){
          var title = event.summary;
          var start = event.start.dateTime;
          var end = event.end.dateTime;
          var trimmedEvent = {title: title, start: start, end: end};
          trimmedEvents.push(trimmedEvent);
          // Event.create(trimmedEvent, function(err){
          //   if (err){
          //     console.log('Error saving event:', err);
          //   } else {
          //     console.log('Event saved successfully.');
          //   }
          // });

        });
        res.send(trimmedEvents);
      }
    });
  });

}); // get

module.exports = router;
