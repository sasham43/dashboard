var router = require('express').Router();
var request = require('request');

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
  })
});

module.exports = router;
