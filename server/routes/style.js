var router = require('express').Router();
var request = require('request');
var Style = require('../../models/styleModel');

// router.get('/apod', function(req, res){
//   request('https://api.nasa.gov/planetary/apod?api_key=vRkyBLgP6BandXIDG4D5Fr0Ppub3dUBToDPyotMR', function(err, response, body){
//     if (err){
//       console.log('Error getting APOD:', err);
//       res.sendStatus(500);
//     } else {
//       console.log('Got APOD:', response);
//       res.send(body);
//     }
//   });
// });

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
        styleObject.background = 'url(\'' + jsBody.url + '\') center/cover no-repeat';
        updateStyle(res, styleObject);
      }
    });
  } else {
    updateStyle(res, styleObject);
  }

  // remove old style
  // Style.find({}, function(err, styles){
  //   if (err){
  //     console.log('Error finding styles to remove:', err);
  //   } else {
  //     console.log('Found styles to remove:', styles);
  //     if (styles.length > 0){
  //       styles[0].remove(function(err){
  //         if (err){
  //           console.log('Error removing styles:', err);
  //         }
  //       });
  //     }
  //
  //     // create new style
  //     Style.create(styleObject, function(err){
  //       if (err){
  //         console.log('Error saving styles:', err);
  //         res.sendStatus(500);
  //       } else {
  //         console.log('Styles saved successfully.');
  //         res.sendStatus(200);
  //       }
  //     });
  //   }
  // }); // should use put instead and update the thing
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
