var router = require('express').Router();

var Location = require('../../models/locationModel');

router.post('/', function(req, res){
  var data = req.body;

  // delete old location
  Location.find({}, function(err, location){
    if (err){
      console.log('Error finding location to remove:', err);
    } else {
      console.log('location:', location);
      // if there is something returned, remove it and add new
      if(location.length > 0){
        console.log('location.length',location.length);
        location[0].remove(function(err){
          if (err){
            console.log('Error removing old location:', err);
          } else {
            console.log('Removed old location.');

            Location.create(data,function(err){
              if(err){
                console.log('Error saving new location:', err);
                res.sendStatus(500);
              } else {
                console.log('Saved new location succesfully.');
                res.sendStatus(200);
              }
            });
          }
        }); // remove
      } else {
        Location.create(data,function(err){
          if(err){
            console.log('Error saving new location:', err);
            res.sendStatus(500);
          } else {
            console.log('Saved new location succesfully.');
            res.sendStatus(200);
          }
        });
      }
    }
  });


});

module.exports = router;
