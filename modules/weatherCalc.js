function assignAttire(conditionObject){
  conditionObject.umbrella = false;
  conditionObject.shorts = false;
  conditionObject.pants = false;
  conditionObject.jacket = false;
  conditionObject.mittens = false;
  conditionObject.tshirt = false;

  // umbrella
  if(conditionObject.precipToday > 1){
    conditionObject.umbrella = true;
  }

  // mittens
  if(conditionObject.temp <= 40){
    conditionObject.mittens = true;
  }

  // shorts or pants
  if(conditionObject.temp >= 70){
    conditionObject.shorts = true;
  } else {
    conditionObject.pants = true;
  }

  // jacket or tshirt
  if (conditionObject.temp >= 60){
    conditionObject.tshirt = true;
  } else {
    conditionObject.jacket = true;
  }

}


function dayOrNight(currentTime, conditionObject){
  if(currentTime >= conditionObject.sunrise){
    if(currentTime <= conditionObject.sunset){
      return 'day';
    } else {
      return 'night';
    }
  } else if (currentTime <= conditionObject.sunrise){
    return 'night';
  }
}

function assignIconURL(dayOrNight, condition){
  var iconURL = 'assets/images/weather/';
  if (dayOrNight === 'night'){
    switch(condition){
      case 'Chance of Flurries':
        iconURL += 'simple_weather_icon_34.png';
        break;
      case 'Chance of Rain':
        iconURL += 'simple_weather_icon_31.png';
        break;
      case 'Chance of Sleet':
        iconURL += 'simple_weather_icon_33.png';
        break;
      case 'Chance of Snow':
        iconURL += 'simple_weather_icon_35.png';
        break;
      case 'Chance of Thunderstorm':
        iconURL += 'simple_weather_icon_37.png';
        break;
      case 'Clear':
        iconURL += 'simple_weather_icon_02.png';
        break;
      case 'Cloudy':
        iconURL += 'simple_weather_icon_04.png';
        break;
      case 'Overcast':
        iconURL += 'simple_weather_icon_04.png';
        break;
      case 'Flurries':
        iconURL += 'simple_weather_icon_24.png';
        break;
      case 'Hazy':
        iconURL += 'simple_weather_icon_10.png';
        break;
      case 'Mostly Cloudy':
        iconURL += 'simple_weather_icon_07.png';
        break;
      case 'Partly Cloudy':
        iconURL += 'simple_weather_icon_07.png';
        break;
      case 'Rain':
        iconURL += 'simple_weather_icon_22.png';
        break;
      case 'Sleet':
        iconURL += 'simple_weather_icon_23.png';
        break;
      case 'Snow':
        iconURL += 'simple_weather_icon_25.png';
        break;
      case 'Thunderstorm':
        iconURL += 'simple_weather_icon_27.png';
        break;
    }
  } else {
    switch(condition){
      case 'Chance of Flurries':
        iconURL += 'simple_weather_icon_14.png';
        break;
      case 'Chance of Rain':
        iconURL += 'simple_weather_icon_11.png';
        break;
      case 'Chance of Sleet':
        iconURL += 'simple_weather_icon_13.png';
        break;
      case 'Chance of Snow':
        iconURL += 'simple_weather_icon_15.png';
        break;
      case 'Chance of Thunderstorm':
        iconURL += 'simple_weather_icon_17.png';
        break;
      case 'Clear':
        iconURL += 'simple_weather_icon_01.png';
        break;
      case 'Cloudy':
        iconURL += 'simple_weather_icon_04.png';
        break;
      case 'Overcast':
        iconURL += 'simple_weather_icon_04.png';
        break;
      case 'Flurries':
        iconURL += 'simple_weather_icon_24.png';
        break;
      case 'Hazy':
        iconURL += 'simple_weather_icon_10.png';
        break;
      case 'Mostly Cloudy':
        iconURL += 'simple_weather_icon_03.png';
        break;
      case 'Partly Cloudy':
        iconURL += 'simple_weather_icon_03.png';
        break;
      case 'Mostly Sunny':
        iconURL += 'simple_weather_icon_03.png';
        break;
      case 'Partly Sunny':
        iconURL += 'simple_weather_icon_03.png';
        break;
      case 'Rain':
        iconURL += 'simple_weather_icon_22.png';
        break;
      case 'Sleet':
        iconURL += 'simple_weather_icon_23.png';
        break;
      case 'Snow':
        iconURL += 'simple_weather_icon_25.png';
        break;
      case 'Thunderstorm':
        iconURL += 'simple_weather_icon_27.png';
        break;
      case 'Sunny':
        iconURL += 'simple_weather_icon_01.png';
        break;
    }
  }
  return iconURL;
}





module.exports.dayOrNight = dayOrNight;
module.exports.assignIconURL = assignIconURL;
module.exports.assignAttire = assignAttire;
