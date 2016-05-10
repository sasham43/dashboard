var router = require('express').Router();
var request = require('request');
var moment = require('moment');

var Location = require('../../models/locationModel');
var weather = require('../../modules/weatherCalc');

router.get('/', function(req, res){
  console.log('Weather endpoint reached.');
  var locationObject = {};
  var city = '';
  var state = '';
  var conditionObject = {};
  var hourlyList = [];
  var jsBody;
  Location.find({}, function(err, location){
    if (err){
      console.log('Error retrieving location for weather');
      res.sendStatus(500);
    } else {
      console.log('Retrieved location for weather:', location);
      locationObject = location[0];
      state = locationObject.state;
      city = locationObject.city;
      var weatherQuery = 'http://api.wunderground.com/api/945023da3da01614/astronomy/conditions/hourly/q/' + state + '/' + city + '.json';
      console.log('weatherQuery:', weatherQuery);
      request(weatherQuery, function(err, response, body){
        if (err){
          console.log('Error getting weather data from Weather Underground:', err);
          res.sendStatus(500);
        } else {
          console.log('Got weather data successfully.');
          // parse string to a javascript object
          jsBody = JSON.parse(body);
          // current conditions
          conditionObject.temp = jsBody.current_observation.feelslike_f;
          conditionObject.conditions = jsBody.current_observation.weather;
          conditionObject.windSpeed = jsBody.current_observation.wind_mph; // not currently using this
          conditionObject.precipToday = jsBody.current_observation.precip_today_in;

          // astronomy - sunrise & sunset
          conditionObject.sunrise = Number(jsBody.sun_phase.sunrise.hour);
          conditionObject.sunset = Number(jsBody.sun_phase.sunset.hour);
          var currentTime = moment(jsBody.current_observation.observation_time_rfc822,"ddd, DD MMMM YYYY HH:mm:ss ZZ").format("H");
          conditionObject.dayOrNight = weather.dayOrNight(currentTime, conditionObject);

          // hourly forecast
          var tempArray = []; // for finding high and low
          var dayArray = jsBody.hourly_forecast.slice(0, 24); // limit array to a 24-hour period
          dayArray.map(function(hour){
            var tempTime = hour.FCTTIME.civil;
            var tempCondition = hour.condition;
            var tempTemperature = hour.feelslike.english;
            var tempHour = hour.FCTTIME.hour; // to determine day or night based on sunset
            var dayOrNight = weather.dayOrNight(tempHour, conditionObject);
            var tempIconURL = weather.assignIconURL(dayOrNight, tempCondition);
            var tempObject = {time: tempTime, condition: tempCondition, temperature: tempTemperature, iconURL: tempIconURL};
            hourlyList.push(tempObject);
            tempArray.push(Number(tempTemperature));
          });

          conditionObject.high = Math.max.apply(null,tempArray);
          conditionObject.low = Math.min.apply(null,tempArray);
          conditionObject.iconURL = weather.assignIconURL(conditionObject.dayOrNight, conditionObject.conditions);
          weather.assignAttire(conditionObject, hourlyList);

          var responseObject = {conditionObject, hourlyList};

          res.send(responseObject);
        }
      });
    }
  });

});

module.exports = router;
