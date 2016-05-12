var router = require('express').Router();
var request = require('request');
var moment = require('moment');
var Style = require('../../models/styleModel');

router.put('/save', function(req, res){
  var styleObject = req.body;
  console.log('Entered style update route', styleObject);

  getAPOD(res, styleObject, styleObject.apodDate);
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
  if(styles.title){
    applicableFields.$set.title = styles.title;
  }
  if(styles.explanation){
    applicableFields.$set.explanation = styles.explanation;
  }

  Style.findOneAndUpdate({}, applicableFields, function(err, style){
    if(err){
      console.log('Error finding styles to update:', err);
      res.sendStatus(500);
    } else {
      console.log('Updated styles.');
      // console.log('style res:', res);
      res.sendStatus(200);
    }
  });
};

var getAPOD = function(res, styleObject, apodDate){
  var apodKey = 'vRkyBLgP6BandXIDG4D5Fr0Ppub3dUBToDPyotMR';
  var apodInfo = {};
  var apodBaseURL = 'https://api.nasa.gov/planetary/apod?hd=true&api_key=' + apodKey;
  if(apodDate){
    var formattedDate = moment(apodDate).format('YYYY-MM-DD');
    request(apodBaseURL + '&date=' + formattedDate, function(err, response, body){
      if(err){
        console.log('Error getting APOD with date:', err);
      } else {
        console.log('Got APOD.');
        var jsBody = JSON.parse(body);
        if(jsBody.url.includes('youtube.com')){
          var previousDay = moment(apodDate).add(-1, 'day');
          getAPOD(res, styleObject, previousDay);
        } else {
          styleObject.background = 'url(\'' + jsBody.hdurl + '\') center/cover no-repeat';
          styleObject.title = jsBody.title;
          styleObject.explanation = jsBody.explanation;
          updateStyle(res, styleObject, apodInfo);
        }
      }

    });
  } else {
    request(apodBaseURL, function(err, response, body){
      if(err){
        console.log('Error getting APOD.');
      } else {
        console.log('Got APOD.');
        var jsBody = JSON.parse(body);
        if(jsBody.url.includes('youtube.com')){
          var previousDay = moment().add(-1, 'day');
          getAPOD(res, styleObject, previousDay);
        } else {
          styleObject.background = 'url(\'' + jsBody.hdurl + '\') center/cover no-repeat';
          styleObject.title = jsBody.title;
          styleObject.explanation = jsBody.explanation;
          updateStyle(res, styleObject, apodInfo);
        }
      }

    });
  }
};

module.exports = router;
