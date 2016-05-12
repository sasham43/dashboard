var router = require('express').Router();

var Location = require('../../models/locationModel');

router.post('/', function(req, res){
  var data = req.body;

  Location.findOneAndUpdate({}, data, function(err, body){
    if(err){
      console.log('Error updating location:', err);
      res.sendStatus(500);
    } else {
      console.log('Updated location.');
      res.sendStatus(200);
    }
  });
});

router.get('/', function(req, res){
  Location.find({}, function(err, locations){
    if (err){
      console.log('Error getting location:', err);
      res.sendStatus(500);
    } else {
      console.log('Got locations:', locations);
      res.send(locations[0]);
    }
  });
});

module.exports = router;
