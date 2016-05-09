var app = angular.module('dashboardApp', ['ngRoute', 'ngMap', 'ngAnimate']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'HomeController',
      controllerAs: 'hc'
    })
    .when('/settings', {
      templateUrl: '/views/settings.html',
      controller: 'SettingsController',
      controllerAs: 'sc'
    });

  $locationProvider.html5Mode(true);
}]);

/////////////////////////////////////////////
//    Index Controller
/////////////////////////////////////////////

app.controller('IndexController', ['StyleService', function(StyleService){
  var ic = this;

  ic.selectedStyle = StyleService.savedStyles;

  ic.showView = false;

  ic.fadeViewIn = function(){
    console.log('Faded in');
    ic.class = 'fadedIn';
    ic.showView = true;
  };

  ic.fadeViewOut = function(){
    console.log('Faded out');
    ic.class = 'fadedOut';
    ic.showView = false;
  };

  StyleService.getStyles();
}]);

/////////////////////////////////////////////
//    Home Controller
/////////////////////////////////////////////

app.controller('HomeController', ['NewsService','NgMap', 'LocationService', 'TransitService', 'WeatherService', 'CalendarService', '$http', function(NewsService,NgMap, LocationService, TransitService, WeatherService, CalendarService, $http){
  console.log('home controller loaded');
  var hc = this;

  // location
  hc.location = LocationService.location;

  // time
  hc.time = moment().format('hh:mm A');

  // attire icons
  hc.umbrellaURL = 'assets/images/attire/light_umbrella-light.png';
  hc.shortsURL = 'assets/images/attire/light_shorts-light.png';
  hc.pantsURL = 'assets/images/attire/light_pants-light.png';
  hc.jacketURL = 'assets/images/attire/light_jacket-light.png';
  hc.mittensURL = 'assets/images/attire/light_mitten-light.png';
  hc.tshirtURL = 'assets/images/attire/light_tshirt-light.png';

  // get transit info
  hc.stops = TransitService.savedStops;
  hc.selectedDepartureStop = {};
  hc.departures = TransitService.departures;
  hc.arrivalText = TransitService.arrivalText;

  // get data from factories
  hc.eventList = CalendarService.events;
  hc.conditions = WeatherService.conditions;
  hc.hourly = WeatherService.hourly;
  hc.articleList = NewsService.articleList;

  hc.getDepartureInfo = function(){
    if(hc.selectedDepartureStop){
      TransitService.getDepartureInfo(hc.selectedDepartureStop.route, hc.selectedDepartureStop.direction, hc.selectedDepartureStop.value);
    }
  };

  hc.showDepartureInfo = function(){
  // console.log('arrivalText', hc.arrivalText);
    if(hc.selectedDepartureStop === null || hc.selectedDepartureStop.value === undefined){
      hc.departureInfoClass="fadedOut";
      return false;
    } else {
      hc.departureInfoClass="fadedIn";
      return true;
    }
  };

  // news slider
  hc.currentIndex = 0;

  hc.setCurrentIndex = function(index){
    hc.currentIndex = index;
  };

  hc.isCurrentIndex = function(index){
    // maybe?
    if (hc.currentIndex === index){
      return true;
    } else {
      return false;
    }
  };

  hc.next = function(){
    if (hc.currentIndex === hc.articleList.length-1){
      hc.currentIndex = 0;
    } else {
      hc.currentIndex++;
    }
  };

  hc.previous = function(){
    if(hc.currentIndex === 0){
      hc.currentIndex = hc.articleList.length-1;
    } else {
      hc.currentIndex--;
    }
  };

  CalendarService.getCalendarEvents();
  WeatherService.getWeather();
  TransitService.getAllSavedStops();
  LocationService.getLocation();
  NewsService.getNews();

}]);

/////////////////////////////////////////////
//    Settings Controller
/////////////////////////////////////////////

app.controller('SettingsController', ['StyleService', 'LocationService', 'TransitService', function(StyleService, LocationService, TransitService){
  console.log('settings controller loaded');
  var sc = this;

  // add bus stops
  sc.selectedRoute = {};
  sc.selectedDirection = '';
  sc.routes = TransitService.routes;
  sc.cardinalDirections = TransitService.cardinalDirections;
  sc.stops = TransitService.stops;
  sc.createStopResponse = TransitService.createStopResponse;

  // edit bus stops
  sc.editStops = TransitService.savedStops;
  sc.selectedDepartureStop = {};

  // styles
  sc.selectedStyle = {};

  // location
  sc.currentLocation = LocationService.location;
  sc.location = {};


  // location
  sc.setLocation = function(){
    LocationService.setLocation(sc.location.address, sc.location.city, sc.location.state, sc.location.zip, sc.location.weather, sc.location.transit);
  };

  // transit
  sc.getRoutes = function(){
    TransitService.getRoutes();
  };

  sc.getDirection = function(){
    if(sc.selectedRoute){
      TransitService.getDirection(sc.selectedRoute);
    }
  };

  sc.getStops = function(){
    TransitService.getStops(sc.selectedRoute, sc.selectedDirection);
  };

  sc.createStop = function(){
    TransitService.createStop(sc.selectedStop, sc.selectedRoute, sc.selectedDirection);
  };

  sc.cancelCreateStop = function(){
    sc.stops.length = 0;
    sc.routes.length = 0;
    TransitService.clearCardinalDirections();
  }

  sc.editBusStops = function(){
    TransitService.getAllSavedStops();
  }

  sc.removeBusStop = function(){
    TransitService.removeBusStop(sc.selectedDepartureStop);
  }

  // styles
  sc.saveStyles = function(){
    StyleService.saveStyles(sc.selectedStyle);
  };

  sc.getStyles = function(){
    StyleService.getStyles();
  }

  LocationService.getLocation();
}]);

/////////////////////////////////////////////
//    Transit Service
/////////////////////////////////////////////

app.factory('TransitService', ['NgMap', '$http', function(NgMap, $http){
  var routes = [];
  var northSouth = false;
  var eastWest = false;
  var cardinalDirections = {};
  var stops = [];
  var createStopResponse = {value: 0};
  var savedStops = [];
  var departures = [];
  var busMarkerPosition = {};
  var busMarkerIcon = '/assets/images/transit/tiny_bus_icon.png';
  var arrivalText = '';

  // save bus stop

  var getRoutes = function(){
    $http.get('/transit/routes').then(function(response){
      console.log('Got routes:', response);
      angular.copy(response.data, routes);
    });
  };

  var getDirection = function(routeID){
    console.log('Getting directions for:', routeID);
    $http.get('/transit/direction/' + routeID.Route).then(function(response){
      console.log('Got directions:', response.data);
      var responseData = response.data;
      if (responseData === 'northSouth'){
        northSouth = true;
        eastWest = false;
      } else {
        eastWest = true;
        northSouth = false;
      }
      angular.copy({eastWest: eastWest, northSouth: northSouth}, cardinalDirections);
      console.log('cardinalDirections', cardinalDirections);
    });
  };

  var getStops = function(routeID, directionID){
    console.log('Getting stops for:', routeID, directionID);
    $http.get('/transit/stops/' + routeID.Route + '/' + directionID).then(function(response){
      console.log('Got stops:', response.data);
      angular.copy(response.data, stops);
    });
  };

  var createStop = function(stop, route, direction){
    var newStop = {name: stop.Text , value: stop.Value, route: route.Route, direction: direction};
    $http.post('/transit/create', newStop).then(function(response){
      console.log('Stop saved.', response.status);
      createStopResponse.value = response.status;
    }, function(response){
      console.log('Stop not saved.', response.status);
      createStopResponse.value = response.status;
    });
  };

  // get stop info

  var getAllSavedStops = function(){
    $http.get('/transit/all').then(function(response){
      console.log('Retrieved stops from database:', response);
      // console.log('Factory stops:', savedStops);
      angular.copy(response.data, savedStops);
    });
  };

  var getDepartureInfo = function(routeID, directionID, stopID){
    console.log('Getting departure info for:', routeID, directionID, stopID);
    $http.get('/transit/departure/' + routeID + '/' + directionID + '/' + stopID).then(function(response){
      console.log('Got departure info:', response.data);
      angular.copy(response.data, departures);

      if(departures[0].departureText.includes('Min')){
        console.log('min true');
        departures[0].arrivalText = 'Your bus will arrive at your selected stop in:';
      } else if (departures[0].departureText.includes(':')){
        console.log(': true');
        departures[0].arrivalText = 'Your bus will arrive at your selected stop at:';
      } else if (departures[0].departureText.includes('Due')){
        departures[0].arrivalText = 'Your bus will be arriving shortly.';
        departures[0].departureText = '';
      }
      console.log('departures[0]:', departures[0]);

      // google maps
      NgMap.getMap({id: 'map'}).then(function(map){
        busMarkerPosition.lat = departures[0].lat;
        busMarkerPosition.lng = departures[0].lng;
        console.log('busMarkerPosition', busMarkerPosition);
        var busMarker = new google.maps.Marker({position: busMarkerPosition, icon: busMarkerIcon}); // should add train icon logic too
        busMarker.setMap(map);
      });
    });
  };

  // edit stops

  var removeBusStop = function(stop){
    $http.delete('/transit/remove/' + stop._id).then(function(response){
      console.log('Removed bus stop');
      getAllSavedStops();
    });
  };

  var clearCardinalDirections = function(){
    angular.copy({eastWest: false, northSouth: false}, cardinalDirections);
    //console.log(cardinalDirections);
  }

  return {
    getRoutes: getRoutes,
    routes: routes,
    getDirection: getDirection,
    cardinalDirections: cardinalDirections,
    getStops: getStops,
    stops: stops,
    createStop: createStop,
    createStopResponse: createStopResponse,
    getAllSavedStops: getAllSavedStops,
    savedStops: savedStops,
    getDepartureInfo: getDepartureInfo,
    departures: departures,
    removeBusStop: removeBusStop,
    clearCardinalDirections: clearCardinalDirections,
    arrivalText: arrivalText
  }
}]);

/////////////////////////////////////////////
//    Calendar Service
/////////////////////////////////////////////

app.factory('CalendarService', ['$http', function($http){
  var events = [];

  var getCalendarEvents = function(){
    $http.get('/calendar').then(function(response){
      console.log('client side calendar response:', response);
      var tempEvents = [];
      // loop through eventList and format times
      response.data.map(function(event){
        var today = moment();
        var dateStart = moment(event.start);
        var tempStart = moment(event.start).format('ddd MMM D');
        var tempEnd = moment(event.end);
        var tempTimeStart = moment(event.start).format('HH:mm');
        var tempTimeEnd = moment(event.end).format('HH:mm');
        var isToday = false;
        if(today.dayOfYear() === moment(event.start).dayOfYear()){
          isToday = true;
        } else {
          isToday = false;
        }
        tempEvents.push({title: event.title, dateStart: dateStart, start: tempStart, end: tempEnd, timeStart: tempTimeStart, timeEnd: tempTimeEnd, isToday: isToday});
      });
      angular.copy(tempEvents, events);
    });
  }

  return {
    events: events,
    getCalendarEvents: getCalendarEvents
  }
}]);

/////////////////////////////////////////////
//    Weather Service
/////////////////////////////////////////////

app.factory('WeatherService', ['$http', function($http){
  var hourly = [];
  var conditions = {};

  var getWeather = function(){
    $http.get('/weather').then(function(response){
      console.log('client side weather response:', response);
      angular.copy(response.data.conditionObject, conditions);
      angular.copy(response.data.hourlyList, hourly);
    });
  }

  return {
    hourly: hourly,
    conditions: conditions,
    getWeather: getWeather
  }
}]);

/////////////////////////////////////////////
//    Location Service
/////////////////////////////////////////////

app.factory('LocationService', ['NgMap', '$http', function(NgMap, $http){
  var locationResponseStatus = 0;
  var location = {};
  var latLng = {};
  var homeMarkerPosition = {};
  var homeMarkerIcon = '/assets/images/transit/home.png';
  var homeMarker = {};

  var setLocation = function(address, city, state, zip, weather, transit){
    var location = {address: address, city: city, state: state, zip: zip, weather: weather, transit: transit};
    $http.post('/location', location).then(function(response){
      console.log('location posted successfully');
      locationResponseStatus = response.status;
      getLocation();
    });
  };

  var getLocation = function(){
    $http.get('/location').then(function(response){
      console.log('Retrieved location:', response);
      angular.copy(response.data, location);

      NgMap.getMap({id:'map'}).then(function(map){
        var geocode = new google.maps.Geocoder();
        var addressString = location.address + " " + location.city + " " + location.state + " " + location.zip;
        geocode.geocode({address: addressString}, function(results, status){
          console.log('results', results);
          homeMarkerPosition = results[0].geometry.location;
          map.setCenter(results[0].geometry.location);
          homeMarker = new google.maps.Marker({position: homeMarkerPosition, icon: homeMarkerIcon});
          homeMarker.setMap(map);
        });
      });
    });
  };

  return {
    setLocation: setLocation,
    locationResponseStatus: locationResponseStatus,
    getLocation: getLocation,
    location: location
  }
}]);

/////////////////////////////////////////////////////////////
//    Style Service (includes Astronomy picture of the day)
/////////////////////////////////////////////////////////////

app.factory('StyleService', ['$http', function($http){
  var apod = {};
  var savedStyles = {};

  var getAPOD = function(){
    $http.get('/style/apod').then(function(response){
      console.log('Got APOD:', response);
      angular.copy(response.data, apod);
    });
  };

  var saveStyles = function(styles){
    $http.put('/style/save', styles).then(function(response){
      console.log('Styles posted successfully.');
      getStyles();
    });
  };

  var getStyles = function(){
    $http.get('/style/all').then(function(response){
      console.log('Got styles:', response);
      angular.copy(response.data, savedStyles);
    });
  };

  return {
    apod: apod,
    getAPOD: getAPOD,
    saveStyles: saveStyles,
    getStyles: getStyles,
    savedStyles: savedStyles
  }
}]);

/////////////////////////////////////////////////////////////
//    News Service
/////////////////////////////////////////////////////////////

app.factory('NewsService', ['$http', function($http){
  var articleList = [];

  var getNews = function(){
    $http.get('/news/viewed').then(function(response){
      console.log('Client side news response:', response);
      angular.copy(response.data.results, articleList);
    });
  };

  return{
    getNews: getNews,
    articleList: articleList
  }
}]);
