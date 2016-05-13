var router = require('express').Router();
var request = require('request');
var moment = require('moment');
var fs = require('fs');

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
      // console.log('Found styles:', styles);
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
  if(styles.useAPOD){
    applicableFields.$set.useAPOD = styles.useAPOD;
  }
  // if(styles.title){
    applicableFields.$set.title = styles.title;
  // }
  // if(styles.explanation){
    applicableFields.$set.explanation = styles.explanation;
  // }

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
  var apodKey = process.env.apodKey;
  var apodBaseURL = 'https://api.nasa.gov/planetary/apod?hd=true&api_key=' + apodKey;
  if(styleObject.useAPOD && apodDate){
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
          saveAPOD(jsBody.hdurl, styleObject);
          styleObject.background = 'url(\'' + jsBody.hdurl + '\') center/cover no-repeat';
          styleObject.title = jsBody.title;
          styleObject.explanation = jsBody.explanation;
          updateStyle(res, styleObject);
        }
      }

    });
  } else if (styleObject.useAPOD) {
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
          saveAPOD(jsBody.hdurl, styleObject);
          styleObject.background = 'url(\'' + jsBody.hdurl + '\') center/cover no-repeat';
          styleObject.title = jsBody.title;
          styleObject.explanation = jsBody.explanation;
          updateStyle(res, styleObject);
        }
      }

    });
  } else {
    styleObject.title = '';
    styleObject.explanation = '';
    updateStyle(res, styleObject);
  }
};

var saveAPOD = function(url, style){
  request.get({url: url, encoding: 'binary'}, function(err, response, body){
    var imageName = url.split('/').pop();
    // style.imageName = imageName;
    var imagePath = './server/public/assets/images/apod/' + imageName;

    console.log('image body', imagePath);
    var stats = fs.lstat(imagePath, function(err, stat){
      if (!err){
        console.log('File exists.');
      } else if (err.code == 'ENOENT'){
        console.log('File doesn\'t exist, should write file.');
        fs.writeFile(imagePath, body, 'binary', function(err){
          if (err){
            console.log('Saving APOD failed:', err);
          } else {
            console.log('Saved APOD successfully.');
            style.background = 'url(\'./server/public/assets/images/apod/' + imageName + '\') center/cover no-repeat';
          }
        });
      } else {
        console.log('Error accessing path:', err);
      }
    });


  });
}

module.exports = router;
