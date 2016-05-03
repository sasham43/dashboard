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
  hc.displayEvents = [];

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
