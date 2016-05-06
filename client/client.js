var app = angular.module('dashboardApp', ['ngRoute', 'ngMap']);

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
//    Home Controller
/////////////////////////////////////////////

app.controller('HomeController', ['NgMap', 'LocationService', 'TransitService', 'WeatherService', 'CalendarService', '$http', function(NgMap, LocationService, TransitService, WeatherService, CalendarService, $http){
  console.log('home controller loaded');
  var hc = this;


  // location
  hc.location = LocationService.location;

  // time
  hc.time = moment().format('hh:mm A');

  // attire icons
  hc.umbrellaURL = 'assets/images/attire/umbrella-light.png';
  hc.shortsURL = 'assets/images/attire/shorts-light.png';
  hc.pantsURL = 'assets/images/attire/pants-light.png';
  hc.jacketURL = 'assets/images/attire/jacket-light.png';
  hc.mittensURL = 'assets/images/attire/mitten-light.png';
  hc.tshirtURL = 'assets/images/attire/tshirt-light.png';

  // get transit info
  hc.stops = TransitService.savedStops;
  hc.selectedDepartureStop = {};
  hc.departures = TransitService.departures;

  // get data from factories
  hc.eventList = CalendarService.events;
  hc.conditions = WeatherService.conditions;
  hc.hourly = WeatherService.hourly;

  hc.getDepartureInfo = function(){
    TransitService.getDepartureInfo(hc.selectedDepartureStop.route, hc.selectedDepartureStop.direction, hc.selectedDepartureStop.value);
    hc.updateMap();
  };

  hc.logMaps = function(){
      //console.log('latLng:', hc.latLng);
    //hc.map.center = hc.latLng;
  }

  CalendarService.getCalendarEvents();
  WeatherService.getWeather();
  TransitService.getAllSavedStops();
  LocationService.getLocation();

  hc.updateMap();

}]);

/////////////////////////////////////////////
//    Settings Controller
/////////////////////////////////////////////

app.controller('SettingsController', ['LocationService', 'TransitService', function(LocationService, TransitService){
  console.log('settings controller loaded');
  var sc = this;
  sc.selectedRoute = {};
  sc.selectedDirection = '';
  sc.routes = TransitService.routes;
  sc.cardinalDirections = TransitService.cardinalDirections;
  sc.stops = TransitService.stops;
  sc.createStopResponse = TransitService.createStopResponse;

  // location
  sc.location = {};
  sc.setLocation = function(){
    LocationService.setLocation(sc.location.address, sc.location.city, sc.location.state, sc.location.zip, sc.location.weather, sc.location.transit);
  }

  // transit
  sc.getRoutes = function(){
    TransitService.getRoutes();
  };

  sc.getDirection = function(){
    TransitService.getDirection(sc.selectedRoute);
  }

  sc.getStops = function(){
    TransitService.getStops(sc.selectedRoute, sc.selectedDirection);
  }

  sc.createStop = function(){
    TransitService.createStop(sc.selectedStop, sc.selectedRoute, sc.selectedDirection);
  }
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
  var busIcon = '/assets/images/transit/tiny_bus_icon.png';

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
      angular.copy(response.data, savedStops);
    });
  };

  var getDepartureInfo = function(routeID, directionID, stopID){
    console.log('Getting departure info for:', routeID, directionID, stopID);
    $http.get('/transit/departure/' + routeID + '/' + directionID + '/' + stopID).then(function(response){
      console.log('Got departure info:', response.data);
      angular.copy(response.data, departures);

      // google maps
      NgMap.getMap({id: 'map'}).then(function(map){
        busMarkerPosition.lat = departures[0].lat;
        busMarkerPosition.lng = departures[0].lng;
        console.log('busMarkerPosition', busMarkerPosition);
        var busMarker = new google.maps.Marker({position: busMarkerPosition});
        busMarker.setMap(map);
      });
    });
  };

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
    departures: departures
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
        var tempStart = moment(event.start).format('HH:mm');
        var tempEnd = moment(event.end).format('HH:mm');
        tempEvents.push({title: event.title, start: tempStart, end: tempEnd});
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
