var router = require('express').Router();
var mongoose = require('mongoose');

var google = require('googleapis');
var moment = require('moment');
var key = require('../../dashboard_private_key.json');
var Event = require('../../models/calendarModel');
// var key = {
//   "type": process.env.type,
//   "project_id": process.env.project_id,
//   "private_key_id": process.env.private_key_id,
//   "private_key": process.env.private_key,
//   "client_email": process.env.client_email,
//   "client_id": process.env.client_id,
//   "auth_uri": process.env.auth_uri,
//   "token_uri": process.env.token_uri,
//   "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
//   "client_x509_cert_url": process.env.client_x509_cert_url
// }

// var key = {
//   type: process.env.type,
//   project_id: process.env.project_id,
//   private_key_id: process.env.private_key_id,
//   private_key: process.env.private_key,
//   client_email: process.env.client_email,
//   client_id: process.env.client_id,
//   auth_uri: process.env.auth_uri,
//   token_uri: process.env.token_uri,
//   auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
//   client_x509_cert_url: process.env.client_x509_cert_url
// }

var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, 'https://www.googleapis.com/auth/calendar', null);
var calendar = google.calendar('v3');

var today = moment().format();
var tomorrow = moment().add(1, 'day').format();


router.get('/', function(req, res){
  jwtClient.authorize(function(err, tokens) {
    if (err) {
      console.log('Error authorizing Google Calendar:', err);
      return;
    }

    // Make an authorized request to list google calendar
    calendar.events.list({ auth: jwtClient, calendarId: 'sashasemail@gmail.com', timeMin: today, maxResults: 10}, function(err, response) {
      // handle err and response
      if (err){
        console.log('Error getting events new style:', err);
      } else {
        console.log('Retrieved events from Google.');
        var events = response.items;
        var trimmedEvents = [];
        // loop through and pick off the properties we want
        events.map(function(event){
          var title = event.summary;
          var start = event.start.dateTime;
          var end = event.end.dateTime;
          var trimmedEvent = {title: title, start: start, end: end};
          trimmedEvents.push(trimmedEvent);
        });
        res.send(trimmedEvents);
      }
    });
  });

}); // get

module.exports = router;
