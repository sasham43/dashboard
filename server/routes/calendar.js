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

// var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, 'https://www.googleapis.com/auth/calendar', null);
// var calendar = google.calendar('v3');

var today = moment().format();
var tomorrow = moment().add(1, 'day').format();


router.get('/', function(req, res){
  // jwtClient.authorize(function(err, tokens) {
  //   if (err) {
  //     console.log('Error authorizing Google Calendar:', err);
  //     return;
  //   }
  //
  //   // Make an authorized request to list google calendar
  //   calendar.events.list({ auth: jwtClient, calendarId: 'sashasemail@gmail.com', timeMin: today, maxResults: 10}, function(err, response) {
  //     // handle err and response
  //     if (err){
  //       console.log('Error getting events new style:', err);
  //     } else {
  //       console.log('Retrieved events from Google.', response.items);
  //       var events = response.items;
  //       var trimmedEvents = [];
  //       // loop through and pick off the properties we want
  //       events.map(function(event){
  //         var title = event.summary;
  //         var start = event.start.dateTime;
  //         var end = event.end.dateTime;
  //         var trimmedEvent = {title: title, start: start, end: end};
  //         trimmedEvents.push(trimmedEvent);
  //       });
  //       res.send(trimmedEvents);
  //     }
  //   });
  // });

  var dummyCalendar = [
  { kind: 'calendar#event',
    etag: '"2929444782210000"',
    id: '74t1eha0os216hddkt72vr1cng',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=NzR0MWVoYTBvczIxNmhkZGt0NzJ2cjFjbmdfMjAxNjA1MjNUMTcwMDAwWiBzYXNoYXNlbWFpbEBt',
    created: '2016-05-10T18:45:58.000Z',
    updated: '2016-05-31T19:19:51.105Z',
    summary: 'Android Study Group',
    description: 'http://www.meetup.com/Women-Who-Code-Twin-Cities/events/230470360/ \n\nRichard Banasiak -- a Senior Software Engineer at the Nerdery -- will be leading an Android Study Group at Prime Academy. His events will occur every other week (opposite the iOS Study Group\'s schedule). Every Monday over lunch, there will be an opportunity to learn more about Mobile Development at Prime! \n\nIf you attended the GDGTC\'s Android Study Jam, this will be a great opportunity to continue learning and get your questions answered.\n\nNo Android development experience necessary.',
    location: 'Prime Digital Academy, 9401 James Ave S #152, Bloomington, MN 55431, United States',
    creator: { email: 'taylor@primeacademy.io' },
    organizer:
     { email: 'primeacademy.io_8fjvcq33sna59fe2iheo5r3opc@group.calendar.google.com',
       displayName: 'Prime Events' },
    start:
     { dateTime: '2016-05-23T12:00:00-05:00',
       timeZone: 'America/Chicago' },
    end:
     { dateTime: '2016-05-23T13:00:00-05:00',
       timeZone: 'America/Chicago' },
    recurrence: [ 'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO' ],
    iCalUID: '74t1eha0os216hddkt72vr1cng@google.com',
    sequence: 0,
    attendees: [ [Object], [Object], [Object], [Object], [Object] ],
    reminders: { useDefault: true } },
  { kind: 'calendar#event',
    etag: '"2929444785192000"',
    id: 'f5up4itqnqprso63idsd22k51k_R20160516T170000',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=ZjV1cDRpdHFucXByc282M2lkc2QyMms1MWtfUjIwMTYwNTE2VDE3MDAwMF8yMDE2MDUxNlQxNzAwMDBaIHNhc2hhc2VtYWlsQG0',
    created: '2016-04-05T14:36:18.000Z',
    updated: '2016-05-31T19:19:52.596Z',
    summary: 'iOS Study Group',
    description: 'http://www.meetup.com/Women-Who-Code-Twin-Cities/events/230150450/\n\nThe iOS Study Group meets bi-weekly to help developers learn how to develop native mobile applications for Apple\'s suite of products, including iPhone, iPad, iPod, Apple TV and Apple Watch.',
    location: 'Prime Digital Academy, 9401 James Ave S #152, Bloomington, MN 55431, United States',
    creator: { email: 'taylor@primeacademy.io' },
    organizer:
     { email: 'primeacademy.io_8fjvcq33sna59fe2iheo5r3opc@group.calendar.google.com',
       displayName: 'Prime Events' },
    start:
     { dateTime: '2016-05-16T12:00:00-05:00',
       timeZone: 'America/Chicago' },
    end:
     { dateTime: '2016-05-16T13:00:00-05:00',
       timeZone: 'America/Chicago' },
    recurrence: [ 'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO' ],
    iCalUID: 'f5up4itqnqprso63idsd22k51k_R20160516T170000@google.com',
    sequence: 0,
    attendees: [ [Object], [Object], [Object], [Object] ],
    reminders: { useDefault: true } },
  { kind: 'calendar#event',
    etag: '"2929444786958000"',
    id: 'diub8nsp1hn5m7ft0l0u1ampk4',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=ZGl1Yjhuc3AxaG41bTdmdDBsMHUxYW1wazRfMjAxNjA0MDZUMTQwMDAwWiBzYXNoYXNlbWFpbEBt',
    created: '2016-04-04T15:25:37.000Z',
    updated: '2016-05-31T19:19:53.479Z',
    summary: 'Alum Scrum',
    description: '9:00 - Chatting\n9:30 - Stand Up\n10:00 - Code and/or apply for jobs',
    location: 'Prime Digital Academy, 9401 James Ave S #152, Bloomington, MN 55431, United States',
    creator: { email: 'taylor@primeacademy.io' },
    organizer:
     { email: 'primeacademy.io_8fjvcq33sna59fe2iheo5r3opc@group.calendar.google.com',
       displayName: 'Prime Events' },
    start:
     { dateTime: '2016-04-06T09:00:00-05:00',
       timeZone: 'America/Chicago' },
    end:
     { dateTime: '2016-04-06T10:30:00-05:00',
       timeZone: 'America/Chicago' },
    recurrence: [ 'RRULE:FREQ=WEEKLY;BYDAY=WE' ],
    iCalUID: 'diub8nsp1hn5m7ft0l0u1ampk4@google.com',
    sequence: 0,
    attendees: [ [Object], [Object], [Object] ],
    reminders: { useDefault: true } },
  { kind: 'calendar#event',
    etag: '"2929444786958000"',
    id: 'diub8nsp1hn5m7ft0l0u1ampk4_20160720T140000Z',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=ZGl1Yjhuc3AxaG41bTdmdDBsMHUxYW1wazRfMjAxNjA3MjBUMTQwMDAwWiBzYXNoYXNlbWFpbEBt',
    created: '2016-04-04T15:25:37.000Z',
    updated: '2016-05-31T19:19:53.479Z',
    summary: 'Alum Scrum',
    description: '9:00 - Chatting\n9:30 - Stand Up\n10:00 - Code and/or apply for jobs',
    location: 'Prime Digital Academy, 9401 James Ave S #152, Bloomington, MN 55431, United States',
    creator: { email: 'taylor@primeacademy.io' },
    organizer:
     { email: 'primeacademy.io_8fjvcq33sna59fe2iheo5r3opc@group.calendar.google.com',
       displayName: 'Prime Events' },
    start: { dateTime: '2016-07-20T09:00:00-05:00' },
    end: { dateTime: '2016-07-20T10:30:00-05:00' },
    recurringEventId: 'diub8nsp1hn5m7ft0l0u1ampk4',
    originalStartTime: { dateTime: '2016-07-20T09:00:00-05:00' },
    iCalUID: 'diub8nsp1hn5m7ft0l0u1ampk4@google.com',
    sequence: 0,
    attendees: [ [Object], [Object], [Object] ],
    reminders: { useDefault: true } },
  { kind: 'calendar#event',
    etag: '"2929493817452000"',
    id: '96933ft1b15jul99s6ufn8d4ag',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=OTY5MzNmdDFiMTVqdWw5OXM2dWZuOGQ0YWcgc2FzaGFzZW1haWxAbQ',
    created: '2016-03-17T16:50:40.000Z',
    updated: '2016-06-01T02:08:28.726Z',
    summary: 'Lambda Graduation',
    location: 'Prime Digital Academy, 9401 James Ave S #152, Bloomington, MN 55431, United States',
    creator: { email: 'taylor@primeacademy.io' },
    organizer: { email: 'taylor@primeacademy.io' },
    start: { dateTime: '2016-06-10T15:00:00-05:00' },
    end: { dateTime: '2016-06-10T16:00:00-05:00' },
    iCalUID: '96933ft1b15jul99s6ufn8d4ag@google.com',
    sequence: 0,
    attendees: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    reminders: { useDefault: true } },
  { kind: 'calendar#event',
    etag: '"2929629030634000"',
    id: 'dgqp3c4bclvco1eapitc4mg1j4',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=ZGdxcDNjNGJjbHZjbzFlYXBpdGM0bWcxajQgc2FzaGFzZW1haWxAbQ',
    created: '2016-05-20T19:46:35.000Z',
    updated: '2016-06-01T20:55:15.317Z',
    summary: 'Speaker slot (Bobbilee Hartman)',
    location: 'Prime Digital Academy, 9401 James Ave S., Suite 152, Bloomington, MN 55431',
    creator:
     { email: 'primeacademy.io_8fjvcq33sna59fe2iheo5r3opc@group.calendar.google.com',
       displayName: 'Prime Events' },
    organizer:
     { email: 'primeacademy.io_8fjvcq33sna59fe2iheo5r3opc@group.calendar.google.com',
       displayName: 'Prime Events' },
    start: { dateTime: '2016-06-09T15:00:00-05:00' },
    end: { dateTime: '2016-06-09T16:00:00-05:00' },
    iCalUID: 'dgqp3c4bclvco1eapitc4mg1j4@google.com',
    sequence: 0,
    attendees:
     [ [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object],
       [Object] ],
    reminders: { useDefault: true } },
  { kind: 'calendar#event',
    etag: '"2929786970400000"',
    id: '74t1eha0os216hddkt72vr1cng_20160606T170000Z',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=NzR0MWVoYTBvczIxNmhkZGt0NzJ2cjFjbmdfMjAxNjA2MDZUMTcwMDAwWiBzYXNoYXNlbWFpbEBt',
    created: '2016-05-10T18:45:58.000Z',
    updated: '2016-06-02T18:51:25.200Z',
    summary: 'Android Study Group',
    description: 'http://www.meetup.com/Women-Who-Code-Twin-Cities/events/230470360/ \n\nRichard Banasiak -- a Senior Software Engineer at the Nerdery -- will be leading an Android Study Group at Prime Academy. His events will occur every other week (opposite the iOS Study Group\'s schedule). Every Monday over lunch, there will be an opportunity to learn more about Mobile Development at Prime! \n\nIf you attended the GDGTC\'s Android Study Jam, this will be a great opportunity to continue learning and get your questions answered.\n\nNo Android development experience necessary.',
    location: 'Prime Digital Academy, 9401 James Ave S #152, Bloomington, MN 55431, United States',
    creator: { email: 'taylor@primeacademy.io' },
    organizer:
     { email: 'primeacademy.io_8fjvcq33sna59fe2iheo5r3opc@group.calendar.google.com',
       displayName: 'Prime Events' },
    start: { dateTime: '2016-06-06T12:00:00-05:00' },
    end: { dateTime: '2016-06-06T13:00:00-05:00' },
    recurringEventId: '74t1eha0os216hddkt72vr1cng',
    originalStartTime: { dateTime: '2016-06-06T12:00:00-05:00' },
    iCalUID: '74t1eha0os216hddkt72vr1cng@google.com',
    sequence: 0,
    attendees: [ [Object], [Object], [Object], [Object], [Object] ],
    reminders: { useDefault: true } },
  { kind: 'calendar#event',
    etag: '"2929796053520000"',
    id: 'diub8nsp1hn5m7ft0l0u1ampk4_20160608T140000Z',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=ZGl1Yjhuc3AxaG41bTdmdDBsMHUxYW1wazRfMjAxNjA2MDhUMTQwMDAwWiBzYXNoYXNlbWFpbEBt',
    created: '2016-04-04T15:25:37.000Z',
    updated: '2016-06-02T20:07:06.760Z',
    summary: 'Alum Scrum',
    description: '9:00 - Chatting\n9:30 - Stand Up\n10:00 - Code and/or apply for jobs',
    location: 'Prime Digital Academy, 9401 James Ave S #152, Bloomington, MN 55431, United States',
    creator: { email: 'taylor@primeacademy.io' },
    organizer:
     { email: 'primeacademy.io_8fjvcq33sna59fe2iheo5r3opc@group.calendar.google.com',
       displayName: 'Prime Events' },
    start: { dateTime: '2016-06-08T09:00:00-05:00' },
    end: { dateTime: '2016-06-08T10:30:00-05:00' },
    recurringEventId: 'diub8nsp1hn5m7ft0l0u1ampk4',
    originalStartTime: { dateTime: '2016-06-08T09:00:00-05:00' },
    iCalUID: 'diub8nsp1hn5m7ft0l0u1ampk4@google.com',
    sequence: 0,
    attendees: [ [Object], [Object], [Object] ],
    reminders: { useDefault: true } } ];

    // dummyCalendar.map(function(evt){
    //   if(evt.start){
    //     console.log('event . start');
    //   } else {
    //     console.log('this one does not have one:', evt);
    //   }
    // });

    var trimmedEvents = [];
    // loop through and pick off the properties we want
    dummyCalendar.map(function(evt){
      console.log('evt:', evt);
      var title = evt.summary;
      var start = evt.start.dateTime;
      var end = evt.end.dateTime;
      var trimmedEvent = {title: title, start: start, end: end};
      trimmedEvents.push(trimmedEvent);
    });
    res.send(trimmedEvents);

    // res.send(dummyCalendar);

}); // get

module.exports = router;
