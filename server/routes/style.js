var router = require('express').Router();
var request = require('request');
var moment = require('moment');
var Style = require('../../models/styleModel');

router.put('/save', function(req, res){
  var styleObject = req.body;
  console.log('Entered style update route', styleObject);

  if(styleObject.useAPOD){
    request('https://api.nasa.gov/planetary/apod?api_key=vRkyBLgP6BandXIDG4D5Fr0Ppub3dUBToDPyotMR', function(err, response, body){
      if (err){
        console.log('Error getting APOD:', err);
        res.sendStatus(500);
      } else {
        console.log('Got APOD:', response);
        var jsBody = JSON.parse(body);
        if(!jsBody.url.includes('youtube.com')){
          styleObject.background = 'url(\'' + jsBody.url + '\') center/cover no-repeat';
        } else {
          var yesterday = moment().add(-1, 'day').format('YYYY-MM-DD');
          request('https://api.nasa.gov/planetary/apod?api_key=vRkyBLgP6BandXIDG4D5Fr0Ppub3dUBToDPyotMR&date=' + yesterday, function(err, response, body){
            if (err){
              console.log('Error getting APOD:', err);
              res.sendStatus(500);
            } else {
              console.log('Got APOD:', response);
              var jsBody = JSON.parse(body);
              styleObject.background = 'url(\'' + jsBody.url + '\') center/cover no-repeat';
            }
          });
        }
        updateStyle(res, styleObject);
      }
    });
  } else {
    updateStyle(res, styleObject);
  }
});

router.get('/all', function(req, res){
  Style.find({}, function(err, styles){
    if (err){
      console.log('Error finding styles:', err);
      res.sendStatus(500);
    } else {
      console.log('Found styles:', styles);
      res.send(styles[0]);
    }
  });
});

var updateStyle = function(res, styles){
  var applicableFields = {$set:{}};

  if (styles.borderColor){
    applicableFields.$set.borderColor = styles.borderColor;
  }
  if (styles.color){
    applicableFields.$set.color = styles.color;
  }
  if(styles.background){
    applicableFields.$set.background = styles.background;
  }

  Style.findOneAndUpdate({}, applicableFields, function(err, style){
    if(err){
      console.log('Error finding styles to update:', err);
      res.sendStatus(500);
    } else {
      console.log('Updated styles.');
      res.sendStatus(200);
    }
  });
};

module.exports = router;
