var router = require('express').Router();
var request = require('request');

var Stop = require('../../models/transitModel');

router.get('/routes', function(req, res){
  var routesQuery = 'http://svc.metrotransit.org/NexTrip/Routes';
  request({
    url: routesQuery,
    headers: {
      "content-type": "application/json"
    }
  }, function(err, response, body){
    if(err){
      console.log('Error getting transit routes:', err);
      res.sendStatus(500);
    } else {
      console.log('Transit route response:', response);
      res.send(body);
    }
  });
});

router.get('/direction/:routeID', function(req, res){
  var routeID = req.params.routeID;
  var cardinalDirection = '';
  var directionQuery = 'http://svc.metrotransit.org/NexTrip/Directions/' + routeID;
  request({
    url: directionQuery,
    headers: {
      "content-type": "application/json"
    }
  }, function(err, response, body){
    if(err){
      console.log('Error getting directions:', err);
      res.sendStatus(500);
    } else {
      console.log('Direction route response:', response);
      var jsBody = JSON.parse(body);
      console.log('jsBody:', jsBody);
      if(jsBody[0].Value === ('4' || '1')){
        console.log('body.Value northSouth', jsBody[0].Value);
        cardinalDirection = 'northSouth';
      } else {
        console.log('body.Value eastWest', jsBody[0].Value)
        cardinalDirection = 'eastWest';
      }
      res.send(cardinalDirection);
    }
  });
});

router.get('/stops/:routeID/:directionID', function(req, res){
  var routeID = req.params.routeID;
  var directionID = req.params.directionID;
  console.log('Getting bus stops:', routeID, directionID);
  var stopQuery = 'http://svc.metrotransit.org/NexTrip/Stops/' + routeID + '/' + directionID;
  request({
    url: stopQuery,
    headers: {
      'content-type': 'application/json'
    }
  }, function(err, response, body){
    if (err){
      console.log('Error getting stops:', err);
      res.sendStatus(500);
    } else {
      // console.log('Stop response:', response);
      res.send(body);
    }
  });
});

router.post('/create', function(req, res){
  console.log('Saving bus stop:', req.body);

  var newStop = req.body;

  Stop.create(newStop, function(err){
    if (err){
      console.log('Error saving bus stop:', err);
      res.sendStatus(500);
    } else {
      console.log('Bus stop saved succesfully.');
      res.sendStatus(200);
    }
  });
});

router.get('/all', function(req, res){
  Stop.find({}, function(err, stops){
    if (err){
      console.log('Error finding saved stops:', err);
      res.sendStatus(500);
    } else {
      console.log('Found saved stops:', stops);
      res.send(stops);
    }
  });
});

router.get('/departure/:routeID/:directionID/:stopID', function(req, res){
  var routeID = req.params.routeID;
  var directionID = req.params.directionID;
  var stopID = req.params.stopID;
  console.log('Getting departure information for the following stop:', routeID, directionID, stopID);

  var departureQuery = 'http://svc.metrotransit.org/NexTrip/' + routeID + '/' + directionID + '/' + stopID;
  request({
    url: departureQuery,
    headers: {
      'content-type': 'application/json'
    }
  }, function(err, response, body){
    if (err){
      console.log('Error retrieving departure information:', err);
      res.sendStatus(500);
    } else {
      console.log('Retrieved departure information:', response);
      // parse body
      var jsBody = JSON.parse(body);
      var regExp = /\d\d\d\d\d\d\d\d\d\d\d\d\d\W\d\d\d\d/;
      var trimmedInfoList = [];
      jsBody.map(function(departure){
        var tempTime = departure.DepartureTime.match(regExp)[0];
        var tempText = departure.DepartureText;
        var tempLng = departure.VehicleLongitude;
        var tempLat = departure.VehicleLatitude;
        var tempObject = {departureText: tempText, departureTime: tempTime, lat: tempLat, lng: tempLng};
        trimmedInfoList.push(tempObject);
      });
      res.send(trimmedInfoList);
    }
  });
});

module.exports = router;
