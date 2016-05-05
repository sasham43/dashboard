var app = angular.module('dashboardApp', ['ngRoute']);

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

app.controller('HomeController', ['WeatherService', 'CalendarService', '$http', function(WeatherService,CalendarService, $http){
  console.log('home controller loaded');
  var hc = this;

  // time
  hc.time = moment().format('hh:mm A');

  // attire icons
  hc.umbrellaURL = 'assets/images/attire/umbrella-light.png';
  hc.shortsURL = 'assets/images/attire/shorts-light.png';
  hc.pantsURL = 'assets/images/attire/pants-light.png';
  hc.jacketURL = 'assets/images/attire/jacket-light.png';
  hc.mittensURL = 'assets/images/attire/mitten-light.png';
  hc.tshirtURL = 'assets/images/attire/tshirt-light.png';

  // get data from factories
  hc.eventList = CalendarService.events;
  hc.conditions = WeatherService.conditions;
  hc.hourly = WeatherService.hourly;

  CalendarService.getCalendarEvents();
  WeatherService.getWeather();

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
  //sc.showRouteSelector = TransitService.showRouteSelector;

  sc.logDirections = function(){
    console.log('sc.cardinalDirections:', sc.cardinalDirections);
    console.log('sc.cardinalDirections.eastWest:', sc.cardinalDirections.eastWest);
    console.log('sc.cardinalDirections.northSouth:', sc.cardinalDirections.northSouth);
  }

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
}]);

/////////////////////////////////////////////
//    Transit Service
/////////////////////////////////////////////

app.factory('TransitService', ['$http', function($http){
  var routes = [];
  var northSouth = false;
  var eastWest = false;
  var cardinalDirections = {};
  var stops = [];

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


  return {
    getRoutes: getRoutes,
    routes: routes,
    getDirection: getDirection,
    cardinalDirections: cardinalDirections,
    getStops: getStops,
    stops: stops
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

app.factory('LocationService', ['$http', function($http){

  var locationResponseStatus = 0;
  var setLocation = function(address, city, state, zip, weather, transit){
    var location = {address: address, city: city, state: state, zip: zip, weather: weather, transit: transit};
    $http.post('/location', location).then(function(response){
      console.log('location posted successfully');
      locationResponseStatus = response.status;
    });
  }

  return {
    setLocation: setLocation,
    locationResponseStatus: locationResponseStatus
  }
}]);
