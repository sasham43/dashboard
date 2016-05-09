var router = require('express').Router();
var request = require('request');

router.get('/viewed', function(req, res){
  var queryURL = "https://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/30.json";
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
