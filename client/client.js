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

app.controller('HomeController', ['CalendarService',function(CalendarService){
  console.log('home controller loaded');
  var hc = this;
  hc.eventList = CalendarService.events;

  CalendarService.getCalendarEvents();
}]);

app.controller('SettingsController', ['$http', function($http){
  console.log('settings controller loaded');
}]);

app.factory('CalendarService', ['$http', function($http){
  var events = [];

  var getCalendarEvents = function(){
    $http.get('/calendar').then(function(response){
      console.log('client side calendar response:', response);
      //events = response;
      angular.copy(response.data, events);
    });
  }

  return {
    events: events,
    getCalendarEvents: getCalendarEvents
  }
}]);
