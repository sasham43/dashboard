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

  // delete old location
  // Location.find({}, function(err, location){
  //   if (err){
  //     console.log('Error finding location to remove:', err);
  //   } else {
  //     console.log('location:', location);
  //     // if there is something returned, remove it and add new
  //     if(location.length > 0){
  //       console.log('location.length',location.length);
  //       location[0].remove(function(err){
  //         if (err){
  //           console.log('Error removing old location:', err);
  //         } else {
  //           console.log('Removed old location.');
  //
  //           Location.create(data,function(err){
  //             if(err){
  //               console.log('Error saving new location:', err);
  //               res.sendStatus(500);
  //             } else {
  //               console.log('Saved new location succesfully.');
  //               res.sendStatus(200);
  //             }
  //           });
  //         }
  //       }); // remove
  //     } else {
  //       Location.create(data,function(err){
  //         if(err){
  //           console.log('Error saving new location:', err);
  //           res.sendStatus(500);
  //         } else {
  //           console.log('Saved new location succesfully.');
  //           res.sendStatus(200);
  //         }
  //       });
  //     }
  //   }
  // });
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
