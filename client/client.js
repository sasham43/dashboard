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
      controller: 'SettingsController'
    });

  $locationProvider.html5Mode(true);
}]);

app.controller('HomeController', ['WeatherService', 'CalendarService', '$http', function(WeatherService,CalendarService, $http){
  console.log('home controller loaded');
  var hc = this;
  hc.umbrellaURL = 'assets/images/attire/umbrella-light.png';
  hc.shortsURL = 'assets/images/attire/shorts-light.png';
  hc.pantsURL = 'assets/images/attire/pants-light.png';
  hc.jacketURL = 'assets/images/attire/jacket-light.png';
  hc.mittensURL = 'assets/images/attire/mitten-light.png';
  hc.tshirtURL = 'assets/images/attire/tshirt-light.png';
  hc.eventList = CalendarService.events;
  hc.conditions = WeatherService.conditions;
  hc.hourly = WeatherService.hourly;

  CalendarService.getCalendarEvents();
  WeatherService.getWeather();

}]);

app.controller('SettingsController', ['$http', function($http){
  console.log('settings controller loaded');
}]);

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
