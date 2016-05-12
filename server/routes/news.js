var router = require('express').Router();
var request = require('request');

// router.get('/viewed', function(req, res){
//   var queryURL = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/30.json";
//   request(queryURL, function(err, response, body){
//     if (err){
//       console.log('Error retrieving news:', err);
//       res.sendStatus(500);
//     } else {
//       console.log('Got news:', response);
//
//       res.send(body);
//     }
//   });
// });

router.get('/viewed', function(req, res){
  var queryURL = "https://api.nytimes.com/svc/topstories/v2/home.json?api-key=3bc6d1d62ab24311899eadb1aefe0d2f";

  request(queryURL, function(err, response, body){
      if (err){
        console.log('Error retrieving news:', err);
        res.sendStatus(500);
      } else {
        console.log('Got news:', response);
        res.send(body);
      }
  });
});

module.exports = router;

// top stories stuff
// var url = "https://api.nytimes.com/svc/topstories/v2/home.json";
// url += '?' + $.param({
//   'api-key': "3bc6d1d62ab24311899eadb1aefe0d2f"
// });
